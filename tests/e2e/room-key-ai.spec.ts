import { expect, test } from "@playwright/test";

test.describe("Room Key Collection", () => {
  test("renders an extensible semantic dome and valid detail routes", async ({
    page,
  }) => {
    await page.goto("/collect");

    const dome = page.locator("[data-room-key-dome]");
    const links = dome.locator("[data-room-key-link]");

    await expect(dome).toBeVisible();
    await expect(links).toHaveCount(12);
    await expect(links.first()).toHaveAttribute(
      "href",
      "/collect/room-keys/room-key-001",
    );

    const standardCard = links.first();
    const width = Number(await standardCard.getAttribute("data-room-key-width"));
    const height = Number(
      await standardCard.getAttribute("data-room-key-height"),
    );

    expect(width / height).toBeCloseTo(85.6 / 54, 5);

    await expect(
      dome.locator('[data-room-key-shape="circle"]'),
    ).toHaveCount(1);
    await expect(
      dome.locator('[data-room-key-shape="irregular"]'),
    ).toHaveCount(1);

    await page.goto("/collect/room-keys/room-key-001");
    await expect(
      page.getByRole("heading", { name: "Room Key 001" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to Room Keys" }),
    ).toHaveAttribute("href", "/collect#room-keys");
  });

  test("rotates without navigating and remains keyboard operable", async ({
    page,
  }) => {
    await page.goto("/collect");

    const surface = page.getByLabel("Interactive room key archive");
    const sphere = page.locator("[data-room-key-sphere]");
    await surface.scrollIntoViewIfNeeded();
    const initialTransform = await sphere.evaluate(
      (element) => element.style.transform,
    );
    const bounds = await surface.boundingBox();

    expect(bounds).not.toBeNull();
    if (!bounds) return;

    await page.mouse.move(
      bounds.x + bounds.width * 0.42,
      bounds.y + bounds.height * 0.52,
    );
    await page.mouse.down();
    await page.mouse.move(
      bounds.x + bounds.width * 0.67,
      bounds.y + bounds.height * 0.48,
      { steps: 8 },
    );
    await page.mouse.up();

    await expect
      .poll(() => sphere.evaluate((element) => element.style.transform))
      .not.toBe(initialTransform);
    await expect(page).toHaveURL(/\/collect$/);

    const draggedTransform = await sphere.evaluate(
      (element) => element.style.transform,
    );
    await surface.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => sphere.evaluate((element) => element.style.transform))
      .not.toBe(draggedTransform);
  });

  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test(`${viewport.name} dome has no horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/collect");
      await expect(page.locator("[data-room-key-dome]")).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        page: document.documentElement.scrollWidth,
      }));

      expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
    });
  }
});

test.describe("Homepage AI workspace", () => {
  test("opens from the existing search arc and parses the internal stream", async ({
    page,
  }) => {
    await page.route("**/api/ai", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream; charset=utf-8",
        body: [
          'event: delta\ndata: {"type":"delta","text":"A calm "}\n\n',
          'event: delta\ndata: {"type":"delta","text":"streamed answer."}\n\n',
          'event: done\ndata: {"type":"done","responseId":"resp_test","citations":[]}\n\n',
        ].join(""),
      });
    });

    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Ask anything about Yizhen..." })
      .click();

    const dialog = page.getByRole("dialog");
    const question = page.getByLabel("Ask a question");
    await expect(dialog).toBeVisible();
    await expect(question).toBeFocused();
    await expect(dialog.locator("canvas")).toHaveCount(1);

    await question.fill("What is this website for?");
    await question.press("Enter");

    await expect(
      page.getByText("A calm streamed answer."),
    ).toBeVisible();
    await expect(page.getByText("New question")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole("searchbox", {
        name: "Ask anything about Yizhen...",
      }),
    ).toBeVisible();
  });

  test("supports multiline input and rejects invalid API requests safely", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Ask anything about Yizhen..." })
      .click();

    const question = page.getByLabel("Ask a question");
    await question.fill("First line");
    await question.press("Shift+Enter");
    await question.type("Second line");
    await expect(question).toHaveValue("First line\nSecond line");

    const response = await page.request.post("/api/ai", {
      data: { question: "   " },
    });
    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "invalid_request" },
    });
  });

  test("missing credentials produce a controlled workspace error", async ({
    page,
  }) => {
    test.skip(
      Boolean(process.env.OPENAI_API_KEY),
      "The local test server has live credentials.",
    );

    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Ask anything about Yizhen..." })
      .click();
    const question = page.getByLabel("Ask a question");
    await question.fill("Can you answer this?");
    await question.press("Enter");

    await expect(
      page.getByText(
        "The AI workspace is not connected yet. Please try again later.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });

  test("stops an in-flight request without losing the submitted question", async ({
    page,
  }) => {
    await page.route("**/api/ai", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      await route.abort("failed").catch(() => undefined);
    });

    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Ask anything about Yizhen..." })
      .click();

    const question = page.getByLabel("Ask a question");
    await question.fill("Keep this question after stopping.");
    await question.press("Enter");
    await page.getByRole("button", { name: "Stop generating answer" }).click();

    await expect(
      page.getByText("Generation stopped.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Ask a question" }),
    ).toHaveValue("Keep this question after stopping.");
  });

  test("uses a static Strands frame when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Ask anything about Yizhen..." })
      .click();

    const strands = page.getByRole("dialog").locator("[data-motion]");
    await expect(strands).toHaveAttribute("data-motion", "static");
    await expect(strands.locator("canvas")).toHaveCount(1);
  });
});
