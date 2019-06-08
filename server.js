var http    = require("http");              // http server core module
var express = require("express");

var app = express();
app.use(express.static("static"));

app.get('*', (req, res) => {
	// console.log("I get smth")
  	// res.send('hello world')
    res.sendFile(__dirname + '/static/index.html');  
})


var server = http.createServer(app);
server.listen(8080, ()=>{
	console.log("Running on *:8080")
})

