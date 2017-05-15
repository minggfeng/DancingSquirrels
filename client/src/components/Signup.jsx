import React from 'react';
import $ from 'jquery';

class Signup extends React.Component {
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
    $.post('/signup', options, (results) => {
      if (results === 'error') {
        alert('Username already in use. Please select another one.');
      }
      if (results === 'success') {
        this.props.history.push('/login/local')
      }
    })
    e.preventDefault();
  }

  render() {
    return (
      <div className="loginForms">
      <h3>Signup</h3>
      <form onSubmit={this.handleSubmit} >
        <label className="loginLabel">Username</label>
        <input type="text" 
          name="username" 
          value={this.state.username} 
          onChange={this.handleUsernameChange} />
        <br></br>
        <label className="loginLabel">Password</label>
        <input type="text" 
          name="password" 
          value={this.state.password} 
          onChange={this.handlePasswordChange} />
        <br></br>
        <input className="loginSubmit" type="submit" value="Submit" />
      </form>
      </div>
    )
  }
}


export default Signup;