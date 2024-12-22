// Add proper type for form data
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const handleSubmit = async (formData: RegisterFormData) => {
  try {
    // Add validation
    if (!formData.email || !formData.password || !formData.username) {
      throw new Error('All fields are required');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Registration error response:', data);
      throw new Error(data.detail || 'Registration failed');
    }

    return data;
  } catch (error: any) {
    console.error('Registration error:', error.message);
    throw error;
  }
}; 