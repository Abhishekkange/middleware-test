const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');


const options = {
    key: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.crt')
};

// HTTPS server setup



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

const server = https.createServer(options, app);



server.listen(3000, () => {
    console.log("HTTPS Server started on port 4000");
});
