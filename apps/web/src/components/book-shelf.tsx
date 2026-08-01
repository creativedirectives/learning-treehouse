import Link from "next/link";

import type { Book } from "@learning-treehouse/book-model";

type BookShelfProps = {
  readonly books: readonly Book[];
};

export function BookShelf({ books }: BookShelfProps) {
  return (
    <section className="book-shelf" aria-labelledby="shelf-title">
      <div className="shelf-heading">
        <div>
          <p className="eyebrow">The book shelf</p>
          <h2 id="shelf-title">Choose today&apos;s story</h2>
        </div>
        <p className="shelf-count">{books.length} books to explore</p>
      </div>

      <ul className="book-grid" role="list">
        {books.map((book, index) => (
          <li key={book.id}>
            {book.availability === "full" ? (
              <Link
                className="book-card book-card-link"
                href={`/books/${book.id}`}
                aria-label={`Read ${book.title}`}
              >
                <BookCover book={book} index={index} />
                <span className="book-card-content">
                  <span className="book-status">Ready to read</span>
                  <span className="book-title">{book.title}</span>
                  <span className="book-detail">
                    Read together, learn new words, and try story activities.
                  </span>
                  <span className="book-action">Open this book <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            ) : (
              <article className="book-card book-card-preview">
                <BookCover book={book} index={index} />
                <div className="book-card-content">
                  <span className="book-status">Preview · read-only</span>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-detail">
                    A shelf preview. Activities are not available for this book yet.
                  </p>
                  <span className="book-preview-label">Coming soon to the shelf</span>
                </div>
              </article>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function BookCover({ book, index }: { readonly book: Book; readonly index: number }) {
  return (
    <span className={`book-cover book-cover-${index + 1}`} aria-hidden="true">
      <span className="book-cover-stars">✦ ✦ ✦</span>
      <span className="book-cover-title">{book.title}</span>
      <span className="book-cover-mark">⌂</span>
    </span>
  );
}
