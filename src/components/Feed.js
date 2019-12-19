import React from 'react';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';

import { getTweets, postTweet } from '../services/tweets';
import { formatDistance } from 'date-fns';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('twitter_clone_token');
    const payload = jwtDecode(token);

    this.state = {
      tweets: [],
      isLoading: false,
      error: null,
      message: '',
      session: payload,
    }
  }

  async componentDidMount() {
    await this.populateTweets();
  }

  async populateTweets() {
    try {
      this.setState({ isLoading: true });
      const tweets = await getTweets();
      this.setState({ tweets: tweets, isLoading: false });
    } catch (error) {
      this.setState({ error });
    }
  }

  async handleSubmitTweet() {
    const { message } = this.state;

    if (!message) {
      return;
    }

    await postTweet(message);
    await this.populateTweets();
  }

  handleInputChange(field, event) {
    this.setState({
      [field]: event.target.value
    });
  }

  render() {
    const {
      session: {
        name,
        handle,
      } = {},
      tweets,
      isLoading,
      error,
      message,
    } = this.state;

    if (error) {
      return (
        <div>Unable to fetch tweets: {error.message}</div>
      );
    }

    if (isLoading) {
      return (
        <div>Loading tweets...</div>
      );
    }

    const tweetElements = tweets
    .map(({ id, message, name, handle, created_at }) => {
      const timeAgo = formatDistance(new Date(created_at), new Date(), { addSuffix: true });
      const styles = {
        border: '1px solid black',
        padding: 10,
        margin: 10
      };

      return (
        <div key={id} style={styles}>
          <p>{name} (@{handle}) - {timeAgo}</p>
          <p>{message}</p>
        </div>
      );
    });

    return (
      <div className="body">
        <h1>Feed for {name} (@{handle})</h1>
        <div className="card-body">
           <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="What's on your mind???"
                value={message} 
                onChange={this.handleInputChange.bind(this, 'message')} />
          </div>
          <div>
          <button onClick={this.handleSubmitTweet.bind(this)}
          className="btn btn-primary text-center">Tweet</button>
        </div>
        <div>
          <Link to="/logout">Log out</Link>
        </div>
        <div>{tweetElements}</div>
      </div>
    );
  }
}

export default Feed;