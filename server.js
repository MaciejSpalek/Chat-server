const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors');

app.use(cors());

http.listen(5000, () => console.log('Server started'))