import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Badge,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiThumbsUp, FiEye } from 'react-icons/fi';
import { useState } from 'react';
import { recommendationService } from '../services/api';
import type { Recommendation } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInteraction = async (contentId: string, type: 'view' | 'like') => {
    setLoadingStates(prev => ({ ...prev, [contentId]: true }));
    
    try {
      await recommendationService.trackInteraction(contentId, type);
      
      toast({
        title: 'Success',
        description: `${type === 'view' ? 'Viewed' : 'Liked'} content successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record interaction. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error recording interaction:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [contentId]: false }));
    }
  };

  if (recommendations.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500">No recommendations available yet.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {recommendations.map((rec) => (
        <Box
          key={rec.content_id}
          p={4}
          bg={cardBg}
          borderRadius="md"
          border="1px"
          borderColor={borderColor}
          _hover={{ shadow: 'md' }}
          position="relative"
        >
          {loadingStates[rec.content_id] && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.200"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LoadingSpinner message="Recording interaction..." />
            </Box>
          )}
          
          <HStack spacing={4}>
            {rec.image_url && (
              <Image
                src={rec.image_url}
                alt={rec.title}
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
              />
            )}
            <Box flex="1">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">{rec.title}</Text>
                <Badge colorScheme="green">
                  {Math.round(rec.score * 100)}% Match
                </Badge>
              </HStack>
              <Text noOfLines={2} color="gray.500" mb={3}>
                {rec.description}
              </Text>
              <HStack spacing={4}>
                <Button
                  size="sm"
                  leftIcon={<FiEye />}
                  onClick={() => handleInteraction(rec.content_id, 'view')}
                  isLoading={loadingStates[rec.content_id]}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  leftIcon={<FiThumbsUp />}
                  variant="outline"
                  onClick={() => handleInteraction(rec.content_id, 'like')}
                  isLoading={loadingStates[rec.content_id]}
                >
                  Like
                </Button>
              </HStack>
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default RecommendationList; 