const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});

app.set('io', io);

io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'GigFlow API Documentation'
}));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API v1 Routes
const v1Routes = require('./routes/v1');
app.use('/api/v1/auth', v1Routes.authRoutes);
app.use('/api/v1/gigs', v1Routes.gigRoutes);
app.use('/api/v1/bids', v1Routes.bidRoutes);

// API v2 Routes (placeholder - not active yet)
// const v2Routes = require('./routes/v2');
// app.use('/api/v2/auth', v2Routes.authRoutes);
// app.use('/api/v2/gigs', v2Routes.gigRoutes);
// app.use('/api/v2/bids', v2Routes.bidRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'GigFlow API v1.0.0',
        documentation: '/api-docs',
        health: '/health'
    });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
