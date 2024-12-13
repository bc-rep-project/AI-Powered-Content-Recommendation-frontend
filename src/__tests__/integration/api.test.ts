import { rest } from 'msw';
import { setupServer } from 'msw/node';
import apiClient from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';
import { Recommendation } from '../../types';

// Define types for MSW
interface RequestHandler {
    req: any;
    res: any;
    ctx: any;
}

// Setup mock server
const server = setupServer(
    rest.get<never, Recommendation[]>(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.recommendations}`,
        (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        content_id: '1',
                        title: 'Test Recommendation',
                        description: 'Test Description',
                        score: 0.95,
                    }
                ])
            );
        }
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration', () => {
    test('fetches recommendations successfully', async () => {
        const response = await apiClient.get<Recommendation[]>(API_ENDPOINTS.recommendations);
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(response.data[0].title).toBe('Test Recommendation');
    });

    test('handles authentication errors', async () => {
        server.use(
            rest.get(
                `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.recommendations}`,
                (req, res, ctx) => {
                    return res(ctx.status(401));
                }
            )
        );

        await expect(apiClient.get(API_ENDPOINTS.recommendations))
            .rejects
            .toThrow();
    });
}); 