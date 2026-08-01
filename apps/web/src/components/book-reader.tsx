"use client";

import Link from "next/link";
import { useState } from "react";

import type { Book } from "@learning-treehouse/book-model";

type BookReaderProps = {
  book: Book;
};

export function BookReader({ book }: BookReaderProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isPretendingToRecord, setIsPretendingToRecord] = useState(false);
  const [pretendRecordingPageId, setPretendRecordingPageId] = useState<string | null>(null);
  const [isPretendingToPlay, setIsPretendingToPlay] = useState(false);

  const page = book.pages[pageIndex];

  if (!page) {
    return null;
  }

  const pageWords = book.words.filter((word) => word.pageId === page.id);
  const hasPretendRecording = pretendRecordingPageId === page.id;
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === book.pages.length - 1;
  const recordLabel = isPretendingToRecord ? "Stop pretend recording" : "Start pretend recording";

  function moveToPage(nextIndex: number) {
    setPageIndex(nextIndex);
    setIsPretendingToRecord(false);
    setIsPretendingToPlay(false);
  }

  function togglePretendRecording() {
    setIsPretendingToRecord((isRecording) => {
      if (isRecording) {
        setPretendRecordingPageId(page.id);
      }

      return !isRecording;
    });
    setIsPretendingToPlay(false);
  }

  function togglePretendPlayback() {
    if (!hasPretendRecording) {
      return;
    }

    setIsPretendingToPlay((isPlaying) => !isPlaying);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-10 text-[#24352b] sm:px-8">
      <Link className="inline-flex font-bold text-[#285842] underline underline-offset-4" href="/">
        ← Back to the shelf
      </Link>

      <article className="mt-7 rounded-3xl border border-[#285842]/20 bg-[#fffdf8] p-6 shadow-lg shadow-[#24352b]/10 sm:p-10">
        <p className="text-sm font-extrabold tracking-[0.12em] text-[#285842] uppercase">Read together</p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-[#173b2b] sm:text-5xl">
          {book.title}
        </h1>
        <p className="mt-4 text-sm font-bold text-[#4e6254]" aria-live="polite">
          Page {pageIndex + 1} of {book.pages.length}
        </p>

        <section className="mt-8 rounded-2xl bg-[#fff9ed] p-6 sm:p-8" aria-labelledby="page-reading-heading">
          <h2 id="page-reading-heading" className="sr-only">
            Read-along text
          </h2>
          <p className="font-serif text-3xl leading-relaxed text-[#173b2b] sm:text-4xl">{page.readAlong.text}</p>
        </section>

        <section className="mt-7" aria-labelledby="page-words-heading">
          <h2 id="page-words-heading" className="text-lg font-bold text-[#173b2b]">
            Words to notice
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Words on page ${pageIndex + 1}`}>
            {pageWords.map((word) => (
              <li key={word.id} className="rounded-full bg-[#e8f3d8] px-4 py-2 font-semibold text-[#285842]">
                {word.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-dashed border-[#8a5d3b]/45 p-5" aria-labelledby="pretend-recording-heading">
          <h2 id="pretend-recording-heading" className="text-lg font-bold text-[#173b2b]">
            Read in your own voice
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#4e6254]">
            This is a pretend control for this early test. It does not use a microphone, save a recording, or play audio.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-[#285842] px-5 py-3 font-bold text-white transition hover:bg-[#173b2b] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1f6bb0]"
              type="button"
              aria-pressed={isPretendingToRecord}
              onClick={togglePretendRecording}
            >
              {recordLabel}
            </button>
            <button
              className="rounded-full border border-[#285842] px-5 py-3 font-bold text-[#285842] transition hover:bg-[#e8f3d8] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1f6bb0]"
              type="button"
              aria-pressed={isPretendingToPlay}
              disabled={!hasPretendRecording || isPretendingToRecord}
              onClick={togglePretendPlayback}
            >
              {isPretendingToPlay ? "Stop pretend playback" : "Play pretend recording"}
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold text-[#4e6254]" aria-live="polite">
            {isPretendingToRecord
              ? "Pretend recording — nothing is being captured."
              : isPretendingToPlay
                ? "Pretend playback — no audio is playing."
                : hasPretendRecording
                  ? "Pretend recording ready — it exists only in this page's browser memory."
                  : "Ready to record (pretend)."}
          </p>
        </section>

        <nav className="mt-9 flex items-center justify-between gap-4" aria-label="Book pages">
          <button
            className="rounded-full border border-[#285842] px-5 py-3 font-bold text-[#285842] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1f6bb0]"
            type="button"
            disabled={isFirstPage}
            onClick={() => moveToPage(pageIndex - 1)}
          >
            Previous page
          </button>
          <button
            className="rounded-full bg-[#f3b84d] px-5 py-3 font-bold text-[#173b2b] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1f6bb0]"
            type="button"
            disabled={isLastPage}
            onClick={() => moveToPage(pageIndex + 1)}
          >
            Next page
          </button>
        </nav>
      </article>
    </main>
  );
}
