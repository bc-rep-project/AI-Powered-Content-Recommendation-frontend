export class ApiService {
  private baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL) {
    this.baseUrl = baseUrl || '';
  }

  async get<T>(endpoint: string, config: { headers?: Record<string, string> } = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return response.json();
  }

  // Add other methods (get, put, delete) as needed
} 