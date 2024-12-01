import { renderHook, act } from '@testing-library/react-hooks';
import { useAsync } from '@/hooks/useAsync';

describe('useAsync', () => {
  it('should handle successful async operations', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockAsync = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useAsync());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    let executePromise;
    act(() => {
      executePromise = result.current.execute(mockAsync);
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await executePromise;
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle async errors', async () => {
    const mockError = new Error('Test error');
    const mockAsync = jest.fn().mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useAsync());
    
    let executePromise;
    act(() => {
      executePromise = result.current.execute(mockAsync).catch(() => {});
    });
    
    expect(result.current.isLoading).toBe(true);
    
    await executePromise;
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });
  
  it('should reset state before executing', async () => {
    const mockData1 = { id: 1 };
    const mockData2 = { id: 2 };
    const mockAsync1 = jest.fn().mockResolvedValue(mockData1);
    const mockAsync2 = jest.fn().mockResolvedValue(mockData2);
    
    const { result } = renderHook(() => useAsync());
    
    await act(async () => {
      await result.current.execute(mockAsync1);
    });
    
    expect(result.current.data).toEqual(mockData1);
    
    let executePromise;
    act(() => {
      executePromise = result.current.execute(mockAsync2);
    });
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    await executePromise;
    
    expect(result.current.data).toEqual(mockData2);
  });
}); 