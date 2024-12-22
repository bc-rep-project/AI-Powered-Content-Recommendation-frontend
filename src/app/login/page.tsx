const handleLogin = async (email: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Authentication failed');
    }

    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}; 