import React from 'react';
import '../style/videos.css';
import {
    FormCheck,
    Nav,
    Table,
} from 'react-bootstrap';
import NewVideo from '../components/modalNewVideo';
import ModalConfirmDelete from '../components/confirmDelete';

class Videos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterByFavorites: false
        }
    }
    handleFilterFavorite = (e) => {
        this.setState({filterByFavorites: e.target.checked});
    }
    render() {
        return(
            <div className="videos-page">
                <h3>Saved Videos - {this.props.username}</h3>
                <Nav className="nav">
                    <NewVideo className="new-video" callback={this.props.handleNewVideo} categories={this.props.categories} />
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
                        {this.props.videos && this.props.videos.filter(video => this.state.filterByFavorites ? video.favorite : true).map((value, index) => {
                            return (
                                <tr key={index}>
                                    <td key={value.link + "-name"}>{value.name}</td>
                                    <td key={value.link}>
                                        <a href={`https://www.youtube.com/watch?v=${value.link}`} target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v={value.link}</a>
                                    </td>
                                    <td key={value.categoryId}>{value.categoryId}</td>
                                    <td key={value.link + value.favorite} onClick={() => this.props.toggleVideoFavorite(index)} className="entity favorite">
                                        {value.favorite? String.fromCharCode(9733) : String.fromCharCode(9734)}
                                    </td>
                                    <td key={value.link + "-remove"} className="entity remove">
                                        <ModalConfirmDelete objectType={"Video"} objectName={value.name} onConfirm={() => this.props.videoDelete(index)}/>
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