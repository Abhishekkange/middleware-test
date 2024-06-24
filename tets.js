const cors = require('cors');
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to check credentials
const checkCredentials = (req, res, next) => {
    const { email, password } = req.body;

    if (email === "Abhishekkange@gmail.com" && password === "Abhishek") {
        // User authenticated
        next();
    } else {
        // Invalid credentials
        return res.send("Invalid credentials");
    }
};

app.use(checkCredentials);

app.use('/game', express.static(path.join(__dirname, 'public')));

// Define HTTPS options
const options = {
    key: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.crt')
};

// HTTPS server setup
const server = https.createServer(options, app);

// Routes


// Start HTTPS server
server.listen(3000, () => {
    console.log("HTTPS Server started on port 3000");
});

