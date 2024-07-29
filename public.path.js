import * as http from "http";

const usersData = new Map();
const ports = new Set();


function defineUser(req) {
  let user = req.url?.split("/")[1];
  if(user) {
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
    body: req?.body
  }
}

function getSubRequest(path){

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

function createServer(port){
  const subServer = http.createServer((req, res) => {
    res.end("I am a sub server");
  });

  subServer.listen(port, () => {
    console.log(`Sub server is running on port ${port}`);
  });
}

const server = http.createServer((req, res) => {
  if(req.url === "/create-server") {
    createServer(2007);
  }
  res.end("hi")
});

server.listen(2006, () => {
  console.log("Server is running on port 2006");
})