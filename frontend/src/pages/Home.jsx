import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const { user } = useAuth();

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>Welcome to User Management System</h1>
          {user ? (
            <p>Hello, {user.name || user.email}! You are logged in.</p>
          ) : (
            <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.</p>
          )}
          <hr />
          <p>This system allows you to manage users, view profiles, and monitor activities.</p>
          {user && user.role === 'admin' && (
            <Button as={Link} to="/admin/users" variant="primary" className="me-2">
              Manage Users
            </Button>
          )}
          <Button as={Link} to="/dashboard" variant="success">
            Go to Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;