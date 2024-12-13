import { rest } from 'msw';
import { API_ENDPOINTS } from '../../config/api';

export const handlers = [
    rest.get(
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
    ),
]; 