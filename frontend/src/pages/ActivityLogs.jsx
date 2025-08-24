import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/logs/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    }).then(res => setLogs(res.data))
      .catch(err => console.error('Failed to fetch logs'));
  }, []);

  return (
    <Container className="mt-5" fluid="md">
      <h2>Activity Logs</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Activity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.user}</td> {/* user is FK, so ID */}
              <td>{log.activity}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ActivityLogs;