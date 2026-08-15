import type { Book } from '@learning-treehouse/book-model';

/**
 * Local-only demo content for prototyping Read Together with denser page text than
 * Mary's single-line nursery-rhyme pages. Original text, written for this purpose —
 * not a real MVP book, not wired into the shelf, not persisted. Scoped to packet-m008.
 */
export const readTogetherDemoBook: Book = {
  id: 'read-together-demo-the-oak-tree-notebook',
  title: 'The Oak Tree Notebook',
  availability: 'full',
  license: {
    sourceTier: 'custom-family',
    licenseName: 'Original demo text',
    attribution: 'Written for Learning Treehouse as placeholder Read Together demo content. Not a real MVP book.',
  },
  pages: [
    {
      id: 'oak-page-1',
      order: 1,
      readAlong: {
        text: 'Every Saturday morning, Mira climbed the old oak tree behind her house. She loved the way the leaves rustled just before she reached the top. From the highest branch, she could see the whole backyard laid out like a map.',
        wordIds: [],
      },
    },
    {
      id: 'oak-page-2',
      order: 2,
      readAlong: {
        text: 'Today she brought her notebook and a stub of a pencil. She wanted to write down everything she noticed from up there. A pair of sparrows landed nearby, chattering about nothing in particular.',
        wordIds: [],
      },
    },
    {
      id: 'oak-page-3',
      order: 3,
      readAlong: {
        text: 'Mira wrote down the sparrows first, then the shape of the clouds, then the smell of cut grass drifting up from below. Her little brother called up to her, asking if he could come too. She lowered the rope ladder and waited for him to climb.',
        wordIds: [],
      },
    },
    {
      id: 'oak-page-4',
      order: 4,
      readAlong: {
        text: 'Together they counted thirteen ants marching along a branch in a perfectly straight line. Neither of them could explain how the ants always knew exactly where to go. It was, they decided, one of the tree’s small mysteries.',
        wordIds: [],
      },
    },
    {
      id: 'oak-page-5',
      order: 5,
      readAlong: {
        text: 'When the sky turned orange, they knew it was almost time for dinner. Mira closed her notebook and tucked the pencil behind her ear. Tomorrow, she thought, there would be new things to notice.',
        wordIds: [],
      },
    },
  ],
  words: [],
  activities: [],
  rewards: [],
};
