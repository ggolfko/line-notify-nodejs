const request = require('request')
const axios = require('axios');
const Monitor = require('monitor');
const Hapi = require('hapi');
const cheerio = require('cheerio');

const instance = axios.create({
  baseURL: 'https://api.nanopool.org/v1/zec/balance_hashrate'
});

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8080
});


let options = {
  probeClass: 'Process',
  initParams: {
    pollInterval: 10000
  }
}

const processMonitor = new Monitor(options);
const token = 'lineToken';

getData = () => {
  return new Promise((resolve, reject) => {
    let url = `http://burstcoin.biz/address/11838271257372488268`;
    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        let $ = cheerio.load(body);
        let balance = $('abbr').eq(0).text().trim();
        console.log('loaded ' + balance);
        resolve(balance);
      } else {
        reject("if error in loaded");
      }
    });
  })
}

loadData = () => {
  return new Promise((resolve, reject) => {
    instance.get('/t1WXMkKKQnkF9GvDyhrGRzKD69YQac9QSjJ').then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject("if error");
    });
  })
}


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

processMonitor.connect((err) => {
  if (err) {
    console.error('Error connecting with the process probe: ', err);
    process.exit(1);
  }
});

// server.route({
//   method: 'GET',
//   path: '/',
//
//   handler: (req, reply) => {
//
//     let appId = req.params.appId;
//
//     let url = `http://burstcoin.biz/address/11838271257372488268`;
//
//     request(url, (err, res, body) => {
//
//       if (!err && res.statusCode === 200) {
//
//         let $ = cheerio.load(body);
//
//         let balance = $('abbr').eq(0).text().trim();
//
//         console.log(balance);
//
//         reply({
//           data: {
//             balance: balance
//           }
//         });
//
//       } else {
//         reply({
//           message: `We're sorry, the requested ${url} was not found on this server.`
//         });
//       }
//     });
//
//   }
// });
//
// server.start(err => {
//   console.log(`Server running at ${server.info.uri}`);
// });
