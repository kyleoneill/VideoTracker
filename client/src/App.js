import React from 'react';
import './style/App.css';
import Login from './components/login';
import Home from './components/home';

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
  render() {
    return (
      <div className="App">
        {this.state.token === '' && 
          <Login appName={appName} handleLogin={this.handleLogin}/>
        }
        {this.state.token !== '' &&
          <Home token={this.state.token} username={this.state.username} />
        }
      </div>
    )
  }
}

export default App;
