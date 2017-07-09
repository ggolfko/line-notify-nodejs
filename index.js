var request = require('request');

var url = 'http://burst.btfg.space:4443/socket.io/?EIO=3&transport=polling&t=1498932998988-2&sid=37JVvcjRiOyyRIZDAC7Q';

getData = () => {
  return new Promise((resolve, reject) => {
    request.get({
      url: url,
      json: true,
      headers: {
        'User-Agent': 'request'
      }
    }, (err, res, body) => {
      //console.log(body);
      resolve(body);
      if (err) {
        reject(err);
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        // data is already parsed as JSON:
        console.log(body);
      }
    });
  })
}

getData().then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});
