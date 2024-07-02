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

startAgent();






// const app = http.createServer((req, res) => {
//   const options = {
//       host: "localhost",
//       port: 2999,
//       method: "GET",
//       path: req.url
//       };
// const request = http.request(options2, (response) => {
//   let result = "";
//   response.on("data", (chunk) => result+=chunk);
  
//   response.on("end", () => {
//     console.log(result)
//     res.end(result)
//   });
// });

// request.on("error", err => {
//   console.log(err.message)
// })
// request.end();
// });

// app.listen(3000, () => {
//   console.log("Agent 3000 portda ishlamoqda")
// })