import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

class PodcastListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcast: {},
      renderEpisodes: false
    };
    this.onClickPodcast = this.onClickPodcast.bind(this);
  }

  onClickPodcast() {
    // post request to the server
    if (this.state.renderEpisodes) {
      this.setState({
        renderEpisodes: false
      });
    } else {
      $.post('/podcast', {
        feedUrl: this.props.podcast.feedUrl,
        collectionId: this.props.podcast.collectionId
      })
        .done((podcast) => {
          // when done renderEpisodes is true AND episodes is set to the results
          // console.log(podcast[0]);
          this.setState({
            podcast: podcast[0],
            renderEpisodes: true
          });
        });
    }
  }

  render() {
    return (
      <div className='podcast'>
        <h2 onClick={this.onClickPodcast}>{this.props.podcast.collectionName}</h2>
        <img src={this.props.podcast.artworkUrl100} />
        <h5>Artist: {this.props.podcast.artistName}</h5>
        {
          this.state.renderEpisodes
           ? <div className='podcast-episodes-wrapper'>
            {
              this.state.podcast.item.map((episode, itr) => {
                return (
                  <div key={itr} className='podcast-episode'>
                    <h3>Title: {episode.title}</h3>
                    <audio controls>
                      <source src={episode.enclosure[0].$.url} type="audio/mpeg" />
                    </audio>
                  </div>
                );
              }).slice(0, 10)
            }
            </div>
           : null
        }
      </div>
    );
  }
}

// var PodcastListEntry = function(props) {
//   return (
//     <div>
//       <div onClick=><h2>{props.podcast.collectionName}</h2></div>
//       <div><img src={props.podcast.artworkUrl30} /></div>
//       <div>{props.podcast.artistName}</div>
//       {
//         //this.randomState
//         //  ? render
//         //  : don't render
//       }
//     </div>
//   );
// };

PodcastListEntry.propTypes = {
  podcast: PropTypes.object.isRequired
};

export default PodcastListEntry;
