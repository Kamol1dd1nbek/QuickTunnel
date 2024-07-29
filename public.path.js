import * as http from "http";
import { hostname } from "os";

const usersData = new Map();
// user: port

const ports = new Set();

function defineUser(req) {
  let user = req.url?.split("/")[1];
  if (user) {
    return user;
  } else {
    return null;
  }
}

function getRequestOptions(req) {
  return {
    headers: req.headers,
    method: req.method,
    path: url.path, //userning nomini url dan olib tashlash kerak
    body: req?.body,
  };
}

function getSubRequest(user) {
  return {
    hostname: "localhost",
    port: usersData.get(user),
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
    if(url === "/request") {
      resultRes = res;
      
      let body = "";
      resultRes.end("It is answer from sub server")
      // req.on("data", (chunk) => {
      //   body += chunk;
      // });
      
      // req.on("end", () => {
      //   if(!eventRes) {
      //     res.status(404).end("Connection not found");
      //   } else {
      //     eventRes.write(body);
      //   }
      // })
    }
    res.end("I am a sub server");
  });

  subServer.listen(port, () => {
    console.log(`Sub server is running on port ${port}`);
  });

  return port;
}

const server = http.createServer((req, res) => {
  if (req.url === "/create-server") {
    let newServerPort = createServer(2007);
    usersData.set("kamoliddin", newServerPort);
  }

  let user = defineUser(req);

  if(user && usersData.get(user)) {
    let subReq = http.request(getSubRequest(user), (subRes) => {
      let response = "";

      subRes.on("data", (chunk) => {
        response += chunk;
      });

      subRes.on("end", () => {
        res.write(response);
        res.end()
      })
    })
  } else {
    res.end("User not found");
  }
});

server.listen(2006, () => {
  console.log("Server is running on port 2006");
});
