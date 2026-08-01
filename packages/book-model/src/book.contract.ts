import type {
  Book,
  BookActivity,
  BookAvailability,
  BookLicense,
  BookPage,
  BookWord,
  LocalMockMastery,
  VoiceNote,
} from "./book";

type Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends <Value>() =>
  Value extends Right ? 1 : 2
  ? true
  : false;
type Expect<Condition extends true> = Condition;

type BookOwnsPages = Expect<Equal<Book["pages"][number], BookPage>>;
type BookOwnsWords = Expect<Equal<Book["words"][number], BookWord>>;
type BookOwnsActivities = Expect<Equal<Book["activities"][number], BookActivity>>;
type BookOwnsLicense = Expect<Equal<Book["license"], BookLicense>>;
type ActivityTargetUsesBookPageAndWordIds = Expect<
  Equal<
    Pick<BookActivity["target"], "bookId" | "pageIds" | "wordIds">,
    {
      readonly bookId: string;
      readonly pageIds?: readonly string[];
      readonly wordIds?: readonly string[];
    }
  >
>;
type LicenseCarriesAttribution = Expect<
  Equal<
    Pick<BookLicense, "sourceTier" | "licenseName" | "attribution">,
    {
      readonly sourceTier: "public-domain" | "open-license" | "custom-family";
      readonly licenseName: string;
      readonly attribution: string;
    }
  >
>;
type BookDistinguishesAvailability = Expect<
  Equal<Book["availability"], BookAvailability>
>;
type PageCarriesReadAlongWords = Expect<
  Equal<BookPage["readAlong"]["wordIds"][number], BookWord["id"]>
>;
type VoiceNoteCarriesBookAndPage = Expect<
  Equal<Pick<VoiceNote, "bookId" | "pageId">, { readonly bookId: string; readonly pageId: string }>
>;
type LocalMockMasteryCarriesRequiredFields = Expect<
  Equal<
    Pick<LocalMockMastery, "bookId" | "wordId" | "seenCount" | "missedCount" | "needsReview">,
    {
      readonly bookId: string;
      readonly wordId: string;
      readonly seenCount: number;
      readonly missedCount: number;
      readonly needsReview: boolean;
    }
  >
>;

export type BookContractAssertions =
  | BookOwnsPages
  | BookOwnsWords
  | BookOwnsActivities
  | BookOwnsLicense
  | ActivityTargetUsesBookPageAndWordIds
  | LicenseCarriesAttribution
  | BookDistinguishesAvailability
  | PageCarriesReadAlongWords
  | VoiceNoteCarriesBookAndPage
  | LocalMockMasteryCarriesRequiredFields;
