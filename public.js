import * as http from "http";

const ports = new Set();
const subdomainData = new Map();

function defineSubdomain(req) {
  let subdomain = undefined;
  let host = req.headers.host;
  let parts = host.split(".");

  if (parts.length >= 2) {
    subdomain = parts[0];
  }

  return subdomain;
}

function getRequestOptions(req) {
  return {
    headers: req?.headers,
    method: req.method,
    path: req.url,
    body: req?.body,
  };
}

function getSubRequest(subdomain) {
  return {
    hostname: "localhost",
    port: getSubdomainData(subdomain),
    path: "/request",
    method: "GET"
  };
}

const mainServer = http.createServer((req, res) => {
  // from user
  let requestOptions = getRequestOptions(req);
  let subdomain = defineSubdomain(req);

  if(subdomain) {
    let subdomainData = getSubdomainData(subdomain);
  }
  
  // -------
  if (req.method == "GET") {
    if (subdomain) {
      let subdomainData = getSubdomainData(subdomain);
      if (subdomainData) {
        let subReq = http.request(getSubRequest(), (subRes) => {
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

        subReq.write(JSON.stringify(getRequestOptions(req)));
        subReq.end();
      } else {
        res.end("Server not found");
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  } else if (req.method === "POST" && req.url === "/create-tunnel") {
    let newServerPort = createServer();

    subdomainData.set("sub", newServerPort);

    res.write(newServerPort.toString());
    res.end();
  }
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

  while (ports.has(newPort)) {
    console.log(newPort);
    newPort = getRandomPort();
  }

  ports.add(newPort);
  return newPort;
}

function getSubdomainData(subdomain) {
  let data = subdomainData.get(subdomain);
  return data;
}

let eventRes = undefined;
function createServer(port = getOpenPort()) {
  const server = http.createServer((req, res) => {
    if (req.url === "/events") {
      eventRes = res;
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write(`data: ${new Date().toISOString()}\n`);
    } else if (req.url === "/request") {
      let requestOptions = {
        path: req.url,
        method: req.method,
        body: req.body,
        headers: req.headers,
      };
      if (!eventRes) {
        res.end("Connection not found");
      } else {
        eventRes.write(JSON.stringify(requestOptions));
      }
    } else if (req.url === "/response") {
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(port, () => {
    console.log(`New sub server is running on port: ${port}`);
  });
  return port;
}
