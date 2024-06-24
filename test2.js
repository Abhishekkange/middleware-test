const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
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


// Custom middleware to serve static files
const serveStaticFile = (req, res, next) => {
    const filePath = path.join(__dirname, 'public', req.path);
    fs.stat(filePath, (err, stat) => {
        if (err) {
            // File doesn't exist, proceed to next middleware
            return next();
        }
        // File exists, serve it
        res.sendFile(filePath);
    });
};

// Apply the custom static file middleware
app.use('/game', serveStaticFile);

// Define HTTPS options
const options = {
    key: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.crt')
};

// HTTPS server setup
const server = https.createServer(options, app);

// Routes
app.post('/game', checkCredentials, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));