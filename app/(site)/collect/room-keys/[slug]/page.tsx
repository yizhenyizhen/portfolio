import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoomKeyVisual } from "@/components/room-keys/RoomKeyVisual";
import { getRoomKey, roomKeys } from "@/data/roomKeys";

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
  const roomKey = getRoomKey(slug);

  if (!roomKey) {
    return { title: "Room key not found" };
  }

  return {
    title: roomKey.title,
    description: `Placeholder archive record for ${roomKey.title}.`,
  };
}

export default async function RoomKeyPage({ params }: RoomKeyPageProps) {
  const { slug } = await params;
  const roomKey = getRoomKey(slug);

  if (!roomKey) {
    notFound();
  }

  const currentIndex = roomKeys.findIndex((item) => item.id === roomKey.id);
  const previous =
    roomKeys[(currentIndex - 1 + roomKeys.length) % roomKeys.length];
  const next = roomKeys[(currentIndex + 1) % roomKeys.length];
  const portrait = roomKey.height > roomKey.width;

  return (
    <main className="site-page">
      <div className="site-page__frame">
        <section className="grid min-h-screen grid-rows-[auto_1fr_auto] py-[var(--space-page-block)] [min-height:100dvh]">
          <div className="flex items-start justify-between gap-8 border-b border-white/12 pb-4">
            <Link
              href="/collect#room-keys"
              className="site-page__back-link"
            >
              <span aria-hidden="true">&larr;</span>
              Back to Room Keys
            </Link>
            <p className="type-label m-0 pt-3 text-right text-[var(--color-text-muted)] uppercase">
              Placeholder record
            </p>
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
              href={previous.href}
              className="group flex min-h-11 flex-col justify-end"
              aria-label={`Previous room key, ${previous.title}`}
            >
              <span className="type-index text-[var(--color-text-muted)] uppercase">
                Previous
              </span>
              <span className="type-body-small mt-2 uppercase opacity-70 transition-opacity group-hover:opacity-100">
                {previous.title}
              </span>
            </Link>
            <div className="sm:text-center">
              <p className="type-label m-0 text-[var(--color-text-muted)] uppercase">
                Room Key Collection
              </p>
              <h1 className="type-section-title mb-0 mt-2 font-medium uppercase">
                {roomKey.title}
              </h1>
            </div>
            <Link
              href={next.href}
              className="group flex min-h-11 flex-col justify-end sm:text-right"
              aria-label={`Next room key, ${next.title}`}
            >
              <span className="type-index text-[var(--color-text-muted)] uppercase">
                Next
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
