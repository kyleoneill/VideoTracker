import React from 'react';
import './style/App.css';
import Login from './pages/login';
import Home from './pages/home';

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
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    this.setState({token: token, username: username});
  }
  handleLogin = (token, username) => {
    this.setState({token: token, username: username});
  }
  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.setState({token: ''});
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
