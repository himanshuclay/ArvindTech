import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import config from '@/config';

interface MisData {
  isSuccess: boolean;
  message: string;
  taskNotDone: number;
  totalTask: number;
  p1: string;
}

const MisReport: React.FC = () => {
  const [data, setData] = useState<MisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [storedEmpID, setStoredEmpID] = useState<string | null>(null);

  useEffect(() => {
    const empID = localStorage.getItem('EmpId');
    setStoredEmpID(empID);
  }, []);

  useEffect(() => {
    if (!storedEmpID) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_URL_ACCOUNT}/MIS/GetP1?DoerID=${storedEmpID}`);
        if (response.data.isSuccess) {
          setData(response.data);
        } else {
          setError('Failed to retrieve data.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storedEmpID]);

  const getPerformanceVariant = (p1: string) => {
    const score = parseInt(p1.replace('%', ''));
    if (score >= -20) return 'success';  // Best performance
    if (score >= -50) return 'warning';  // Moderate performance
    return 'danger';                    // Poor performance
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">MIS Dashboard</h1>
      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Tasks Not Done</Card.Title>
              <Card.Text className="display-4 text-danger">{data?.taskNotDone}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Tasks</Card.Title>
              <Card.Text className="display-4 text-primary">{data?.totalTask}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Performance (P1)</Card.Title>
              <Card.Text className={`display-4 text-${getPerformanceVariant(data?.p1 || '-100%')}`}>{data?.p1}</Card.Text>
              <ProgressBar 
                now={Math.abs(parseInt(data?.p1.replace('%', '') || '-100'))} 
                max={100} 
                variant={getPerformanceVariant(data?.p1 || '-100%')} 
                className="mt-3"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MisReport;