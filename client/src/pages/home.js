import React from 'react';
import '../style/home.css';
import {getAllVideos, getAllCategories} from '../api';
import {
    Alert,
    Table
} from 'react-bootstrap';

// TODO - nav bar. list videos, settings (change password, other config), logout
// TODO - need a button to remove a video on the table (should have a confirm dialog) and update backend
// TODO - need a way to add a video to the table and update backend
// TODO - need a way to sort videos by category
// TODO - need a dropdown box that lists all categories and an "all" option. Only display videos in table of that category
// TODO - need a way to add/remove categories (options/settings or another page?)
// TODO - I need to store the video's name, I actually can't believe I missed that - have to add it to database schema and backend

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
    categoryToKeyValue = (categories) => {
        let ret = ["filler"];
        for(var i = 0; i < categories.length; i++) {
            ret[i + 1] = categories[i].name;
        }
        return ret;
    }
    async componentDidMount() {
        try {
            let videos = await getAllVideos(this.props.token);
            videos = videos.data.videos;
            let categories = await getAllCategories(this.props.token);
            categories = this.categoryToKeyValue(categories.data.categories);
            videos.map((vid) => vid.categoryId = categories[vid.categoryId]);
            this.setState({videos: videos, categories: categories});
        }
        catch(e) {
            this.setState({showAlert: true, alertText: "I NEED AN ERROR MESSAGE"});
        }

    }
    dismissAlert = () => {
        this.setState({showAlert: false, alertText: "Error"});
    }
    render() {
        return(
            <div className="home-page">
                <Alert variant="danger" onClose={this.dismissAlert} show={this.state.showAlert} dismissible>
                    <Alert.Heading>{this.state.alertText}</Alert.Heading>
                </Alert> 
                <h1>{this.props.appName}</h1>
                <h3>Saved Videos - {this.state.username}</h3>
                <Table striped bordered className="center">
                    <thead>
                        <tr>
                            <th>Link</th>
                            <th>Category</th>
                            <th>Favorite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.videos.map((value, index) => {
                            return (
                                <tr>
                                    <td>
                                        <a href={`https://www.youtube.com/watch?v=${value.link}`} target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v={value.link}</a>
                                    </td>
                                    <td>{value.categoryId}</td>
                                    <td>{value.favorite}</td>
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