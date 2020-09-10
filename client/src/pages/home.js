import React from 'react';
import '../style/home.css';
import {
    Button,
    Nav
} from 'react-bootstrap';
import Videos from '../pages/videos';

class Home extends React.Component {
    render() {
        return(
            <div className="home-page">
                <h1>{this.props.appName}</h1>
                <Nav className="nav">
                    <Nav.Item>
                        <Button variant="secondary" className="logout" onClick={this.props.handleLogout}>Logout</Button>
                    </Nav.Item>
                </Nav>
                <Videos token={this.props.token} username={this.props.username}/>
            </div>
        )
    }
}

export default Home;