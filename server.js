const request = require('request')
const axios = require('axios');
const Monitor = require('monitor');

const processMonitor = new Monitor(options);

/**
 * baseURL json
 * @type {[type]}
 */
const instance = axios.create({
  baseURL: 'https://api.nanopool.org/v1/zec/balance_hashrate'
});

/**
 * options for processMonitor
 * @type {Object}
 */
const options = {
  probeClass: 'Process',
  initParams: {
    pollInterval: 10000
  }
}

/**
 * line token
 * get token https://notify-bot.line.me/
 */
const token = 'lineToken';

/**
 * [loadData description]
 * @return {[type]} [description]
 */
loadData = () => {
  return new Promise((resolve, reject) => {
    instance.get('/t1WXMkKKQnkF9GvDyhrGRzKD69YQac9QSjJ').then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject("if error");
    });
  })
}

/**
 * processMonitor on change
 * @type {String}
 */
processMonitor.on('change', () => {
  loadData().then((res) => {

    //console.log(JSON.stringify(res));
    let message = 'status: ' + res.status + ' hashrate: ' + res.data.hashrate + ' balance: ' + res.data.balance;

    request({
      method: 'POST',
      uri: 'https://notify-api.line.me/api/notify',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      'auth': {
        'bearer': token
      },
      form: {
        message: message
      }
    }, (err, httpResponse, body) => {
      console.log(err);
      // console.log(httpResponse);
      console.log(body);
    })
  }).catch((err) => {
    console.log("case error");
  })

});

/**
 * processMonitor when error
 * @type {String}
 */
processMonitor.connect((err) => {
  if (err) {
    console.error('Error connecting with the process probe: ', err);
    process.exit(1);
  }
});
