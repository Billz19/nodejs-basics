const EE_Client = require('elasticemail-webapiclient').client;
const EE = new EE_Client({
  apiKey:
    'BDBB0BB5A643622225DBCFCFCA1E44A9A06608A7875DD40E68A4DF39A4D4BEA88206DFE93EAC0F4CF5876C70FA325B44',
  apiUri: 'https://api.elasticemail.com/',
  apiVersion: 'v2',
});

module.exports = EE;