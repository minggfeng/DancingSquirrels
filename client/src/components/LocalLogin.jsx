import React from 'react';
import $ from 'jquery';


class LocalLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    };

    this.localLoginUsernameChange = this.localLoginUsernameChange.bind(this);
    this.localLoginPasswordChange = this.localLoginPasswordChange.bind(this);
    this.localLoginSubmit = this.localLoginSubmit.bind(this);
  }

  localLoginUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  localLoginPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  localLoginSubmit(e) {
    let options = {
      username: this.state.username,
      password: this.state.password
    }
    $.post('/login/local', options, (results) => {
      if (results.user) {
        this.props.history.push(`/user/${results.user}`);
      } else {
        alert('Invalid username or password');
      }
    });
    e.preventDefault();
  }

  render() {
    return (
      <div className="loginForms">
        <h3>Login</h3>
        <form onSubmit={this.localLoginSubmit} >
          <label className="loginLabel">Username</label> 
          <input type="text" 
            name="username" 
            value={this.state.username} 
            onChange={this.localLoginUsernameChange} />
          <br></br>
          <label className="loginLabel">Password</label> 
          <input type="text" 
            name="password" 
            value={this.state.password} 
            onChange={this.localLoginPasswordChange} />
          <br></br>
          <input className="loginSubmit" type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}


export default LocalLogin;