import React from 'react';
import {
    Button,
    Form,
    Modal
} from 'react-bootstrap';

function youtubeLinkRegex(link) {
    return /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/.test(link)
}

class NewVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            linkText: '',
            selectedCategory: '',
            formText: ''
        }
    }
    handleClose = () => {
        this.setState({show: false});
    }
    handleShow = () => {
        if(this.props.categories.length > 0) {
            this.setState({
                show: true,
                selectedCategory: this.props.categories[0].name,
                formText: '',
                linkText: ''
            });
        }
        else {
            this.setState({show: true});
        }
    }
    handleLinkTextChange = (event) => {
        this.setState({linkText: event.target.value});
    }
    handleCategoryChange = (event) => {
        this.setState({selectedCategory: event.target.value});
    }
    handleSubmit = () => {
        if(this.state.linkText !== '' && this.state.selectedCategory !== '') {
            if(youtubeLinkRegex(this.state.linkText)) {
                this.props.callback(this.state.linkText, this.state.selectedCategory);
                this.handleClose();
            }
            else {
                this.setState({formText: "This is not a valid YouTube link"});
            }
        }
    }
    render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow}>New Video</Button>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New Video</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="form-video-link">
                                <Form.Label>Video Link</Form.Label>
                                <Form.Control placeholder="Video Link" value={this.state.linkText} onChange={this.handleLinkTextChange} />
                                <Form.Text className="text-danger">{this.state.formText}</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="form-video-category">
                                <Form.Label>Video Category</Form.Label>
                                <Form.Control as="select" defaultValue={this.state.selectedCategory} onChange={this.handleCategoryChange}>
                                    {this.props.categories && this.props.categories.map((value, index) => {
                                        return(
                                            <option key={index}>{this.props.categories[index].name}</option>
                                        );
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleSubmit}>Create Video</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default NewVideo;