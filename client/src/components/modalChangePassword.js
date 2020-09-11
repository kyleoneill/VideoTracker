import React from 'react';
import {
    Button,
    Form,
    Modal
} from 'react-bootstrap';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            currentPasswordText: '',
            newPasswordText: '',
            passwordConfirmText: '',
            formText: ''
        }
    }
    handleClose = () => {
        this.setState({
            show: false,
            currentPasswordText: '',
            newPasswordText: '',
            passwordConfirmText: '',
            currentPasswordFormText: '',
            newPasswordFormText: ''
        });
    }
    handleShow = () => {
        this.setState({show: true});
    }
    handleCurrentPasswordChange = (event) => {
        this.setState({currentPasswordText: event.target.value});
    }
    handleNewPasswordChange = (event) => {
        this.setState({newPasswordText: event.target.value});
    }
    handlePasswordConfirmChange = (event) => {
        this.setState({passwordConfirmText: event.target.value});
    }
    handleSubmit = async () => {
        if(this.state.currentPasswordText !== '') {
            if(this.state.newPasswordText !== '' && this.state.newPasswordText === this.state.passwordConfirmText) {
                this.props.callback(this.state.currentPasswordText, this.state.newPasswordText);
                this.handleClose();
            }
            else {
                this.setState({newPasswordFormText: "The new password must match the password confirmation", currentPasswordFormText: ''});
                return;
            }
        }
        else {
            this.setState({currentPasswordFormText: "Need to include current password"});
        }
    }
    render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow}>Change Password</Button>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="form-current-password">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control type="password" value={this.state.currentPasswordText} onChange={this.handleCurrentPasswordChange} />
                                <Form.Text className="text-danger">{this.state.currentPasswordFormText}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="form-new-password">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" value={this.state.newPasswordText} onChange={this.handleNewPasswordChange} />
                                <Form.Text className="text-danger">{this.state.newPasswordFormText}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="form-new-password-confirm">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control type="password" value={this.state.passwordConfirmText} onChange={this.handlePasswordConfirmChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ChangePassword;