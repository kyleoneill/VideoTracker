import React from 'react';
import '../style/videos.css';
import {
    FormCheck,
    Dropdown,
    DropdownButton,
    Nav,
    Table,
} from 'react-bootstrap';
import NewVideo from '../components/modalNewVideo';
import ModalConfirmDelete from '../components/confirmDelete';

class Videos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterByFavorites: false,
            categoryToFilterBy: null,
            filterCategoryButtonText: "Filter by Category"
        }
    }
    handleFilterFavorite = (e) => {
        this.setState({filterByFavorites: e.target.checked});
    }
    handleCategoryFilter = (categoryName) => {
        this.setState({categoryToFilterBy: categoryName, filterCategoryButtonText: `Filtering by ${categoryName}`});
    }
    handleClearCategoryFilter = () => {
        this.setState({categoryToFilterBy: null, filterCategoryButtonText: "Filter by Category"});
    }
    filterVideos = () => {
        //If filterByFavorites is true only use videos that have favorite set to true, else use all of them
        let videos = this.props.videos.filter(video => this.state.filterByFavorites ? video.favorite : true);
        videos = videos.filter(video => this.state.categoryToFilterBy !== null ? video.categoryId === this.state.categoryToFilterBy : true );
        return videos
    }
    render() {
        return(
            <div className="videos-page">
                <h3>Saved Videos - {this.props.username}</h3>
                <Nav className="nav">
                    <NewVideo className="new-video" callback={this.props.handleNewVideo} categories={this.props.categories} />
                    <FormCheck className="checkbox" type="checkbox" label="Filter By Favorites" onChange={this.handleFilterFavorite}/>
                    <DropdownButton id="dropdown-video-categories" title={this.state.filterCategoryButtonText}>
                        <Dropdown.Item onSelect={this.handleClearCategoryFilter}>Clear Filter</Dropdown.Item>
                        <Dropdown.Divider />
                        {this.props.categories && this.props.categories.map((value, index) => {
                            return (
                                <Dropdown.Item key={index} onSelect={() => this.handleCategoryFilter(value.name)}>{value.name}</Dropdown.Item>
                            )
                        })}
                    </DropdownButton>
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
                        {this.props.videos && this.filterVideos(this.props.videos).map((value, index) => {
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