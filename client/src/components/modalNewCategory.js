import React from 'react';
import {
    Button,
    Form,
    Modal
} from 'react-bootstrap';

class NewCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            categoryText: '',
            formText: ''
        }
    }
    handleClose = () => {
        this.setState({show: false, categoryText: '', formText: ''});
    }
    handleShow = () => {
        this.setState({show: true});
    }
    handleCategoryTextChange = (e) => {
        this.setState({categoryText: e.target.value});
    }
    handleSubmit = () => {
        if(this.state.categoryText !== '') {
            this.props.callback(this.state.categoryText);
            this.handleClose();
        }
        else {
            this.setState({formText: "You need to type in a category to add"});
        }
    }
    render() {
        return(
            <>
                <Button variant="primary" onClick={this.handleShow}>New Category</Button>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="form-category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control placeholder="New Category" value={this.state.categoryText} onChange={this.handleCategoryTextChange} />
                                <Form.Text className="text-danger">{this.state.formText}</Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleSubmit}>Create Category</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default NewCategory;