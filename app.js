import * as http from "http";

// application
const app = http.createServer((req, res) => {
  if(req.url == "/") {
    console.log(1)
    res.end(JSON.stringify(req.headers["x-forwarded"]))
  } else {
    res.end("other")
  }
});

app.listen(2999, () => {
  console.log("Local app 2999 portda ishlab turibdi");
});