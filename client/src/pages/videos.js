import React from 'react';
import '../style/videos.css';
import {
    getAllVideos,
    getAllCategories,
    createVideo,
    deleteVideo,
    setVideoFavorite
} from '../api';
import {
    Alert,
    FormCheck,
    Nav,
    Table,
} from 'react-bootstrap';
import NewVideo from '../components/modalNewVideo';
import ModalConfirmDelete from '../components/confirmDelete';

function parseYoutubeLink(link) {
    let splitLink = link.split("v=");
    let verify = splitLink[1].split('&');
    return verify[0]
}

class Videos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertText: '',
            videos: [],
            categories: [],
            filterByFavorites: false
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
    toggleVideoFavorite = async (index) => {
        let videos = this.state.videos;
        let video = videos[index]
        await setVideoFavorite(video.link, !video.favorite, this.props.token);
        videos[index].favorite = !videos[index].favorite;
        this.setState({videos: videos});
    }
    handleFilterFavorite = (e) => {
        this.setState({filterByFavorites: e.target.checked});
    }
    videoDelete = async (index) => {
        let videos = this.state.videos;
        await deleteVideo(videos[index].link, this.props.token);
        videos.splice(index, 1);
        this.setState({videos: videos});
    }
    render() {
        return(
            <div className="videos-page">
                <Alert variant="danger" onClose={this.dismissAlert} show={this.state.showAlert} dismissible>
                    <Alert.Heading>{this.state.alertText}</Alert.Heading>
                </Alert>
                <h3>Saved Videos - {this.props.username}</h3>
                <Nav className="nav">
                    <NewVideo className="new-video" callback={this.handleNewVideo} categories={this.state.categories} />
                    <FormCheck className="checkbox" type="checkbox" label="Filter By Favorites" onChange={this.handleFilterFavorite}/>
                </Nav>
                <Table striped bordered className="center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Link</th>
                            <th>Category</th>
                            <th>Favorite</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.videos && this.state.videos.filter(video => this.state.filterByFavorites ? video.favorite : true).map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td key={value.link + "-name"}>{value.name}</td>
                                    <td key={value.link}>
                                        <a href={`https://www.youtube.com/watch?v=${value.link}`} target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v={value.link}</a>
                                    </td>
                                    <td key={value.categoryId}>{value.categoryId}</td>
                                    <td key={value.link + value.favorite} onClick={() => this.toggleVideoFavorite(index)} className="entity favorite">
                                        {value.favorite? String.fromCharCode(9733) : String.fromCharCode(9734)}
                                    </td>
                                    <td key={value.link + "-remove"} className="entity remove">
                                        <ModalConfirmDelete objectType={"Video"} objectName={value.name} onConfirm={() => this.videoDelete(index)}/>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Videos;