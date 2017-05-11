const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const parseString = require('xml2js-parser').parseString;

var grabCollections = (url, cb) => {
  request(url)
  .then(function(results) {
    let data = JSON.parse(results.body).results;

    let collections = data.map((item) => {
      var collection = {
        collectionId: item.collectionId,
        trackId: item.trackId,
        artistName: item.artistName,
        collectionName: item.collectionName,
        releaseDate: item.releaseDate,
        trackName: item.trackName,
        collectionViewUrl: item.collectionViewUrl,
        feedUrl: item.feedUrl,
        artworkUrl30: item.artworkUrl30,
        artworkUrl60: item.artworkUrl60,
        artworkUrl100: item.artworkUrl100,
        artworkUrl600: item.artworkUrl600,
        contentAdvisoryRating: item.contentAdvisoryRating,
        trackCount: item.trackCount,
        primaryGenreName: item.primaryGenreName,
        genres: item.genres
      };
      return collection;
    });
    return cb(null, collections);
  })
  .catch((err) => {
    return cb(err, null);
  })
}

var grabEpisodes = (url, collectionId, cb) => {
   request(url)
  .then(function(results) {
    let xml = results.body;
    parseString(xml, function(err, result) {
      let podcasts = result.rss.channel.map((ch) => {
        let podcast = {
          collectionId: collectionId,
          title: ch.title,
          pubDate: ch.pubDate,
          summary: ch['itunes:summary'],
          author: ch['itunes:author'],
          description: ch.description,
          image: ch['itunes:image'][0].$.href
        }
        podcast.episodes = ch.item.map((obj) => {
          let track = {
            collectionId: collectionId,
            title: obj.title,
            url: obj.enclosure[0].$.url,
            duration: obj.duration,
            pubDate: obj.pubDate
          };
          return track;
        })
        return podcast;
      })
      cb(null, podcasts);
    });
  })
  .catch(function(err) {
    cb(err, null);
  });
}


module.exports.grabCollections = grabCollections;
module.exports.grabEpisodes = grabEpisodes;