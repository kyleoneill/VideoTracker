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
    setVideoFavorite,
    deleteCategory,
    createCategory,
    changePassword
} from '../api';
import Videos from '../pages/videos';
import Settings from './settings/settings';

function parseYoutubeLink(link) {
    let splitLink = link.split("v=");
    let verify = splitLink[1].split('&');
    return verify[0]
}

function getIndexOfCategory(categoryName, categories) {
    for(var i = 0; i < categories.length; i++) {
        if(categories[i].name === categoryName) {
            return i;
        }
    }
    return -1;
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            categories: [],
            showAlert: false,
            alertText: '',
            alertVariant: ''
        }
    }
    async componentDidMount() {
        try {
            let videos = await getAllVideos(this.props.token);
            if(videos.data.videos === undefined) {
                videos = [];
            }
            else {
                videos = videos.data.videos
            }
            let categories = await getAllCategories(this.props.token);
            if(categories.data.categories === undefined) {
                categories = [];
            }
            else {
                categories = categories.data.categories
            }
            this.setState({videos: videos, categories: categories});
        }
        catch(e) {
            this.setState({showAlert: true, alertVariant: 'danger', alertText: "Failed to get user data"});
        }

    }
    handleNewVideo = async (link, category) => {
        try {
            let parsedLink = parseYoutubeLink(link);
            let res = await createVideo(parsedLink, category, false, this.props.token);
            let videos = this.state.videos;
            videos.push(res.data.video);
            this.setState({videos: videos});
        }
        catch(e) {
            if(e.response.status === 400) {
                this.setState({showAlert: true, alertVariant: 'danger', alertText: "This video is already in your list."});
            }
            else {
                this.setState({showAlert: true, alertVariant: 'danger', alertText: e});
            }
        }
    }
    videoDelete = async (index) => {
        let videos = this.state.videos;
        await deleteVideo(videos[index].link, this.props.token);
        videos.splice(index, 1);
        this.setState({videos: videos});
    }
    categoryCreate = async (categoryName) => {
        let res = await createCategory(this.props.token, categoryName);
        let categories = this.state.categories;
        categories.push(res.data.category);
        this.setState({categories: categories});
    }
    categoryDelete = async (category) => {
        let categories = this.state.categories;
        let index = getIndexOfCategory(category, categories);
        if(index !== -1) {
            try {
                await deleteCategory(this.props.token, category);
                categories.splice(index, 1);
                this.setState({categories: categories});
            }
            catch(e) {
                if(e.response.status === 409) {
                    this.setState({showAlert: true, alertVariant: 'danger', alertText: "Cannot delete a category that is associated to saved videos"});
                }
                else {
                    this.setState({showAlert: true, alertVariant: 'danger', alertText: "Failed to delete category"});
                }
            }
        }
        else {
            return new Error("Provided category does not exist");
        }
    }
    toggleVideoFavorite = async (index) => {
        let videos = this.state.videos;
        let video = videos[index]
        await setVideoFavorite(video.link, !video.favorite, this.props.token);
        videos[index].favorite = !videos[index].favorite;
        this.setState({videos: videos});
    }
    dismissAlert = () => {
        this.setState({showAlert: false, alertVariant: '', alertText: "Error"});
    }
    changePassword = async (currentPassword, newPassword) => {
        try {
            await changePassword(this.props.token, currentPassword, newPassword);
            this.setState({showAlert: true, alertVariant: 'success', alertText: "Successfully changed password"});
        }
        catch {
            this.setState({showAlert: true, alertVariant: 'danger', alertText: "Failed to change password"});
        }
    }
    render() {
        return(
            <div className="home-page">
                <Alert variant={this.state.alertVariant} onClose={this.dismissAlert} show={this.state.showAlert} dismissible>
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
                                <Settings
                                    token={this.props.token}
                                    username={this.props.username}
                                    categories={this.state.categories}
                                    categoryDelete={this.categoryDelete}
                                    categoryCreate={this.categoryCreate}
                                    changePassword={this.changePassword}
                                />
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