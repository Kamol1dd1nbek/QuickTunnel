import * as http from "http";

const initialPort = 2006;
let currentPort = initialPort;
let targetPort = null;
let publicServerPort = undefined;
let mainServerURL = "35.230.11.105";

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

function getSubRequestOptions(req) {
  return {
    hostname: "localhost",
    port: targetPort,
    method: req.method,
    path: req.path
  }
}

function getSendDataRequestOptions() {
  return {
    hostname: mainServerURL,
    port: publicServerPort,
    path: "/response",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

function openTunnel(port) {
  const connectionOptions = {
    hostname: mainServerURL,
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
      let request = JSON.parse(data);
      let subReq = http.request(getSubRequestOptions(request), (subRes) => {
        let result = "";

        subRes.on("data", (chunk) => {
          result += chunk;
        });

        subRes.on("end", () => {
          let sendReq = http.request(getSendDataRequestOptions(), (res) => {});
          sendReq.write(result);
          sendReq.end();
        });
      });

      subReq.end();
    });
  });

  req.on("error", (err) => {
    console.log(`Error on connection with sub server: ${err.message}`);
  });

  req.end();
}

function createPublicServer() {
  let requestOptions = {
    hostname: mainServerURL,
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