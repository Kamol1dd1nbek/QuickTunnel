import * as http from "http";

// application
const app = http.createServer((req, res) => {
  if(req.url == "/") {
    res.end("home")
  } else {
    res.end("other")
  }
});

app.listen(2999, () => {
  console.log("Local app 2999 portsa ishlab turibdi");
});