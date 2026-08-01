import { getBookById } from "@learning-treehouse/book-model";
import { notFound } from "next/navigation";

import { BookReader } from "@/components/book-reader";

type BookPageProps = {
  params: Promise<{ bookId: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book || book.availability !== "full") {
    notFound();
  }

  return <BookReader book={book} />;
}
