import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // register.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Sending data:', formData);

  if (formData.password !== formData.confirm_password) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/register/', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    setSuccess('Registration successful. Check email for verification.');
    setError('');
    
  } catch (err) {
    console.error('Registration error:', err);
    
    // Better error handling
    if (err.response) {
      // The server responded with an error status
      const errorData = err.response.data;
      
      if (typeof errorData === 'object') {
        // Handle field-specific errors
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        
        setError(errorMessages || 'Registration failed');
      } else {
        setError(errorData || 'Registration failed');
      }
    } else if (err.request) {
      // The request was made but no response was received
      setError('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      setError('An unexpected error occurred.');
    }
    
    setSuccess('');
  }
};

  return (
    <Container className="mt-5" fluid="md">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
    <Form.Label>Username</Form.Label>
    <Form.Control 
        type="text" 
        name="username" 
        value={formData.username} 
        onChange={handleChange} 
        required 
    />
</Form.Group>
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="confirm_password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Register</Button>
      </Form>
    </Container>
  );
};

export default Register;