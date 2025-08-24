import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Reset = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({ password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }
    try {
      const res = await axios.post(`http://localhost:8000/api/reset/${token}/`, formData);
      setMessage(res.data.message);
      setIsError(false);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data.error || 'Reset failed');
      setIsError(true);
    }
  };

  return (
    <Container className="mt-5" fluid="md">
      <h2>Reset Password</h2>
      {message && <Alert variant={isError ? 'danger' : 'success'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="confirm_password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" name="confirm_password" onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Reset</Button>
      </Form>
    </Container>
  );
};

export default Reset;