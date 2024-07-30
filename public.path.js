import { write } from "fs";
import * as http from "http";
import { hostname } from "os";

const usersData = new Map();
const ports = new Set();

function defineUser(req) {
  return req.url?.split("/")[1] || null;
}

function removeUserName(url) {
  return "/" + url.split("/").slice(2).join("/");
}

function getRequestOptions(req) {
  return {
    headers: req.headers,
    method: req.method,
    path: removeUserName(req.url),
    body: req?.body,
  };
}

function getSubRequest(port) {
  return {
    hostname: "localhost",
    port,
    path: "/request",
    method: "POST",
    headers: {
      "Content-type": "application/json",
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

let eventRes = undefined;
let resultRes = undefined;

function createServer(port) {
  const subServer = http.createServer((req, res) => {
    let url = req.url;
    if (url === "/request") {
      resultRes = res;

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        if (!eventRes) {
          res.writeHead(404);
          res.end("Connection not found");
        } else {
          eventRes.write(body);
        }
      });
    } else if (url === "/events") {
      eventRes = res;

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-control": "no-cache",
        Connection: "keep-alive",
      });

      res.write("");
    } else if (url === "/response") {
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

  subServer.listen(port, () => {
    console.log(`Sub server is running on port ${port}`);
  });

  return port;
}

const server = http.createServer((req, res) => {
  if (req.url === "/create-server" && req.method === "POST") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      data = JSON.parse(data);
      if (data.username) {
        let newServerPort = createServer(2007);
        usersData.set(data.username, newServerPort);
        res.end(
          JSON.stringify({
            port: newServerPort,
            link: `http://35.230.11.105:2006/${data.username}`,
          })
        );
      } else {
        res.end("User data is not defined");
      }
    });
    return;
  } else {
    console.log(1);
    let userPort = usersData.get(defineUser(req));
    console.log(2);

    if (userPort) {
      console.log(3);

      let subReq = http.request(getSubRequest(userPort), (subRes) => {
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
        console.log("Error on: QTMR -> Sub server");
      });

      subReq.write(JSON.stringify(getRequestOptions(req)));
      subReq.end();
    } else {
      res.writeHead(404);
      res.end("User not found");
    }
  }
});

server.listen(2006, () => {
  console.log("Server is running on port 2006");
});

// user create server qilganda pubic link berish kerak
