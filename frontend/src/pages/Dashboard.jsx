import React, { useContext } from 'react';
import { Container, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container className="mt-5" fluid="md">
      <Card>
        <Card.Body>
          <Card.Title>Welcome, {user?.name || 'User'}!</Card.Title>
          <Card.Text>Your role is: {user?.role || 'N/A'}</Card.Text>
          {/* Add more role-specific content here if needed */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;