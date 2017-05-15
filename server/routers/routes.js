const express = require('express');
const UserModel = require('../../db/models/User.js');
const UserPodcastModel = require('../../db/models/User_Podcast.js');
const UserFavoritePodcastModel = require('../../db/models/User_Favorite_Podcast.js');
const ReviewModel = require('../../db/models/Review.js');
const utils = require('../utils.js');
const session = require('express-session');
const passport = require('passport');
const authHelpers = require('../auth/authHelpers.js');
const sessionHelpers = require('../auth/sessionHelpers.js');
const SessionModel = require('../../db/models/Session.js');
const TopTenModel = require('../../db/models/TopTen.js');
const Promise = require('bluebird');

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.status(200).sendFile('/index.html');
  });

router.route('/logout')
  .get((req, res) => {
    sessionHelpers.store.destroy(req.sessionID);
    req.session.destroy();
  })

router.route('/topTen')
  .get((req, res) => {
    TopTenModel.fetchCollection((collection) => {
      Promise.map(collection.models, (model) => {
        return JSON.parse(model.attributes.results);
      })
      .then((results) => {
        if (results.length === 0) {
          utils.fetchTopTen((err, topTen) => {
            res.send(topTen)
          })
        } else {
          res.send(results);
        }
      })

    })
  })

router.route('/favorite/:id')
  .delete((req, res) => {
    // console.log('req.params.id', req.params.id);
    UserFavoritePodcastModel.destroy(req.params.id, (result) => {
      res.send(result);
    });
  });

router.route('/favorite')
  .get((req, res) => {
    // console.log('req.body', req.query);
    UserModel.fetch(req.query.username, (result) => {
      // console.log('favorite: ', result);
      UserFavoritePodcastModel.fetchFavoritePodcasts(result.id, (data) => {
        // console.log('data', data);
        res.send(data);
      });
    });
  });

router.route('/favorite')
  .post((req, res) => {
    // console.log('req', req);
    // console.log('req.session.passport.user', req.session.passport.user);
    // console.log('req.body', req.body);
    UserModel.fetch(req.body.username, (result) => {
      let options = {
        user_id: result.id,
        feedUrl: req.body.feedUrl,
        collectionId: req.body.collectionId,
        artworkUrl100: req.body.artworkUrl100,
        collectionName: req.body.collectionName,
        artistName: req.body.artistName
      };

      UserFavoritePodcastModel.insertOne(options, (data) => {
        res.send(data);
      });
    });
  });

router.route('/login/local')
  .get((req, res) => {
    res.redirect('/#/local/login');
  });

router.route('/signup')
  .post((req, res) => {
    UserModel.insertOne(req.body.username, req.body.password, (results)=> {
      if (results.name === 'error') {
        res.send('error');
      } else {
        res.send('success');
      }
    });
  });

router.route('/search')
  .post((req, res) => {
    let url = `https://itunes.apple.com/search?term=${req.body.search}&country=US&entity=podcast&media=podcast&limit=10`;
    utils.fetchCollections(url, (err, results) => {
      if (results) {
        res.status(200).send(results);
      } else {
        res.status(404).send('We are experiencing some technical difficulties...');
      }
    });
  });

router.route('/podcast')
  .post((req, res) => {
    let url = req.body.feedUrl;
    let collectionId = req.body.collectionId;
    utils.fetchEpisodes(url, collectionId, (err, results) => {
      if (results) {
        res.status(200).send(results);
      } else {
        res.status(404).send('Oopsies...seems we are down!');
      }
    });
  });

router.route('/search-rating')
 .get((req, res) => {
   UserPodcastModel.fetch('podcast_id', req.query.collectionIds, results => {
     if (results) {
       res.status(200).send(results);
     } else {
       res.status(503).send('Service Unavailable');
     }
   });
 });

router.route('/addRating')
 .post((req, res) => {
   console.log(req.body);
   UserModel.fetch(req.body.username, (result) => {
     UserPodcastModel.insertOne({ podcast_id: req.body.collectionId, rating: parseInt(req.body.rating), user_id: result.id}, results => {
       console.log(results);
       if (results) {
         res.status(200).send('success');
       } else {
         res.status(404).send('error');
       }
     });
   });
 });

 router.route('/get-reviews')
 .get((req, res) => {
   ReviewModel.fetch(req.query.collectionId, results => {
     if (results) {
       res.status(200).send(results);
     } else {
       res.status(503).send('Service Unavailable');
     }
   });
 });

 router.route('/post-review')
 .post((req, res) => {

   UserModel.fetch(req.body.username, (result) => {
     ReviewModel.insertOne({ podcast_id: req.body.collectionId, summary: req.body.summary,review: req.body.review, user_id: result.id}, results => {
       console.log(results);
       if (results) {
         res.status(200).send('success');
       } else {
         res.status(404).send('error');
       }
     });
   });
 });

router.route('/getUser')
  .get((req, res) => {
    if (req.session.passport && req.session.passport.user) {
      res.send({ user: req.session.passport.user });
    }else{
      res.send({ user: '' });
    }
});


module.exports = router;
