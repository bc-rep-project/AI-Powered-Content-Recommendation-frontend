export interface Recommendation {
    content_id: string;
    title: string;
    description: string;
    type: 'article' | 'video' | 'product';
    image_url: string;
    metadata: {
        author?: string;
        readTime?: number;
        price?: number;
        category?: string;
        publishedAt?: string;
    };
    score: number;
} 