import React from 'react';
import '../style/home.css';
import {getAllVideos, getAllCategories, createVideo} from '../api';
import {
    Alert,
    Nav,
    Table
} from 'react-bootstrap';
import NewVideo from '../components/modalNewVideo';

function parseYoutubeLink(link) {
    let splitLink = link.split("v=");
    let verify = splitLink[1].split('&');
    return verify[0]
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            token: this.props.token,
            showAlert: false,
            alertText: '',
            videos: [],
            categories: []
        }
    }
    async componentDidMount() {
        try {
            let videos = await getAllVideos(this.props.token);
            let categories = await getAllCategories(this.props.token);
            this.setState({videos: videos.data.videos, categories: categories.data.categories});
        }
        catch(e) {
            this.setState({showAlert: true, alertText: "I NEED AN ERROR MESSAGE"});
        }

    }
    dismissAlert = () => {
        this.setState({showAlert: false, alertText: "Error"});
    }
    handleNewVideo = async (link, category) => {
        try {
            let parsedLink = parseYoutubeLink(link);
            await createVideo(parsedLink, category, false, this.state.token);
            let videos = this.state.videos;
            videos.push({categoryId: category, favorite: false, link: parsedLink});
            this.setState({videos: videos});
        }
        catch(e) {
            if(e.response.status === 400) {
                this.setState({showAlert: true, alertText: "This video is already in your list."});
            }
            else {
                this.setState({showAlert: true, alertText: e});
            }
        }
    }
    render() {
        return(
            <div className="home-page">
                <Alert variant="danger" onClose={this.dismissAlert} show={this.state.showAlert} dismissible>
                    <Alert.Heading>{this.state.alertText}</Alert.Heading>
                </Alert> 
                <h1>{this.props.appName}</h1>
                <Nav className="nav">
                    <Nav.Item>
                        <NewVideo callback={this.handleNewVideo} categories={this.state.categories} />
                    </Nav.Item>
                </Nav>
                <h3>Saved Videos - {this.state.username}</h3>
                <Table striped bordered className="center">
                    <thead>
                        <tr>
                            <th>Link</th>
                            <th>Category</th>
                            <th>Favorite</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.videos && this.state.videos.map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td key={value.link}>
                                        <a href={`https://www.youtube.com/watch?v=${value.link}`} target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v={value.link}</a>
                                    </td>
                                    <td key={value.categoryId}>{value.categoryId}</td>
                                    <td key={value.link + value.favorite} className="entity favorite">{value.favorite? String.fromCharCode(9733) : String.fromCharCode(9734)}</td>
                                    <td key={value.link + "-remove"} className="entity remove">&#x02A2F;</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Home;