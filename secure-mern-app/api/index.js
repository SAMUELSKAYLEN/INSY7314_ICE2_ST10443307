require('dotenv').config();

// Load modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ||
    'http://localhost:5173';

app.disable('x-powered-by');

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'", CLIENT_ORIGIN],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"]
            }
        },
        crossOriginResourcePolicy: {
            policy: 'same-site'
        }
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

// Read JSON data sent in the request body
app.use(express.json({ limit: '10kb' }));

// API status
app.get('/', (req, res) => {
    res.status(200).json({
        app: process.env.APP_NAME || 'SecureAPI',
        message: 'API is running securely'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        protocol: USE_HTTPS ? 'HTTPS' : 'HTTP'
    });
});

// Book routes
app.use('/api/books', bookRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// Error handler
app.use(errorHandler);

if (USE_HTTPS) {
    const keypath = process.env.SSL_KEY_PATH ||
        path.join(__dirname, 'certs', 'localhost-key.pem');

    const certpath = process.env.SSL_CERT_PATH ||
        path.join(__dirname, 'certs', 'localhost-cert.pem');

    const httpsOptions = {
        key: fs.readFileSync(keypath),
        cert: fs.readFileSync(certpath)
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`HTTPS server running on port ${PORT}`);
    });

} else {
    app.listen(PORT, () => {
        console.log(`HTTP server running on port ${PORT}`);
    });
}