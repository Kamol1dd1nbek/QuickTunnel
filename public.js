import * as http from "http";

const subdomainData = new Map();
const ports = new Set();
let mainServerPort = 80;

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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
}

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
let resultRes = undefined;

// sub servers
function createServer(port = getOpenPort()) {
  const server = http.createServer((req, res) => {
    if (req.url === "/events") {
      eventRes = res;
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write("");
    } else if (req.url === "/request") {
      resultRes = res;
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        if (!eventRes) {
          res.end("Connection not found");
        } else {
          eventRes.write(body);
        }
      });
    } else if (req.url === "/response") {
      let result = "";

      req.on("data", (chunk) => {
        result += chunk;
      });

      req.on("end", () => {
        resultRes.write(result);
        resultRes.end();
      });
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

let i = 0;
const mainServer = http.createServer((req, res) => {
  // create sub server
  if (req.method === "POST" && req.url === "/create-tunnel") {
    let newServerPort = createServer();

    // set user device name instead of sub
    subdomainData.set("sub", newServerPort);
    
    res.end(newServerPort.toString());
    return 1;
  }
  let requestOptions = getRequestOptions(req);
  let subdomain = defineSubdomain(req);

  // request to sub server
  if (subdomain) {
    let subReq = http.request(getSubRequest(subdomain), (subRes) => {
      let response = "";

      subRes.on("data", (chunk) => {
        response += chunk;
      });

      subRes.on("end", () => {
        res.write(response);
        res.end();
      });
    });

    subReq.on("error", (err) => {
      console.log("QTMR -> Sub server : ", err.message);
    });

    subReq.write(JSON.stringify(requestOptions));
    subReq.end();
  } else {
    res.writeHead(404);
    res.end("Server not found");
  }
});

mainServer.listen(mainServerPort, () => {
  console.log(`Main server is running on port: ${mainServerPort}`);
});
