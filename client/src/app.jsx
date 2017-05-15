import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import PodcastMain from './components/PodcastMain.jsx';
import UserHomePage from './components/UserHomePage.jsx';
import PodcastEpisodes from './components/PodcastEpisodes.jsx';
import Login from './components/Login.jsx';
import Search from './components/Search.jsx';
import Signup from './components/Signup.jsx';
import ReactRouter from 'react-router';
import LocalLogin from './components/LocalLogin.jsx';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPodcastView: 'Top 10 Podcasts!',
      podcasts: [],
      podcastEpisodes: {},
      loggedIn: false
    };

    this.currentPodcastView = this.currentPodcastView.bind(this);
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
        this.updateRatings();
      });
  }

  updateRatings() {
    var collectionIds = this.state.podcasts.map((podcast) => {
      return podcast.collectionId;
    });
    $.get('/search-rating', { collectionIds })
        .done(rating => {
          if (rating && Object.keys(rating).length > 0) {
            var newPodcasts = this.state.podcasts;
            rating.forEach(function(val) {
              for ( var item of newPodcasts ) {
                if (item.collectionId === val.podcast_id ) {
                  item.rating = val.rating;
                  break;
                }
              }
            });
            this.setState({
              podcasts: newPodcasts
            });
          }
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
        this.updateRatings();
      });
  }

  logoutUser() {
    $.get('/logout');
  }

  currentPodcastView(newPage) {
    this.setState({
      currentPodcastView: newPage
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Search onSearch={this.onSearch}
                  getHomePage={this.getHomePage}
                  logoutUser={this.logoutUser}
                  currentPodcastView={this.currentPodcastView}/>
          <Switch>
            <Route
              name="root"
              exact path="/"
              component={() => (<PodcastMain
                                  onSearch={this.onSearch}
                                  podcasts={this.state.podcasts}
                                  onClickPodcast={this.onClickPodcast}
                                  currentPodcastView={this.state.currentPodcastView} />)} />
            <Route path="/login/local" component={LocalLogin} />
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

            <Route path="/logout" component={() => (<PodcastMain
                                  onSearch={this.onSearch}
                                  podcasts={this.state.podcasts}
                                  onClickPodcast={this.onClickPodcast} 
                                  currentPodcastView={this.state.currentPodcastView} />)} />


          </Switch>
        </div>
      </Router>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('podcast-main'));
