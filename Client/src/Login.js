import React, { Component } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import "./assets/css/login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={4}>ARMS</Col>
        </Row>
        <div className="Login">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="input-container" controlId="username" bsSize="large">
            <Form.Label>Username</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <i class="zmdi zmdi-account zmdi-hc-lg"></i>
            </Form.Group>
            <Form.Group className="input-container" controlId="password" bsSize="large">
            <Form.Label>Password</Form.Label>
              <Form.Control
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
              />
              <i class="zmdi zmdi-account zmdi-hc-lg"></i>
            </Form.Group>
            <Button variant="secondary"
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}