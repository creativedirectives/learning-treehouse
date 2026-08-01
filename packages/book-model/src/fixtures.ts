import type { Book, BookId } from "./book";

const maryHadALittleLamb: Book = {
  id: "mary-had-a-little-lamb",
  title: "Mary Had a Little Lamb",
  availability: "full",
  license: {
    sourceTier: "public-domain",
    licenseName: "Public domain — Mary’s Lamb (1830)",
    attribution: "Text adapted from “Mary’s Lamb” by Sarah Josepha Hale (1830), public domain. No artwork or audio is included.",
  },
  pages: [
    {
      id: "mary-page-1",
      order: 1,
      readAlong: { text: "Mary had a little lamb,", wordIds: ["mary-word-lamb"] },
    },
    {
      id: "mary-page-2",
      order: 2,
      readAlong: { text: "Its fleece was white as snow.", wordIds: ["mary-word-fleece", "mary-word-snow"] },
    },
    {
      id: "mary-page-3",
      order: 3,
      readAlong: { text: "And everywhere that Mary went,", wordIds: ["mary-word-everywhere"] },
    },
    {
      id: "mary-page-4",
      order: 4,
      readAlong: { text: "The lamb was sure to go.", wordIds: ["mary-word-sure"] },
    },
    {
      id: "mary-page-5",
      order: 5,
      readAlong: { text: "It followed her to school one day,", wordIds: ["mary-word-followed", "mary-word-school"] },
    },
    {
      id: "mary-page-6",
      order: 6,
      readAlong: { text: "Which was against the rule.", wordIds: ["mary-word-rule"] },
    },
  ],
  words: [
    {
      id: "mary-word-lamb",
      pageId: "mary-page-1",
      text: "lamb",
      normalizedText: "lamb",
      vocabulary: { definition: "A young sheep.", exampleSentence: "The lamb stayed close to Mary." },
    },
    {
      id: "mary-word-fleece",
      pageId: "mary-page-2",
      text: "fleece",
      normalizedText: "fleece",
      vocabulary: { definition: "The soft woolly coat of a sheep.", exampleSentence: "The lamb's fleece was soft." },
    },
    {
      id: "mary-word-snow",
      pageId: "mary-page-2",
      text: "snow",
      normalizedText: "snow",
      vocabulary: { definition: "Soft white flakes of frozen water that fall from the sky." },
    },
    {
      id: "mary-word-everywhere",
      pageId: "mary-page-3",
      text: "everywhere",
      normalizedText: "everywhere",
      vocabulary: { definition: "In every place." },
    },
    {
      id: "mary-word-sure",
      pageId: "mary-page-4",
      text: "sure",
      normalizedText: "sure",
      vocabulary: { definition: "Certain to happen." },
    },
    {
      id: "mary-word-followed",
      pageId: "mary-page-5",
      text: "followed",
      normalizedText: "followed",
      vocabulary: { definition: "Went after someone or something." },
    },
    {
      id: "mary-word-school",
      pageId: "mary-page-5",
      text: "school",
      normalizedText: "school",
      vocabulary: { definition: "A place where children learn." },
    },
    {
      id: "mary-word-rule",
      pageId: "mary-page-6",
      text: "rule",
      normalizedText: "rule",
      vocabulary: { definition: "An instruction about what is allowed." },
    },
  ],
  activities: [
    {
      id: "mary-read-together",
      kind: "read-together",
      target: {
        bookId: "mary-had-a-little-lamb",
        pageIds: ["mary-page-1", "mary-page-2", "mary-page-3", "mary-page-4", "mary-page-5", "mary-page-6"],
      },
    },
    {
      id: "mary-vocabulary",
      kind: "vocabulary",
      target: {
        bookId: "mary-had-a-little-lamb",
        wordIds: [
          "mary-word-lamb",
          "mary-word-fleece",
          "mary-word-snow",
          "mary-word-everywhere",
          "mary-word-sure",
          "mary-word-followed",
          "mary-word-school",
          "mary-word-rule",
        ],
      },
    },
    {
      id: "mary-comprehension",
      kind: "comprehension",
      target: { bookId: "mary-had-a-little-lamb", pageIds: ["mary-page-5", "mary-page-6"] },
      configuration: {
        prompt: "Where did the lamb follow Mary?",
        choiceA: "To school",
        choiceB: "To the moon",
        choiceC: "To the ocean",
        correctAnswerId: "choiceA",
      },
    },
  ],
  rewards: [
    {
      id: "mary-school-lantern",
      kind: "lantern",
      label: "Schoolhouse Lantern",
      activityId: "mary-comprehension",
    },
  ],
  progress: {
    mastery: [
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-lamb", seenCount: 1, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-fleece", seenCount: 0, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-snow", seenCount: 0, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-everywhere", seenCount: 0, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-sure", seenCount: 0, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-followed", seenCount: 0, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-school", seenCount: 0, missedCount: 0, needsReview: false },
      { bookId: "mary-had-a-little-lamb", wordId: "mary-word-rule", seenCount: 0, missedCount: 0, needsReview: false },
    ],
    rewards: [{ bookId: "mary-had-a-little-lamb", rewardId: "mary-school-lantern", earned: false }],
    voiceNotes: [],
  },
};

const readerOnlyBooks: readonly Book[] = [
  {
    id: "twinkle-twinkle-little-star",
    title: "Twinkle, Twinkle, Little Star",
    availability: "reader-only",
    license: {
      sourceTier: "public-domain",
      licenseName: "Public domain (traditional nursery rhyme)",
      attribution: "Traditional nursery rhyme; public-domain text. Reader-only placeholder with no artwork or audio.",
    },
    pages: [],
    words: [],
    activities: [],
    rewards: [],
  },
  {
    id: "the-itsy-bitsy-spider",
    title: "The Itsy Bitsy Spider",
    availability: "reader-only",
    license: {
      sourceTier: "public-domain",
      licenseName: "Public domain (traditional nursery rhyme)",
      attribution: "Traditional nursery rhyme; public-domain text. Reader-only placeholder with no artwork or audio.",
    },
    pages: [],
    words: [],
    activities: [],
    rewards: [],
  },
  {
    id: "jack-and-jill",
    title: "Jack and Jill",
    availability: "reader-only",
    license: {
      sourceTier: "public-domain",
      licenseName: "Public domain (traditional nursery rhyme)",
      attribution: "Traditional nursery rhyme; public-domain text. Reader-only placeholder with no artwork or audio.",
    },
    pages: [],
    words: [],
    activities: [],
    rewards: [],
  },
];

/** The only local Phase 1 content collection; no persistence or network access. */
export const books: readonly Book[] = [maryHadALittleLamb, ...readerOnlyBooks];

export function getBookById(bookId: BookId): Book | undefined {
  return books.find((book) => book.id === bookId);
}
