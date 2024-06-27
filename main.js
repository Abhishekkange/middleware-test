function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }const https = require('https');
  const fs = require('fs');
  const express = require('express');
  const WebSocket = require('ws');
  var i=0;
  
  const options = {
      key: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.key'),
      cert: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.crt')
  };
  
  const app = express();
  const server = https.createServer(options, app);
  
  const wss = new WebSocket.Server({ server });
  
  const clients = [];
  
//   // Serve your Unity WebGL client
//   app.use(express.static('/home/ec2-user/2'));

//---------------------------------------------------------------------------------AUTH CODE HERE-----------------

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

// ----------------------------------------------------------------------AUTH CODE ENDS HERE
  
  wss.on('connection', (ws, req) => {
      console.log("A client connected, ip " + req.socket.remoteAddress);
          console.log('Total connected clients:'+ wss.clients.length);
      ws.on('message', (data) => {
          console.log(data);
          wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN)
                  client.send(data);
          })
  
      })
  
      ws.on('close', () => {
          if(clients.length==0)i=0;
          console.log(wss.clients.length + ' clients remaining.');
      });
  }
  )

  server.listen(3000, function (req, res) {
    console.log("Server started at port 443");
});
  
  wss.on('listening', () => {
      console.log('WebSocket server is listening on port 443');
  });


  https://chaitanya-garg.com/

  Email :Abhishekkange@gmail.com
  Password : Abhishek