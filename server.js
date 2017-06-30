const request = require('request')
const axios = require('axios');
const Monitor = require('monitor');

//JSON url
const instance = axios.create({
  baseURL: 'https://api.nanopool.org/v1/zec/balance_hashrate'
});

//
const options = {
  probeClass: 'Process',
  initParams: {
    pollInterval: 10000
  }
}
const processMonitor = new Monitor(options);

//line token
//https://notify-bot.line.me/
const token = 'lineToken';

//loadData
getData = () => {
  return new Promise((resolve, reject) => {
    instance.get('/t1WXMkKKQnkF9GvDyhrGRzKD69YQac9QSjJ').then((res) => {
      resolve(res.data);
    }).catch((error) => {
      reject("if error");
    });
  })
}

//process
processMonitor.on('change', () => {
  getData()
    .then((res) => {
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
    }).catch((error) => {
      console.log("case error");
    })
});

processMonitor.connect((error) => {
  if (error) {
    console.error('Error connecting with the process probe: ', error);
    process.exit(1);
  }
});
