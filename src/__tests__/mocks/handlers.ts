import { rest } from 'msw';
import { env } from '@/config/env.config';

export const handlers = [
    rest.get(`${env.API_URL}/api/recommendations`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                data: [
                    {
                        id: '1',
                        title: 'Test Recommendation',
                        description: 'Test Description',
                        category: 'AI & ML',
                        rating: 4.5,
                        tags: ['ai', 'ml'],
                        createdAt: new Date().toISOString(),
                    },
                ],
            })
        );
    }),
]; 