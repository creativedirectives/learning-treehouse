import { BookShelf } from "@/components/book-shelf";
import { books } from "@/data/books";

export default function Home() {
  return (
    <main className="treehouse-home">
      <section className="treehouse-intro" aria-labelledby="home-title">
        <p className="eyebrow">Your cozy reading treehouse</p>
        <h1 id="home-title">Pick a book to begin</h1>
        <p className="intro-copy">
          Every book opens a new reading adventure. Read together, discover new
          words, and grow your treehouse one story at a time.
        </p>
      </section>

      <BookShelf books={books} />
    </main>
  );
}
