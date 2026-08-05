import Link from "next/link";
import { Surface } from "@/components/primitives/surface/Surface";
import { LanguageSwitcher } from "@/components/systems/i18n";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizePath } from "@/lib/i18n/routing";

export default async function NotFound() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-[var(--space-page-inline)] py-[var(--space-section)]">
      <Surface>
        <div className="space-y-[clamp(0.75rem,2vw,1rem)]">
          <p className="type-label uppercase text-[var(--color-text-muted)]">
            {messages.notFound.eyebrow}
          </p>
          <h1 className="type-subsection-title max-w-[var(--measure-wide-title)] font-semibold text-[var(--color-text-primary)] [overflow-wrap:break-word] [text-wrap:balance]">
            {messages.notFound.title}
          </h1>
          <p className="type-body-small max-w-[var(--measure-body)] text-[var(--color-text-secondary)]">
            {messages.notFound.description}
          </p>
          <Link
            href={localizePath("/", locale)}
            className="type-navigation inline-flex min-h-[var(--touch-target)] items-center text-[var(--color-text-primary)] underline underline-offset-4"
          >
            {messages.notFound.action}
          </Link>
        </div>
      </Surface>
      <LanguageSwitcher placement="fixed" />
    </main>
  );
}
