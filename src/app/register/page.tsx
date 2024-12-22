// Add proper type for form data
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const handleSubmit = async (formData: RegisterFormData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}; 