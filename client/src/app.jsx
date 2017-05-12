import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import PodcastMain from './components/PodcastMain.jsx';
import UserHomePage from './components/UserHomePage.jsx';
import PodcastEpisodes from './components/PodcastEpisodes.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Layout from './layout/Layout.jsx';
import ReactRouter from 'react-router';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcasts: [],
      podcastEpisodes: {}
    };

    this.getHomePage = this.getHomePage.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onClickPodcast = this.onClickPodcast.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  componentDidMount() {
    this.getHomePage();
  }

  onSearch(query) {
    $.post('/search', { search: query })
      .done((results) => {
        console.log(results);
        this.setState({
          podcasts: results
        });
      });
  }

  onClickPodcast(feedUrl, collectionId, callback) {
    // post request to the server
    $.post('/podcast', {
      feedUrl: feedUrl,
      collectionId: collectionId
    })
      .done((podcastEpisodes) => {
        // when done renderEpisodes is true AND episodes is set to the results
        // console.log(podcastEpisodes[0]);
        this.setState({
          podcastEpisodes: podcastEpisodes[0],
        });
        console.log('podcastEpisodes: ', this.state.podcastEpisodes);
        console.log('podcasts: ', this.state.podcasts);
        callback();
      });
  }

  getHomePage() {
    $.get('/topTen')
      .done((results) => {
        this.setState({
          podcasts: results
        });
      });
  }

  logoutUser() {
    $.get('/logout');
  }

  render() {
    return (
      <Router>
        <div>
          <Layout getHomePage={this.getHomePage}
                  logoutUser={this.logoutUser}/>
          <Switch>
            <Route
              name="root"
              exact path="/"
              component={() => (<PodcastMain
                                  onSearch={this.onSearch}
                                  podcasts={this.state.podcasts}
                                  onClickPodcast={this.onClickPodcast}/> )} />
            <Route path="/login" component={Login} />
            <Route path="/Signup" component={Signup} />
            <Route path="/podcasts/episodes" 
                   component={() => (<PodcastEpisodes podcastEpisodes={this.state.podcastEpisodes} /> )} />
            <Route
              name="user"
              path="/user/:username"
              component={() => (<UserHomePage
                                  onSearch={this.onSearch}
                                  podcasts={this.state.podcasts}
                                  onClickPodcast={this.onClickPodcast}/> )} />
                                             

          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('podcast-main'));
