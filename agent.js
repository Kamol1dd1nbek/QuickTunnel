import * as http from "http";

const initialPort = 2006;
let currentPort = initialPort;
let targetPort = null;

function startAgent() {
  const server = http.createServer((req, res) => {

  });

  server.listen(currentPort, () => {
    console.log(`Agent is running on port ${currentPort}`);
  });
  
  server.on("error", (err) => {
    if(err.code === "EADDRINUSE") {
      currentPort++;
      startAgent();
    }
  })
}

// startAgent();

let args = process.argv.slice(2);

if(args[0] === "--port" || typeof args[1] === "number") {
  targetPort = args[1];
  createPublicServer();
}

let publicServerPort = undefined;

function createPublicServer() {
  let requestOptions = {
    hostname: "localhost",
    port: "80",
    path: "/create-tunnel",
    method: "POST"
  }

  let req = http.request(requestOptions, (res) => {
    let response = "";

    res.on("data", (chunk) => {
      response += chunk;
    });

    res.on("end", () => {
      publicServerPort = JSON.parse(response);
      openTunnel(publicServerPort);
    });
  });

  req.on("error", (err) => {
    console.log(err.message);
  });

  req.end();
}

function getApp() {
  // let req = ht
}

function openTunnel(port) {
  console.log(port)
  const connectionOptions = {
    hostname: "localhost",
    port,
    path: "/events",
    method: "GET",
    headers: {
      'Cache-control': 'no-cache',
      'Connection': 'keep-alive'
    }
  }
  const req = http.request(connectionOptions);
  
  req.on("response", (res) => {
    res.setEncoding("utf-8");
    res.on("data", (data) => {
      console.log(data);
    });
  });

  req.on("error", (err) => {
    console.log(`Error on connection with sub server: ${err.message}`);
  });

  req.end();
}

createPublicServer();