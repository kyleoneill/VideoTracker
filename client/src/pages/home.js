import React from 'react';
import '../style/home.css';
import {
    Alert,
    Button
} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {
    getAllVideos,
    getAllCategories,
    createVideo,
    deleteVideo,
    setVideoFavorite
} from '../api';
import Videos from '../pages/videos';
import Settings from './settings/settings';

function parseYoutubeLink(link) {
    let splitLink = link.split("v=");
    let verify = splitLink[1].split('&');
    return verify[0]
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            categories: [],
            showAlert: false,
            alertText: '',
        }
    }
    async componentDidMount() {
        try {
            let videos = await getAllVideos(this.props.token);
            let categories = await getAllCategories(this.props.token);
            this.setState({videos: videos.data.videos, categories: categories.data.categories});
        }
        catch(e) {
            this.setState({showAlert: true, alertText: "Failed to get user data"});
        }

    }
    handleNewVideo = async (link, category) => {
        try {
            let parsedLink = parseYoutubeLink(link);
            let res = await createVideo(parsedLink, category, false, this.props.token);
            let newVideo = {
                categoryId: res.data.video.categoryId,
                favorite: res.data.video.favorite,
                link: res.data.video.link,
                name: res.data.video.name
            };
            let videos = this.state.videos;
            videos.push(newVideo);
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
    videoDelete = async (index) => {
        let videos = this.state.videos;
        await deleteVideo(videos[index].link, this.props.token);
        videos.splice(index, 1);
        this.setState({videos: videos});
    }
    toggleVideoFavorite = async (index) => {
        let videos = this.state.videos;
        let video = videos[index]
        await setVideoFavorite(video.link, !video.favorite, this.props.token);
        videos[index].favorite = !videos[index].favorite;
        this.setState({videos: videos});
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
                <Router>
                    <div>
                        <nav className="top-nav-bar">
                            <ul>
                                <li>
                                    <Link to="/">Videos</Link>
                                </li>
                                <li>
                                    <Link to="/settings">Settings</Link>
                                </li>
                                <li>
                                    <Button variant="secondary" className="logout" onClick={this.props.handleLogout}>Logout</Button>
                                </li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path="/settings">
                                <Settings token={this.props.token} username={this.props.username} />
                            </Route>
                            <Route path="/">
                                <Videos 
                                    token={this.props.token}
                                    username={this.props.username}
                                    videos={this.state.videos}
                                    categories={this.state.categories}
                                    handleNewVideo={this.handleNewVideo}
                                    videoDelete={this.videoDelete}
                                    toggleVideoFavorite={this.toggleVideoFavorite}
                                />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
}

export default Home;