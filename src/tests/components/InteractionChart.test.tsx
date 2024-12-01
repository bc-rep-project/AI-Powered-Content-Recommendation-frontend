import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import InteractionChart from '@/components/InteractionChart';
import { fetchInteractionHistory } from '@/services/api';

jest.mock('@/services/api', () => ({
  fetchInteractionHistory: jest.fn(),
}));

const mockInteractionData = [
  { date: '2023-01-01', interactions: 5 },
  { date: '2023-01-02', interactions: 8 },
  { date: '2023-01-03', interactions: 3 },
];

describe('InteractionChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetchInteractionHistory as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <ChakraProvider>
        <InteractionChart />
      </ChakraProvider>
    );

    expect(screen.getByText('Loading interaction history...')).toBeInTheDocument();
  });

  it('renders chart with data', async () => {
    (fetchInteractionHistory as jest.Mock).mockResolvedValueOnce(mockInteractionData);

    render(
      <ChakraProvider>
        <InteractionChart />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading interaction history...')).not.toBeInTheDocument();
    });

    // Chart elements should be present
    expect(screen.getByRole('graphics-document')).toBeInTheDocument();
    expect(screen.getByText('interactions')).toBeInTheDocument();
  });

  it('handles empty data', async () => {
    (fetchInteractionHistory as jest.Mock).mockResolvedValueOnce([]);

    render(
      <ChakraProvider>
        <InteractionChart />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No interaction data available yet.')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    const mockError = new Error('Failed to load interaction history');
    (fetchInteractionHistory as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <ChakraProvider>
        <InteractionChart />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load interaction history. Please try again later.')).toBeInTheDocument();
    });
  });
}); 