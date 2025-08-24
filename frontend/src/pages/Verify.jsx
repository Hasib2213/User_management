import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Alert, Spinner } from 'react-bootstrap';

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log('Verifying token:', token);
        const res = await axios.get(`http://localhost:8000/api/verify/${token}/`);
        console.log('Verification response:', res.data);
        setMessage(res.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.response?.data?.error || 'Verification failed. Please try again.');
        setMessage('Verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container className="mt-5">
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Verifying...</p>
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          <Alert variant={error ? 'warning' : 'success'}>{message}</Alert>
        </>
      )}
    </Container>
  );
};

export default Verify;