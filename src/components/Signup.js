import React from 'react';
import { signUp } from '../services/users';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      handle: '',
      password: ''
    }
  }

  handleChangeForm(field, event) {
    this.setState({
        [field]: event.target.value
    });
  }

  handleOverview() {
    const { history } = this.props;
    history.push('/');
  }

  async handleSubmit(event) {
    event.preventDefault();
    const user = this.state;
    const { history } = this.props;
    const { token } = await signUp(user);
    localStorage.setItem('twitter_clone_token', token);
    history.push('/');
  }

  render() {
    return (
      <div className="signUpContainer">
        <form className="signUpForm">
        <label htmlFor="name">Name
          <input type="text" name="name" value={this.state.name} onChange={this.handleChangeForm.bind(this, "name")}/>
        </label>
        <label htmlFor="username">Username
          <input type="text" name="username" value={this.state.handle} onChange={this.handleChangeForm.bind(this, "handle")}/>
        </label>
        <label htmlFor="password">Password
          <input type="password" name="password" value={this.state.password} onChange={this.handleChangeForm.bind(this, "password")}/>
        </label>
        </form>
        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
        <button onClick={this.handleOverview.bind(this)}>Cancel</button>
      </div>
    );
  }
}

export default Signup;