import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Input,
  Select,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAsync } from '../hooks/useAsync';
import { fetchDiscoverContent } from '../services/api';
import type { Recommendation } from '../types';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const {
    data: content,
    error,
    isLoading,
    execute: loadContent,
  } = useAsync<Recommendation[]>();

  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    loadContent(() => fetchDiscoverContent());
  }, [loadContent]);

  // Load content when search or category changes
  const handleSearch = async () => {
    await loadContent(() => fetchDiscoverContent({ searchQuery, category }));
  };

  useEffect(() => {
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, category]);

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Discover Content</Heading>

        <VStack spacing={4} mb={8}>
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            placeholder="Select category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="articles">Articles</option>
            <option value="videos">Videos</option>
            <option value="podcasts">Podcasts</option>
          </Select>
        </VStack>

        {error && (
          <ErrorAlert
            title="Error Loading Content"
            message="There was an error loading the content. Please try again later."
          />
        )}

        {isLoading ? (
          <LoadingSpinner message="Loading content..." />
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {content && <RecommendationList recommendations={content} />}
          </Grid>
        )}
      </Box>
    </Layout>
  );
} 