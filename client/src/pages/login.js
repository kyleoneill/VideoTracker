import React from 'react';
import {
    Button,
    Form,
    Alert
} from 'react-bootstrap';
import '../style/login.css';

import {createUser, login} from '../api';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showAlert: false,
            alertText: "Error",
            signIn: true
        }
    }
    toggleState = (event) => {
        this.setState({
            signIn: !this.state.signIn
        });
    }
    handleUsernameChange = (event) => {
        this.setState({username: event.target.value});
    }
    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }
    dismissAlert = () => {
        this.setState({showAlert: false, alertText: "Error"});
    }
    handleSubmit = async () => {
        if(this.state.username === '' || this.state.password === '') {
            return
        }
        if(this.state.signIn) {
            try {
                let res = await login(this.state.username, this.state.password);
                this.login(res.data.token);
            }
            catch(err) {
                if(err.response.status === 401) {
                    this.setState({showAlert: true, alertText: "Invalid username or password"});
                    return
                }
                else {
                    this.setState({showAlert: true, alertText: err.message});
                    return
                }
            }
        }
        else {
            try {
                let res = await createUser(this.state.username, this.state.password);
                this.login(res.data.token);
            }
            catch(err) {
                if(err.response.status === 409) {
                    this.setState({showAlert: true, alertText: "Username is already taken"});
                    return
                }
                else if(err.response.status === 400) {
                    this.setState({showAlert: true, alertText: "Must supply a username and password"});
                    return
                }
                else {
                    this.setState({showAlert: true, alertText: err.message});
                    return
                }
            }
        }
    }
    login = (token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', this.state.username);
        this.props.handleLogin(token, this.state.username);
    }
    render() {
        return (
            <div className="login-page">
                <Alert variant="danger" onClose={this.dismissAlert} show={this.state.showAlert} dismissible>
                    <Alert.Heading>{this.state.alertText}</Alert.Heading>
                </Alert> 
                <h1>{this.props.appName}</h1>
                <h3>{this.state.signIn ? "Sign In" : "Create Account"}</h3>
                <Form className="sign-in-form">
                    <Form.Group controlId="login-form-email">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}/>
                    </Form.Group>
                    <Form.Group controlId="login-form-password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                    </Form.Group>
                    <Button variant="primary" onClick={this.handleSubmit}>{this.state.signIn ? "Submit" : "Create Account"}</Button>
                </Form>
                {this.state.signIn &&
                    <div>
                        <p>Don't have an account? </p>
                        <p className="text-button" onClick={this.toggleState}>Create one</p>
                    </div>
                }
                {!this.state.signIn &&
                    <div>
                        <p>Already have an account? </p>
                        <p className="text-button" onClick={this.toggleState}>Sign in</p>
                    </div>
                }
            </div>
        )
    }
}

export default Login;