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
      if (results === 'validPassword') {
        this.props.history.push('/');
      }
    });
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.localLoginSubmit} >
        <label>
        Username:
        <input type="text" 
          name="username" 
          value={this.state.username} 
          onChange={this.localLoginUsernameChange} />
        </label>
        <label>
        Password:
        <input type="text" 
          name="password" 
          value={this.state.password} 
          onChange={this.localLoginPasswordChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}


export default LocalLogin;