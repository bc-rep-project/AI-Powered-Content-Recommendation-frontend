import { useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftIcon,
  Select,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { fetchDiscoverContent } from '../services/api';
import type { Recommendation } from '../types';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const bgColor = useColorModeValue('white', 'gray.700');

  const {
    data: content,
    error,
    isLoading,
    execute: loadContent,
  } = useAsync<Recommendation[]>();

  // Load content when search or category changes
  const handleSearch = async () => {
    await loadContent(() => fetchDiscoverContent({ searchQuery, category }));
  };

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Discover New Content</Heading>

        <Stack spacing={4} mb={8}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <InputGroup>
              <InputLeftIcon pointerEvents="none" children={<FiSearch />} />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </InputGroup>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              bg={bgColor}
            >
              <option value="all">All Categories</option>
              <option value="movies">Movies</option>
              <option value="books">Books</option>
              <option value="music">Music</option>
              <option value="articles">Articles</option>
            </Select>
          </SimpleGrid>
        </Stack>

        {error && (
          <ErrorAlert
            title="Error Loading Content"
            message="Failed to load discover content. Please try again."
          />
        )}

        {isLoading ? (
          <LoadingSpinner message="Discovering content for you..." />
        ) : (
          content && <RecommendationList recommendations={content} />
        )}
      </Box>
    </Layout>
  );
} 