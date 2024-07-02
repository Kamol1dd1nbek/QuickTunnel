import * as http from "http";

const ports = new Set();
const subdomainData = new Map();

subdomainData.set("sub", {port: 43243})

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
  let subdomain = defineSubdomain(req);
  if(!subdomain) res.end("Bye bye");
  
  let subdomainData = getSubdomainData(subdomain);

  res.end(JSON.stringify(subdomainData));
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

function createServer() {
  const port = getOpenPort();

  const server = http.createServer((req, res) => {
    res.end(`Hi, my port is ${port}`);
  });

  server.listen(port, () => {
    console.log(`New server is running on port ${port}`);
  });
  subdomainData.set("kamoliddin", port);
  return port;
}

// console.log(createServer());
// console.log(getSubdomainData("kamoliddin"))

// agentga buyruq orqali proxy s ga create tunnel buyrugi yuborishni qilish
//  subdomainga qarab kichik serverlarga tarqatishni qilish,
//  kichik serverlar qabul qilib olgandan keyin agentlarga yuborishni qo'shish
