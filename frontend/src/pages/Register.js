import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useUserInfo } from '../contexts/userInfoContext';

function Register() {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { registerUser } = useUserInfo();

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity()) {
      setIsLoading(true);
      registerUser({ name, email, password }).then(() => setIsLoading(false));
    }
    setValidated(true);
  };

  return (
    <Container className="col-md-6 m-auto">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label className="fs-4">Name</Form.Label>
          <Form.Control
            autoFocus
            required
            type="text"
            size="lg"
            placeholder="Enter Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter your name
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label className="fs-4">Email Address</Form.Label>
          <Form.Control
            required
            type="email"
            size="lg"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password" className="mb-4">
          <Form.Label className="fs-4">Password</Form.Label>
          <Form.Control
            required
            type="password"
            size="lg"
            placeholder="Enter Password"
            autoComplete="off"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" className="w-100" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
              Signing Up
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </Form>
    </Container>
  );
}
export default Register;
