export interface Review {
  id: string;
  authorName: string;
  authorAvatarEmoji: string;
  timeAgo: string;
  rating: number;
  text: string;
}

export interface AiSummary {
  paragraph: string;
  tags: string[];
}

export interface ReviewData {
  averageRating: number;
  totalReviews: number;
  aiSummary: AiSummary;
  reviews: Review[];
}

export function getMockReviewData(_placeId: string): ReviewData {
  return {
    averageRating: 4.8,
    totalReviews: 1284,
    aiSummary: {
      paragraph:
        "Travelers love the beautiful beaches, rich culture and friendly locals. It's considered a must-visit destination, especially for nature lovers and adventure seekers.",
      tags: ['Beautiful beaches', 'Friendly locals', 'Great food', 'Well organized', 'Perfect for couples'],
    },
    reviews: [
      {
        id: 'review-1',
        authorName: 'Priya S.',
        authorAvatarEmoji: '👩🏻',
        timeAgo: '2 weeks ago',
        rating: 5,
        text: 'Absolutely loved it! The beaches are stunning and the local culture is so rich. Highly recommend!',
      },
      {
        id: 'review-2',
        authorName: 'Marcus T.',
        authorAvatarEmoji: '👨🏽',
        timeAgo: '1 month ago',
        rating: 5,
        text: 'One of the best trips of my life. Everything was well organized and the locals made us feel so welcome.',
      },
      {
        id: 'review-3',
        authorName: 'Aiko N.',
        authorAvatarEmoji: '👩🏻',
        timeAgo: '1 month ago',
        rating: 4,
        text: 'Great food and beautiful scenery. Would have liked a bit more free time, but overall a wonderful experience.',
      },
    ],
  };
}