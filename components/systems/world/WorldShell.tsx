import Link from "next/link";
import { WorldChapterExperience } from "@/components/systems/world/WorldChapterExperience";
import { WorldSection } from "@/components/systems/world/WorldSection";
import { WorldSidebar } from "@/components/systems/world/WorldSidebar";
import { getPrimaryNavigationItems } from "@/lib/navigation/get-navigation";
import type { WorldDefinition } from "@/types/world";

export function WorldShell({ world }: { world: WorldDefinition }) {
  const chapters = [...world.chapters].sort((a, b) => a.order - b.order);
  const navigation = getPrimaryNavigationItems();
  const worldIndex = navigation.findIndex((item) => item.slug === world.slug);

  return (
    <main className="site-page">
      <div className="site-page__frame">
        <header className="site-page__header">
          <div className="site-page__topbar">
            <Link
              href={{ pathname: "/", query: { world: world.slug } }}
              className="site-page__back-link"
            >
              <span aria-hidden="true">&larr;</span>
              Back to home
            </Link>
            <p className="site-page__index">
              {String(worldIndex + 1).padStart(2, "0")} /{" "}
              {String(navigation.length).padStart(2, "0")}
            </p>
          </div>

          <div className="site-page__hero">
            <p className="site-page__eyebrow">{world.name}</p>
            <h1 className="site-page__world-title">
              {world.label}
            </h1>
            <p className="site-page__lede">
              {world.summary}
            </p>
          </div>
        </header>

        <div className="site-page__content-grid">
          <WorldSidebar
            key={world.slug}
            chapters={chapters}
            worldLabel={world.label}
          />

          <div className="site-page__content">
            {chapters.map((chapter, index) => (
              <WorldSection
                key={chapter.slug}
                chapter={chapter}
                index={index}
              >
                <WorldChapterExperience experience={chapter.experience} />
              </WorldSection>
            ))}
          </div>
        </div>

        <footer className="site-page__footer">
          <nav aria-label="World navigation">
            <p className="site-page__footer-label">
              Continue exploring
            </p>
            <ul className="site-page__footer-list">
              {navigation.map((item) => (
                <li key={item.slug}>
                  {item.slug === world.slug ? (
                    <span
                      aria-current="page"
                      className="site-page__footer-link"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="site-page__footer-link"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </div>
    </main>
  );
}
