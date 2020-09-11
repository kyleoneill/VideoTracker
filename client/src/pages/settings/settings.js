import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import '../../style/settings.css';
import AccountSettings from './account';
import ConfigSettings from './config';

class Settings extends React.Component {
    render() {
        return(
            <div className="settings-page">
                <h3>Settings - {this.props.username}</h3>
                <Router>
                    <div>
                        <nav className="side-nav-bar">
                            <ul className="settings-top-nav">
                                <li>
                                    <Link to="/settings/account">Account Settings</Link>
                                </li>
                                <li>
                                    <Link to="/settings/config">Config</Link>
                                </li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path="/settings/config">
                                <ConfigSettings
                                    token={this.props.token}
                                    username={this.props.username}
                                    categories={this.props.categories}
                                    categoryDelete={this.props.categoryDelete}
                                    categoryCreate={this.props.categoryCreate}
                                />
                            </Route>
                            <Route path="/settings/account">
                                <AccountSettings token={this.props.token} username={this.props.username} />
                            </Route>
                            <Route path="/settings">
                                <AccountSettings token={this.props.token} username={this.props.username} />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default Settings;