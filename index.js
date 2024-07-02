// const http = require("http");

// // Nishonlanadigan portlar
// const PORT = 8080;
// const PROXY_PORT = 3001;

// // Proxy serverni yaratish
// const proxyServer = http.createServer((req, res) => {
//   // Real serverga o'zgartirilmagan so'rovni yuborish
//   const options = {
//     hostname: "localhost", // Real server nomi yoki IP manzili
//     port: 3000, // Real server porti
//     path: req.url,
//     method: req.method,
//     headers: req.headers,
//   };

//   // Real serverga murojaat qilish
//   const proxyRequest = http.request(options, (proxyResponse) => {
//     res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
//     proxyResponse.pipe(res, { end: true });
//   });

//   req.pipe(proxyRequest, { end: true });
// });

// // Proxy serverni eshitish
// proxyServer.listen(PROXY_PORT, () => {
//   console.log(`Proxy server ishga tushdi: http://localhost:${PROXY_PORT}`);
// });


import * as http from "http";

const server = http.createServer((req, res) => {
  const host = req.headers.host; // "Host" sarlavhasini olish
    const parts = host.split('.');
    console.log(parts)

    if (parts.length > 1) {
        const subdomain = parts.slice(0, parts.length - 1).join('.');
        console.log(`Subdomain: ${subdomain}`);
    } else {
        console.log('No subdomain');
    }
  res.end("Ok")
});

server.listen(80, () => {
  console.log("Ok")
})