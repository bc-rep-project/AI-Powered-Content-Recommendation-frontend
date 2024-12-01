import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import RecommendationList from '../components/RecommendationList';
import InteractionChart from '../components/InteractionChart';
import { fetchRecommendations, fetchUserStats } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({
    totalInteractions: 0,
    recommendationAccuracy: 0,
    contentViewed: 0,
  });

  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recsData, statsData] = await Promise.all([
          fetchRecommendations(),
          fetchUserStats(),
        ]);
        setRecommendations(recsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Welcome back, {user?.username}!</Heading>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
            <StatLabel>Total Interactions</StatLabel>
            <StatNumber>{stats.totalInteractions}</StatNumber>
          </Stat>
          <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
            <StatLabel>Recommendation Accuracy</StatLabel>
            <StatNumber>{stats.recommendationAccuracy}%</StatNumber>
          </Stat>
          <Stat p={4} bg={bgColor} borderRadius="lg" shadow="base">
            <StatLabel>Content Viewed</StatLabel>
            <StatNumber>{stats.contentViewed}</StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Recommendations List */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
            <Heading size="md" mb={4}>
              Your Recommendations
            </Heading>
            <RecommendationList recommendations={recommendations} />
          </Box>

          {/* Interaction Chart */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
            <Heading size="md" mb={4}>
              Interaction History
            </Heading>
            <InteractionChart />
          </Box>
        </Grid>
      </Box>
    </Layout>
  );
} 