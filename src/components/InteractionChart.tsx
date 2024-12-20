import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { recommendationService } from '../services/api';
import type { InteractionData } from '../types';

const InteractionChart = () => {
  const [data, setData] = useState<InteractionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await recommendationService.fetchInteractionHistory();
        setData(historyData);
      } catch (err) {
        setError('Failed to load interaction history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'User Interactions',
        data: data.map(d => d.interactionCount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Recommendation Interactions Over Time'
      }
    }
  };

  return (
    <div className="w-full h-[400px] p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default InteractionChart; 