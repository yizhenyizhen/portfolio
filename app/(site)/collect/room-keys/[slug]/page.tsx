import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/systems/i18n";
import { RoomKeyVisual } from "@/components/room-keys/RoomKeyVisual";
import {
  getLocalizedRoomKey,
  getLocalizedRoomKeys,
} from "@/data/room-key-translations";
import { roomKeys } from "@/data/roomKeys";
import { formatMessage, getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizeHref } from "@/lib/i18n/routing";

type RoomKeyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return roomKeys.map((roomKey) => ({ slug: roomKey.id }));
}

export async function generateMetadata({
  params,
}: RoomKeyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const roomKey = getLocalizedRoomKey(slug, locale);

  if (!roomKey) {
    return { title: messages.roomKeys.notFound };
  }

  return {
    title: roomKey.title,
    description: formatMessage(messages.roomKeys.metadataDescription, {
      title: roomKey.title,
    }),
  };
}

export default async function RoomKeyPage({ params }: RoomKeyPageProps) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const localizedRoomKeys = getLocalizedRoomKeys(locale);
  const roomKey = getLocalizedRoomKey(slug, locale);

  if (!roomKey) {
    notFound();
  }

  const currentIndex = localizedRoomKeys.findIndex(
    (item) => item.id === roomKey.id,
  );
  const previous =
    localizedRoomKeys[
      (currentIndex - 1 + localizedRoomKeys.length) % localizedRoomKeys.length
    ];
  const next = localizedRoomKeys[(currentIndex + 1) % localizedRoomKeys.length];
  const portrait = roomKey.height > roomKey.width;

  return (
    <main className="site-page">
      <div className="site-page__frame">
        <section className="grid min-h-screen grid-rows-[auto_1fr_auto] py-[var(--space-page-block)] [min-height:100dvh]">
          <div className="flex items-start justify-between gap-8 border-b border-white/12 pb-4">
            <Link
              href={localizeHref("/collect#room-keys", locale)}
              className="site-page__back-link"
            >
              <span aria-hidden="true">&larr;</span>
              {messages.roomKeys.back}
            </Link>
            <div className="flex items-center gap-3">
              <p className="type-label m-0 text-right text-[var(--color-text-muted)] uppercase">
                {messages.roomKeys.placeholderRecord}
              </p>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="grid place-items-center py-[clamp(4rem,9vw,8rem)]">
            <div
              className={
                portrait
                  ? "w-[min(56vw,20rem)]"
                  : "w-[min(78vw,42rem)]"
              }
              style={{
                aspectRatio: `${roomKey.width} / ${roomKey.height}`,
              }}
            >
              <RoomKeyVisual
                roomKey={roomKey}
                priority
                sizes={
                  portrait
                    ? "(max-width: 48rem) 56vw, 20rem"
                    : "(max-width: 48rem) 78vw, 42rem"
                }
              />
            </div>
          </div>

          <div className="grid gap-8 border-t border-white/12 pt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <Link
              href={localizeHref(previous.href, locale)}
              className="group flex min-h-11 flex-col justify-end"
              aria-label={formatMessage(messages.roomKeys.previousLabel, {
                title: previous.title,
              })}
            >
              <span className="type-index text-[var(--color-text-muted)] uppercase">
                {messages.roomKeys.previous}
              </span>
              <span className="type-body-small mt-2 uppercase opacity-70 transition-opacity group-hover:opacity-100">
                {previous.title}
              </span>
            </Link>
            <div className="sm:text-center">
              <p className="type-label m-0 text-[var(--color-text-muted)] uppercase">
                {messages.roomKeys.collection}
              </p>
              <h1 className="type-section-title mb-0 mt-2 font-medium uppercase">
                {roomKey.title}
              </h1>
            </div>
            <Link
              href={localizeHref(next.href, locale)}
              className="group flex min-h-11 flex-col justify-end sm:text-right"
              aria-label={formatMessage(messages.roomKeys.nextLabel, {
                title: next.title,
              })}
            >
              <span className="type-index text-[var(--color-text-muted)] uppercase">
                {messages.roomKeys.next}
              </span>
              <span className="type-body-small mt-2 uppercase opacity-70 transition-opacity group-hover:opacity-100">
                {next.title}
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
