import React from 'react';
import './style/App.css';
import Login from './pages/login';
import Home from './pages/home';

const appName = "Norgannon";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      username: ''
    }
  }
  handleLogin = (token, username) => {
    this.setState({token: token, username: username});
  }
  handleLogout = () => {
    this.setState({token: ''});
  }
  render() {
    return (
      <div className="App">
        {this.state.token === '' && 
          <Login appName={appName} handleLogin={this.handleLogin}/>
        }
        {this.state.token !== '' &&
          <Home appName={appName} token={this.state.token} username={this.state.username} handleLogout={this.handleLogout}/>
        }
      </div>
    )
  }
}

export default App;
