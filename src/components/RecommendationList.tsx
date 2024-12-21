import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Button,
  useColorModeValue,
  Flex,
  Select,
} from '@chakra-ui/react';
import { FiThumbsUp, FiEye } from 'react-icons/fi';
import type { Recommendation } from '../types';
import { recommendationService } from '../services/api';
import Pagination from './Pagination';

interface RecommendationListProps {
  recommendations: Recommendation[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  isLoading?: boolean;
}

const RecommendationList = ({
  recommendations,
  currentPage,
  totalPages,
  onPageChange,
  onCategoryChange,
  selectedCategory,
  isLoading = false,
}: RecommendationListProps): JSX.Element => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleInteraction = async (contentId: string, type: 'view' | 'like') => {
    try {
      await recommendationService.trackInteraction(contentId, type);
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  return (
    <Box data-testid="recommendation-list">
      <Flex mb={4} justifyContent="space-between" alignItems="center">
        <Select
          data-testid="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          maxW="200px"
        >
          <option value="">All Categories</option>
          <option value="test">Test</option>
          <option value="ai">AI</option>
          <option value="technology">Technology</option>
        </Select>
      </Flex>

      <VStack spacing={4} align="stretch">
        {recommendations.map((rec) => (
          <Box
            key={rec.content_id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={bgColor}
            data-testid="recommendation-item"
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
                  <Badge
                    colorScheme="green"
                    data-testid="category-badge"
                  >
                    {rec.category}
                  </Badge>
                </HStack>
                <Text color="gray.500" noOfLines={2} mb={3}>
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
                  <Badge colorScheme="purple">
                    {Math.round(rec.score * 100)}% Match
                  </Badge>
                </HStack>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>

      {totalPages > 1 && (
        <Flex justify="center" mt={6}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Flex>
      )}
    </Box>
  );
};

export default RecommendationList; 