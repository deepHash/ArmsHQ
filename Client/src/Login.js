import React, { Component } from "react";
import { userNameChange, userPasswordChange, userLoginSubmit } from "./actions/userActions";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import  User from "./services/userService";

import "./assets/css/login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  isLogin() {
    if (User.isLogin()) {
      this.props.history.push("/main");
    }
  }

  componentDidUpdate() {
    this.isLogin();
  }
  componentWillMount() {
    //this.isLogin();
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
    this.props.onLoginSubmit(
      this.state.username,
      this.state.password
    );
  }

  render() {
    return (
      <div className="wrapper">
        <Row>
          <Col md={12}><h1>ARMS</h1></Col>
        </Row>
        <div className="Login">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="input-container" controlId="username">
            <Form.Label className="label">Username</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={this.state.username}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group className="input-container" controlId="password">
            <Form.Label className="label">Password</Form.Label>
              <Form.Control
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
              />
            </Form.Group>
            <Button variant="success"
              block
              disabled={!this.validateForm()}
              type="submit">
              Login
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {
  onUserNameChange: userNameChange,
  onUserPasswordChange: userPasswordChange,
  onLoginSubmit: userLoginSubmit
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);