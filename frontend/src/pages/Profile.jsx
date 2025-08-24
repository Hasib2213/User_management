import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '', password: '' });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8000/api/profile/', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      setMessage('Profile updated successfully');
      setIsError(false);
      // Optionally refresh user data
    } catch (err) {
      setMessage(err.response?.data || 'Update failed');
      setIsError(true);
    }
  };

  return (
    <Container className="mt-5" fluid="md">
      <h2>Profile</h2>
      {message && <Alert variant={isError ? 'danger' : 'success'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>New Password (optional)</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Save</Button>
        <Button variant="danger" onClick={logout} className="mt-3 ms-2">Logout</Button>
      </Form>
    </Container>
  );
};

export default Profile;