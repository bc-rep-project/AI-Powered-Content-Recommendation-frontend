import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, useColorModeValue } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchInteractionHistory } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import type { InteractionData } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InteractionChart() {
  const {
    data,
    error,
    isLoading,
    execute,
  } = useAsync<InteractionData[]>();

  const lineColor = useColorModeValue('rgb(49, 130, 206)', 'rgb(144, 205, 244)');

  useEffect(() => {
    execute(fetchInteractionHistory);
  }, [execute]);

  if (isLoading) {
    return <LoadingSpinner message="Loading interaction history..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        title="Error Loading Chart"
        message="Failed to load interaction history. Please try again later."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        No interaction data available yet.
      </Box>
    );
  }

  const chartData: ChartData<'line'> = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Interactions',
        data: data.map(item => item.interactions),
        fill: false,
        borderColor: lineColor,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Interaction History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box h="300px" w="100%" position="relative">
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </Box>
  );
} 