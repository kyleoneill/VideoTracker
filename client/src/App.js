import React from 'react';
import './style/App.css';
import Login from './pages/login';
import Home from './pages/home';
import {verifyToken} from './api';

function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

function setLocalStorage(token, username) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
}

const appName = "Norgannon";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      username: null
    }
  }
  componentDidMount() {
    var token = localStorage.getItem('token');
    var username = localStorage.getItem('username');
    if(token !== null && token !== "null") {
      verifyToken(token).then((res) => {
        if(res.data.tokenValid) {
          token = res.data.newToken;
          username = res.data.username;
        }
        else {
          clearLocalStorage();
          token = null;
          username = null;
        }
      }).catch((err) => {
        //setState - some alert notifying about the log-out
        clearLocalStorage();
        token = null;
        username = null;
      }).finally(() => {
        setLocalStorage(token, username);
        this.setState({
          token: token,
          username: username
        })
      });
    }
  }
  handleLogin = (token, username) => {
    setLocalStorage(token, username);
    this.setState({token: token, username: username});
  }
  handleLogout = () => {
    clearLocalStorage();
    this.setState({token: ''});
    window.history.replaceState(null, '', '/');
    window.location.reload();
  }
  render() {
    return (
      <div className="App">
        {this.state.token === null && 
          <Login appName={appName} handleLogin={this.handleLogin}/>
        }
        {this.state.token !== null &&
          <Home appName={appName} token={this.state.token} username={this.state.username} handleLogout={this.handleLogout}/>
        }
      </div>
    )
  }
}

export default App;
