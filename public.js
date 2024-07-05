import * as http from "http";

const ports = new Set();
const subdomainData = new Map();

function defineSubdomain(req){
  let subdomain = undefined;
  let host = req.headers.host;
  let parts = host.split(".");

  if(parts.length >= 2) {
    subdomain = parts[0];
  }

  return subdomain;
}

const mainServer = http.createServer((req, res) => {

  // from user
  if(req.url === "/") {
    let subdomain = defineSubdomain(req);
    
    if(subdomain) {
      let subdomainData = getSubdomainData(subdomain);

      if(subdomainData) {
        let subReqOptions = {
          hostname: "localhost",
          port: subdomainData,
          method: req.method,
          path: req.url
        }
        let subReq = http.request(subReqOptions, (subRes) => {
          let response = "";

          subRes.on("data", (chunk) => {
            response += chunk;
          });

          subRes.on("end", () => {
            res.end(response);
          });
        });

        subReq.on("error", (err) => {
          res.end(JSON.stringify(err));
        });

        subReq.end();
      } else {
        res.end("Server not found");
      }
    } else {
      // res
    }
  } else if (req.method === "POST" && req.url === "/create-tunnel") {
    let newServerPort = createServer();

    subdomainData.set("sub", newServerPort);

    res.end(newServerPort.toString());
  }

  // event listener



  // if(req.method === "POST" && req.url === "/create-tunnel") {

  //   let newServerPort = createServer();

  //   let newConnectionData = {
  //     message: "Tunnel created",
  //     port: newServerPort
  //   }

  //   res.write(JSON.stringify(newConnectionData));
  //   res.end();
  // } else if (req.method === "GET" && req.url === "/") {
  //   res.end("Icon yo'q");
  // }
  
  // let subdomainData = getSubdomainData(subdomain);

  // res.end(JSON.stringify(subdomainData));
});

let mainServerPort = 80;
mainServer.listen(mainServerPort, () => {
  console.log(`Main server is running on port: ${mainServerPort}`);
});

function getRandomPort(min = 1024, max = 65535) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOpenPort() {
  let newPort = getRandomPort();

  while(ports.has(newPort)) {
    console.log(newPort)
    newPort = getRandomPort();
  }

  ports.add(newPort);
  return newPort;
}

function getSubdomainData(subdomain) {
  let data = subdomainData.get(subdomain);
  return data;
}

function createServer(port = getOpenPort()) {

  const server = http.createServer((req, res) => {
    res.end(`Hi, I'm new server. My port is ${port}`);
  });

  server.listen(port, () => {
    console.log(`New server is running on port ${port}`);
  });
  subdomainData.set("kamoliddin", port);
  return port;
}