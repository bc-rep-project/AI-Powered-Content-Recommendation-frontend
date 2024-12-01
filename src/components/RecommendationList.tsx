import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiThumbsUp, FiEye } from 'react-icons/fi';
import { recordInteraction } from '../services/api';

interface Recommendation {
  content_id: string;
  title: string;
  description: string;
  score: number;
  image_url?: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export default function RecommendationList({ recommendations }: RecommendationListProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInteraction = async (contentId: string, type: 'view' | 'like') => {
    try {
      await recordInteraction({
        content_id: contentId,
        interaction_type: type,
      });
    } catch (error) {
      console.error('Error recording interaction:', error);
    }
  };

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
        >
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
                >
                  View
                </Button>
                <Button
                  size="sm"
                  leftIcon={<FiThumbsUp />}
                  variant="outline"
                  onClick={() => handleInteraction(rec.content_id, 'like')}
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
} 