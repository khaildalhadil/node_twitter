const http = require("http");

const POST = 9000;

const mainServers = [
  {host: "localhost", port: 9001},
  {host: "localhost", port: 9002},
]

// create tcp connection
const proxy = http.createServer()

proxy.on('request', (clientRequest, proxyResponse) => {
  // Select a serve to route the incoming request to (using round robin algrithm)

  // shift will return the first index
  const mainServer = mainServers.shift();

  // first element will push it and make it last element
  mainServers.push(mainServer);

  // The request that we are sending to one of our main servers
  const proxyRequest = http.request({
    host: mainServer.host,
    port: mainServer.port,
    path: clientRequest.url,
    method: clientRequest.method,
    headers: clientRequest.headers
  })

  // Once we receive a response from one of our main servers
  proxyRequest.on('response', (mainServerResponse)=> {
    // Set the status code and header for the response that we are sending to the client
    proxyResponse.writeHead(
      mainServerResponse.statusCode,
      mainServerResponse.headers
    );

    // Finally write the boby of the main server's response to the body of proxy's req
    // and send the response to the client
    mainServerResponse.pipe(proxyResponse);
  })

  // Write the body of the client's request to the body proxy's req
  // to one of our server
  clientRequest.pipe(proxyRequest);
});

proxy.listen(POST, () => {
  console.log(`Proxy in port ${POST} work`);
});