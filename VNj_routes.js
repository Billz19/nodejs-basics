const fs = require('fs');

const requestHandler =  (req, resp) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    resp.write(`<html>
    <head>
    <title>Enter Message</title>
    </head>
    <body>
    <form action="/message" method="POST">
    <input type="text" name="message"/>
    <button type="submit">Send</button>
    </form>
    </body>
    </html>`);
    return resp.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => body.push(chunk));
    return req.on('end', () => {
      const bodyParsed = Buffer.concat(body).toString();
      const message = bodyParsed.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        resp.statusCode = 302;
        resp.setHeader('location', '/');
        return resp.end();
      });
    });
  }
  resp.setHeader('Content-Type', 'text/html');
  resp.write(`
    <html>
    <head>
    <title>Test</title>
    </head>
    <body>
    <h1>Hello World</h1>
    </body>
    </html>
    `);
  resp.end();
};

module.exports = requestHandler;
