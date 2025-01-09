import { useState } from 'react';
import { handleInteraction, formatInteractionMetadata, InteractionType } from '@/utils/interactions';
import { useToast } from '@/components/ui/use-toast';

interface UseContentInteractionProps {
    contentId: string;
    userId?: string;
    onSuccess?: (type: InteractionType) => void;
    onError?: (error: Error) => void;
}

export const useContentInteraction = ({
    contentId,
    userId,
    onSuccess,
    onError
}: UseContentInteractionProps) => {
    const [isLoading, setIsLoading] = useState<Record<InteractionType, boolean>>({
        like: false,
        bookmark: false,
        share: false,
        view: false
    });
    const { toast } = useToast();

    const handleContentInteraction = async (type: InteractionType) => {
        setIsLoading(prev => ({ ...prev, [type]: true }));
        
        try {
            const metadata = formatInteractionMetadata(type);
            
            await handleInteraction({
                contentId,
                interactionType: type,
                userId,
                metadata
            });

            // Show success message
            toast({
                title: 'Success!',
                description: `Content ${type}d successfully`,
                variant: 'default'
            });

            // Call success callback if provided
            onSuccess?.(type);
        } catch (error) {
            console.error(`Error handling ${type} interaction:`, error);
            
            // Show error message
            toast({
                title: 'Error',
                description: `Failed to ${type} content. Please try again.`,
                variant: 'destructive'
            });

            // Call error callback if provided
            onError?.(error as Error);
        } finally {
            setIsLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    return {
        isLoading,
        like: () => handleContentInteraction('like'),
        bookmark: () => handleContentInteraction('bookmark'),
        share: () => handleContentInteraction('share'),
        view: () => handleContentInteraction('view')
    };
}; 