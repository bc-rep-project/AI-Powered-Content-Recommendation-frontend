import { contentApi } from '@/lib/api';
import { interactionQueries } from '@/lib/supabase';

export type InteractionType = 'like' | 'bookmark' | 'share' | 'view';

interface InteractionData {
    contentId: string;
    interactionType: InteractionType;
    userId?: string;
    metadata?: Record<string, any>;
}

export const handleInteraction = async ({
    contentId,
    interactionType,
    userId,
    metadata = {}
}: InteractionData) => {
    try {
        // 1. Record in Supabase for real-time updates
        await interactionQueries.recordInteraction({
            user_id: userId,
            content_id: contentId,
            interaction_type: interactionType,
            timestamp: new Date().toISOString(),
            metadata
        });

        // 2. Send to backend API for recommendation engine
        await contentApi.submitFeedback(contentId, {
            feedback_type: interactionType,
            rating: interactionType === 'like' ? 5 : 
                    interactionType === 'bookmark' ? 4 : 
                    interactionType === 'share' ? 4 : 3,
            metadata
        });

        // 3. Update local state if needed (can be handled by Supabase real-time subscription)
        return true;
    } catch (error) {
        console.error('Error recording interaction:', error);
        throw error;
    }
};

// Helper function to format interaction data
export const formatInteractionMetadata = (interactionType: InteractionType) => {
    const baseMetadata = {
        device: navigator.userAgent,
        timestamp: new Date().toISOString(),
        platform: 'web'
    };

    switch (interactionType) {
        case 'share':
            return {
                ...baseMetadata,
                shareMethod: 'direct' // or social media platform
            };
        case 'bookmark':
            return {
                ...baseMetadata,
                collectionName: 'default' // or specific collection name
            };
        case 'like':
            return {
                ...baseMetadata,
                source: 'content_card' // or where the like came from
            };
        default:
            return baseMetadata;
    }
}; 