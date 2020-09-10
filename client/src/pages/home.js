import React from 'react';
import '../style/home.css';
import {
    Button
} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Videos from '../pages/videos';
import Settings from './settings/settings';

class Home extends React.Component {
    render() {
        return(
            <div className="home-page">
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
                                <Videos token={this.props.token} username={this.props.username} />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
}

export default Home;