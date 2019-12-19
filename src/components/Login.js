import React from 'react';
import { createSession } from '../services/session';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginForm: {
        handle: '',
        password: '',
      },
      error: null,
      isLoggingIn: false
    }
  }

  handleInputChange(field, event) {
    this.setState({
      loginForm: {
        ...this.state.loginForm,
        [field]: event.target.value
      }
    });
  }

  async handleLoginAttempt(event) {
    event.preventDefault();
    const { history } = this.props;
    const { handle, password } = this.state.loginForm;

    try {
      this.setState({ isLoggingIn: true, error: null });
      const { token, error } = await createSession({ handle, password });

      if (error) {
        throw new Error(error);
      }

      if (!token) {
        throw new Error('No token received - try again');
      }

      localStorage.setItem('twitter_clone_token', token);
      history.push('/');
    } catch (error) {
      this.setState({ error, isLoggingIn: false });
    }
  }

  

  render() {
    const { error, isLoggingIn } = this.state;

    return (
    <div className="body">
        <h1>Log in</h1>
        <form>
            <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" 
                value={this.state.loginForm.handle} 
                onChange={this.handleInputChange.bind(this, 'handle')} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                value={this.state.loginForm.password}
                onChange={this.handleInputChange.bind(this, 'password')}
                />
            </div>
            <button type="submit" className="btn btn-primary" 
            onClick={this.handleLoginAttempt.bind(this)}>Log in</button>
        </form>

        <div>
            {isLoggingIn && <p>Logging in...</p>}
            {error && <p>Unable to log in: {error.message}</p>}
        </div>
    </div>
    );
  }
}

export default Login;
