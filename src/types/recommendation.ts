export interface Recommendation {
    id: string;
    title: string;
    description: string;
    metadata: {
        tags: string[];
        readTime: string;
    };
    created_at: string;
} 