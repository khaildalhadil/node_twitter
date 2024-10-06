const http = require('http');
const fs = require('fs');

const USERS = [
  {id: 1, name: "khalid", username: "admin", password: "admin"},
  {id: 2, name: "ali", username: "a101", password: "101"},
  {id: 3, name: "hawa", username: "h101", password: "101"},
];

const POSTS = [
  {id: 1, userId: 1, title: "Hi I'm Khalid ", body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "},
  {id: 2, userId: 3, title: "Hi I'm hawa ", body: " hawa ed by the readable content of a page when looking at its layout. "},
];

const server = http.createServer((req, res) => {

  if (req.url === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');

    const streamFile = fs.createReadStream('./public/index.html');
    streamFile.pipe(res);
    
  }

  if (req.url === '/login' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');

    const streamFile = fs.createReadStream('./public/index.html');
    streamFile.pipe(res);
    
  }

  // if (req.url === '/api/user' && req.method === 'GET') {
  //   res.setHeader('Content-Type', 'text/html');

  //   const streamFile = fs.createReadStream('./public/index.html');
  //   streamFile.pipe(res);
    
  // }

  if (req.url === '/styles.css' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/css');

    const streamFile = fs.createReadStream('./public/styles.css');
    streamFile.pipe(res);
  }

  if (req.url === '/scripts.js' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/javascript');

    const streamFile = fs.createReadStream('./public/scripts.js');
    streamFile.pipe(res);
  }

  if (req.url === '/api/login' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    
    let dataForm;
    let userName;
    req.on('data', (ch) => {

      dataForm = JSON.parse(ch.toString());
      userName = USERS.find(el => el.username == dataForm.username);

      if (userName && userName.password == dataForm.password) {
        res.statusCode = 200;
        console.log(userName.password, dataForm.password)
        const resMessage = {message: 'successful'};
        res.end(JSON.stringify(resMessage));
      } else {
        res.statusCode = 401;
        const resMessage = {error: 'Invalid username or password'};
        res.end(JSON.stringify(resMessage));
      }
    });
  }

  // json send all the list that we have 
  if (req.url === '/api/posts' && req.method === 'GET') {

    const newPOST = POSTS.map(el => ({ ...el , author: USERS[el.userId-1].name}));
    res.statusCode = 200;
    res.end(JSON.stringify(newPOST));
  }

})

const PORT = 9002;

server.listen(PORT, ()=> {
  console.log("Listen In Port ",PORT);
})