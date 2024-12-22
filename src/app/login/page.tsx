const handleLogin = async (email: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);  // OAuth2 spec uses 'username' for identifier
    formData.append('password', password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
}; 