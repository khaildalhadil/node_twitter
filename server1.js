const http = require('http');
const fs = require('fs');

// a sample object in this array would look like:
// { userId: 1, token: 232323}
const SESSICONS = []; 

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

  // if (req.url === '/profile' && req.method === 'GET') {
  //   res.setHeader('Content-Type', 'text/html');

  //   const streamFile = fs.createReadStream('./public/index.html');
  //   streamFile.pipe(res);
  // }

  // log a user in and give them a token
  if (req.url === '/api/login' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    
    let dataForm;
    let userName;
    req.on('data', (ch) => {

      dataForm = JSON.parse(ch.toString());
      userName = USERS.find(el => el.username == dataForm.username);

      if (userName && userName.password == dataForm.password) {

        const token = Math.floor(Math.random() * 1000000).toString();
        const targetId = userName.id;
        SESSICONS.push({targetId, token});
        res.setHeader('Set-Cookie', `token=${token}; path=/;`);

        res.statusCode = 200;
        const resMessage = {message: 'successful'};
        res.end(JSON.stringify(resMessage));

      } else {
        res.statusCode = 401;
        const resMessage = {error: 'Invalid username or password'};
        res.end(JSON.stringify(resMessage));
      }
    });
  }

  if (req.url === '/api/user' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    
    const streamFile = fs.createReadStream('./public/index.html');
    streamFile.pipe(res);

    const token = req.headers.cookie;
    const tokenNumber = token.split(";")[1].split("=")[1];
    const userToken = SESSICONS.find(el => el.token == tokenNumber);

    if (userToken) {
      const user = USERS.find(el => el.id === userToken.targetId);
      const jsonData = {username: user.username, name: user.name};
      res.statusCode = 200;
      res.end(JSON.stringify(jsonData));

    } else {
      res.statusCode = 401;
      res.end({error: 'unAuthrized'})
    }

    // SESSICONS.push(targetId, token);
    // const dattTOSend = SESSICONS[SESSICONS.length-1];
  }

  // if (req.url === '/api/user' && req.method === 'POST') {
  //   const token = req.headers.cookie;
  //   console.log(token);
  // }

  // json send all the list that we have 
  if (req.url === '/api/posts' && req.method === 'GET') {

    const newPOST = POSTS.map(el => ({ ...el , author: USERS[el.userId-1].name}));
    res.statusCode = 200;
    res.end(JSON.stringify(newPOST));
  }

  if (req.url === '/api/posts' && req.method === "POST" ) {

    res.setHeader('Content-Type', 'appliaction/json');

    const token = req.headers.cookie;
    const tokenNumber = token.split(";")[1].split("=")[1];
    const userToken = SESSICONS.find(el => el.token == tokenNumber);


    req.on('data', (cu) => {

      if (userToken) {
        const user = USERS.find(el => el.id === userToken.targetId);
        const jsonData = JSON.parse(cu);
        POSTS.push({id: user.id, userId: user.id, title: jsonData.title, body: jsonData.body});
        res.statusCode = 200;
      } else {
        res.statusCode = 401;
        res.end({error: 'unAuthrized'})
      }
    })

  }
})


const PORT = 9001;

server.listen(PORT, ()=> {
  console.log("Listen In Port ",PORT);
})