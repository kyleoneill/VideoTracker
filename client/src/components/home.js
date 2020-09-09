import React from 'react';
import '../style/home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            token: this.props.token
        }
    }
    render() {
        return(
            <div className="home">
                <p>Signed in as {this.state.username} with token {this.state.token}</p>
            </div>
        )
    }
}

export default Home;