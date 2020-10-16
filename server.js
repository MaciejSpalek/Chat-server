const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors');
const { listeners } = require('./listeners');

listeners(io)
app.use(cors());

http.listen(PORT, () => console.log('Server started'))