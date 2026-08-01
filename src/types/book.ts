/**
 * Canonical, JSON-serializable data contract for Learning Treehouse books.
 *
 * Activities only refer to pages and words owned by the same book. They never
 * introduce a separate content library for an activity type.
 */

export type BookId = string;
export type PageId = string;
export type WordId = string;
export type ActivityId = string;
export type RewardId = string;
export type VoiceNoteId = string;

export type BookAvailability = "full" | "reader-only";
export type ActivityKind =
  | "read-together"
  | "vocabulary"
  | "word-match"
  | "spelling"
  | "comprehension"
  | "family-participation";
export type RewardKind = "lantern" | "sticker" | "shelf-growth";
export type LicenseSourceTier = "public-domain" | "open-license" | "custom-family";

export interface AssetReference {
  /** Stable identifier or local asset path; it is not a network client. */
  readonly assetId: string;
  readonly altText?: string;
}

export interface ReadAlong {
  readonly text: string;
  readonly wordIds: readonly WordId[];
}

export interface BookPage {
  readonly id: PageId;
  readonly order: number;
  readonly illustration?: AssetReference;
  readonly narration?: AssetReference;
  readonly readAlong: ReadAlong;
}

export interface VocabularyEntry {
  readonly definition: string;
  readonly exampleSentence?: string;
  readonly audio?: AssetReference;
}

export interface BookWord {
  readonly id: WordId;
  readonly pageId: PageId;
  readonly text: string;
  readonly normalizedText: string;
  readonly vocabulary?: VocabularyEntry;
}

export interface ActivityTarget {
  readonly bookId: BookId;
  readonly pageIds?: readonly PageId[];
  readonly wordIds?: readonly WordId[];
}

export interface BookActivity {
  readonly id: ActivityId;
  readonly kind: ActivityKind;
  /** References only IDs that belong to the owning book. */
  readonly target: ActivityTarget;
  /** Activity settings remain book-owned, never a separate activity library. */
  readonly configuration?: Readonly<Record<string, string | number | boolean | null>>;
}

export interface RewardDefinition {
  readonly id: RewardId;
  readonly kind: RewardKind;
  readonly label: string;
  readonly activityId?: ActivityId;
}

export interface BookLicense {
  readonly sourceTier: LicenseSourceTier;
  readonly licenseName: string;
  readonly attribution: string;
  readonly sourceUrl?: string;
}

/** Local-only Phase 1–2 mock mastery. No storage, networking, or RAIVL types. */
export interface LocalMockMastery {
  readonly bookId: BookId;
  readonly wordId: WordId;
  readonly seenCount: number;
  readonly missedCount: number;
  readonly needsReview: boolean;
}

export interface RewardProgress {
  readonly bookId: BookId;
  readonly rewardId: RewardId;
  readonly earned: boolean;
}

/** A recording belongs to a particular page within a particular book. */
export interface VoiceNote {
  readonly id: VoiceNoteId;
  readonly bookId: BookId;
  readonly pageId: PageId;
  readonly audio: AssetReference;
  readonly durationSeconds: number;
}

export interface BookProgress {
  readonly mastery: readonly LocalMockMastery[];
  readonly rewards: readonly RewardProgress[];
  readonly voiceNotes: readonly VoiceNote[];
}

export interface Book {
  readonly id: BookId;
  readonly title: string;
  readonly availability: BookAvailability;
  readonly license: BookLicense;
  readonly pages: readonly BookPage[];
  readonly words: readonly BookWord[];
  readonly activities: readonly BookActivity[];
  readonly rewards: readonly RewardDefinition[];
  readonly progress?: BookProgress;
}
