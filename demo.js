function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }const https = require('https');
  const fs = require('fs');
  const express = require('express');
  const WebSocket = require('ws');
  const { debug } = require('util');
  var i=0;
  
  const options = {
      key: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.key'),
      cert: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.crt')
  };
  
  const app = express();
  const server = https.createServer(options, app).listen(3000, function (req, res) {
      console.log("Server started at port 443");
  });

  //-----------------------------------------------------------AUTHENTICATION SYSTEM----------------------------------
  
  const path = require('path');
  const jwt = require('jsonwebtoken');
  const  cors = require('cors');
  app.use(cors())


  // express.static(path.join(__dirname, 'public'));
  
  console.log(path.join(__dirname, 'public'));
  
  app.use(express.json());
  
  
  
  app.get('/', (req, res) => {
  
  
      res.sendFile(path.join(__dirname, 'credentials.html'));
  
  
  });
  
  
  
  app.post('/generateToken', function (req, res) {
  
  
  
      const email = req.body.email;
      const password = req.body.password;
  
      if (email != null) {
  
          if (email == "Abhishekkange@gmail.com" && password == "Abhishek") {
              const data = {
                  key: "ShahrukhKhan"
              }
              const token = jwt.sign(data, "shahrukhKhan");
              res.send(token);
          }
  
  
  
      }else{
  
          res.send("Error: Invalid credentials")
      }
  
  
  
  });
  
  const authenticate = (req, res, next) => {
  
      const token = req.params.token;
      const data = jwt.verify(token, "shahrukhKhan");
      console.log(data);
      if (data.key === "ShahrukhKhan") {
  
          next();
      }
      else {
  
          res.send("Invalid credentials");
      }
  
  
  
  
  
  }
  
  
  app.use('/game/:token', authenticate, express.static(path.join(__dirname, 'public')));

















  //-------------------------------------------------------------------------------------------------------------------
//   app.use(express.static('/home/ec2-user/2'));
  const wss = new WebSocket.Server({ server });
  
  var DataTable = [];
  
  function ClientContent(id, type, transform, isConnected, ws, ip) {
      this.id = id;
      this.type = type;
      this.transform = transform;
      this.isConnected = isConnected;
      this.ws = ws;
  }
  
  function ObjectContent(id, type, transform, ownerId) {
      this.id = id;
      this.type = type;
      this.transform = transform;
      this.ownerId = ownerId;
  }
  
  function UpdateTransform(id, transform) {
      DataTable.find((element) => element.id == id).transform = transform
  }
  
  function UpdateOwner(id, ownerId) {
      if (DataTable.find((element) => element.id == ownerId).ownerId == undefined)
          if (DataTable.find((element) => element.id == id).isConnected == undefined)
              DataTable.find((element) => element.id == id).ownerId = ownerId
  }
  
  // Serve your Unity WebGL client
  //app.use(express.static('/home/ec2-user/2'));
  
  wss.on('connection', (ws, req) => {
      console.log("A new client connected, ip " + req.socket.localAddress);
  
      ws.on('message', (data) => {
  
          payload = decode(data);
  
          switch (payload.payloadType) {
  
              case 0:
                  //asking for its id, if exits send, else make and send
                  if (DataTable.find((t) => t.ws == ws) == undefined) {
                      DataTable.push(new ClientContent(generateUniqueId(), payload.data[0].type, payload.data[0].rigTransform, true, ws, req.socket.remoteAddress))
  
                      let index = DataTable.findIndex((t) => t.ws == ws)
  
                      //broadcast add
                      broadcast({
                          'payloadType': 2,
                          'data': [
                              DataTable[index]
                          ]
                      }, ws);
  
                  }
                  console.table(DataTable);
                  ws.send(encode({
                      'payloadType': 1,
                      data : [{
                          'id' : DataTable.find((t) => t.ws == ws).id
                      }]
                  }));
                  break;
              case 2:
                  break;
              case 3:
                  break;
              case 4:
                  if (DataTable.find((t) => t.id == payload.data[0].id) != undefined) {
                      i = DataTable.findIndex((t) => t.id == payload.data[0].id)
                      if (DataTable[i].type <= 2) DataTable[i].transform = payload.data[0].rigTransform
                      else DataTable[i].transform = payload.data[0].objectTransform;
                  }
  
                  //broadcast add
                  broadcast(payload, ws)
                  break;
              case 5:
                  ws.send(encode({
                      payloadType: 6,
                      sentTime: payload.sentTime,
                      data : DataTable
                  }))
                  break;
              case 6:
                  break;
          }
      })
      ws.on('close', () => {
          console.log('client left.');
  
          let index = DataTable.findIndex((t) => t.ws == ws)
  
          if (DataTable[index] != undefined) {
          broadcast(encode({
              payloadType: 3,
              data: [
                  DataTable[index]
              ]
          }), undefined)
  
              DataTable.splice(index, 1);
          }
  
          console.table(DataTable);
      });
  }
  )
  
  wss.on('listening', () => {
      console.log('WebSocket server is listening on port 443');
  });
  function broadcast(payload, ws) {
      DataTable.forEach((e) => {
          if (e.isConnected == true && e.ws != ws) e.ws.send(encode(payload));
      })
  }
  /*function broadcast(payload) {
      DataTable.forEach((e) => {
          if (e.isConnected == true)  e.ws.send(encode(payload)); })
  }*/
  function decode(jsonData) {
      return JSON.parse(new TextDecoder("utf-8").decode(jsonData));
  }
  function encode(stringData) {
      return new TextEncoder("utf-8").encode(JSON.stringify(stringData));
  }