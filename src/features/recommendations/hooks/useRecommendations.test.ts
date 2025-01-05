import { renderHook, waitFor } from '@testing-library/react'
import { useRecommendations } from './useRecommendations'
import { server } from '@/__tests__/mocks/server'
import { rest } from 'msw'
import { env } from '@/config/env.config'

describe('useRecommendations', () => {
  it('fetches recommendations successfully', async () => {
    const { result } = renderHook(() => useRecommendations())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.recommendations).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('handles error state', async () => {
    server.use(
      rest.get(`${env.API_URL}/api/recommendations`, (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    const { result } = renderHook(() => useRecommendations())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch recommendations')
    expect(result.current.recommendations).toHaveLength(0)
  })

  it('refetches recommendations when called', async () => {
    const { result } = renderHook(() => useRecommendations())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    result.current.refetch()

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
}) 