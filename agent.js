import * as http from "http";

const initialPort = 2006;
let currentPort = initialPort;

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

let targetPort = null;

let args = process.argv.slice(2);

if(args[0] === "--port" || typeof args[1] === "number") {
  targetPort = args[1];
  createPublicServer();
}

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
      console.log(JSON.parse(response));
    });
  });

  req.on("error", (err) => {
    console.log(err.message);
  });

  req.end();
}