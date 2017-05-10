import React from 'react';
import $ from 'jquery';

class LocalLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    let options = {
      username: this.state.username,
      password: this.state.password
    }
    $.post('/login', options)
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} >
        <label>
        Username:
        <input type="text" 
          name="username" 
          value={this.state.username} 
          onChange={this.handleUsernameChange} />
        </label>
        <label>
        Password:
        <input type="text" 
          name="password" 
          value={this.state.password} 
          onChange={this.handlePasswordChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}


export default LocalLogin;