const CronJob = require('cron').CronJob;
const utils = require('./utils.js');
const TopTenModel = require('../db/models/TopTen.js');
const Promise = require('bluebird');

const resetTopTen = (models) => {
  TopTenModel.fetchCollection((collection) => {
    Promise.each(collection.models, (model) => {
      console.log('destroy')
      model.destroy();
    })
    .then(() => {
      Promise.each(models, (model) => {
        console.log('insert')
        TopTenModel.insertOne(model, (err, podcast) => {
          if (podcast) console.log('inserted');
        })
      })
    })
  })
}

const topTenJob = new CronJob({
  cronTime: '00 00 00 * * 0-6',
  onTick: function() {
    console.log('worker');
    utils.fetchTopTen((err, podcasts) => {
      Promise.map(podcasts, (podcast) => {
        return JSON.stringify(podcast)
      })
      .then((models) => {
        resetTopTen(models);
      })
    })
  },
  start: true
})

topTenJob.start();
