import * as http from "http";

// application
const app = http.createServer((req, res) => {
  if(req.url == "/") {
    res.end("Home")
  } else {
    res.end("other")
  }
});

app.listen(4321, () => {
  console.log("Local app 4321 portda ishlab turibdi");
});