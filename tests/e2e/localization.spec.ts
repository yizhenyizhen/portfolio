import { expect, test } from "@playwright/test";

test.describe("bilingual routing", () => {
  test("renders English and Simplified Chinese from clean URLs", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("button", { name: "切换为简体中文" }),
    ).toBeVisible();

    await page.goto("/zh");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(
      page.getByRole("searchbox", { name: "向 Yizhen 提问……" }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "身份导航" })
        .getByRole("link", { name: "作品集" }),
    ).toBeVisible();
  });

  test("preserves the current route, query, hash, and reading position", async ({
    page,
  }) => {
    await page.goto("/collect/room-keys/room-key-001?source=test#archive");
    await expect(page.getByRole("heading", { name: /Room Key 001/ })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 240));
    const currentHash = await page.evaluate(() => window.location.hash);

    await page
      .getByRole("button", { name: "切换为简体中文" })
      .dispatchEvent("click");

    await expect(page).toHaveURL(
      `/zh/collect/room-keys/room-key-001?source=test${currentHash}`,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(page.getByRole("heading", { name: "房卡 001" })).toBeVisible();

    await page.goto("/discover?world=discover");
    await page.evaluate(() => window.scrollTo(0, 520));
    const worldScroll = await page.evaluate(() => window.scrollY);
    await page
      .getByRole("button", { name: "切换为简体中文" })
      .dispatchEvent("click");

    await expect(page).toHaveURL(/\/zh\/discover\?world=discover(?:#.*)?$/);
    await expect(page.getByRole("heading", { name: "探索" })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(Math.max(0, worldScroll - 2));
  });

  test("localizes identity, room key, and not-found interfaces", async ({
    page,
  }) => {
    await page.goto("/zh/about");
    await expect(page.getByText("个人身份", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /返回首页/ })).toHaveAttribute(
      "href",
      "/zh",
    );

    await page.goto("/zh/collect/room-keys/room-key-001");
    await expect(page.getByRole("heading", { name: "房卡 001" })).toBeVisible();
    await expect(page.getByRole("link", { name: "返回房卡收藏" })).toHaveAttribute(
      "href",
      "/zh/collect#room-keys",
    );

    await page.goto("/zh/not-a-route");
    await expect(
      page.getByRole("heading", { name: "此路径不属于当前的网站结构。" }),
    ).toBeVisible();
  });

  test("keeps the language control keyboard accessible", async ({ page }) => {
    await page.goto("/create");
    const chinese = page.getByRole("button", { name: "切换为简体中文" });

    await chinese.focus();
    await expect(chinese).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/zh\/create$/);
    await expect(page.getByRole("heading", { name: "创作" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Switch to English" }),
    ).toHaveAttribute("aria-pressed", "false");

    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(/\/create$/);
    await expect(page.getByRole("heading", { name: "Create" })).toBeVisible();
  });
});

for (const route of ["/zh", "/zh/create", "/zh/about"]) {
  test(`${route} has no mobile horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      page: document.documentElement.scrollWidth,
    }));

    expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
    await expect(
      page.getByRole("navigation", { name: "语言选择" }),
    ).toBeVisible();
  });
}
