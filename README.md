# GigFlow

A mini-freelance marketplace platform with role-based access control and comprehensive API documentation.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Real-time: Socket.io
- Authentication: JWT with HttpOnly cookies
- Validation: Joi
- API Documentation: Swagger/OpenAPI 3.0

## Features
- User Authentication (Login/Register) with role-based access control
- Role-Based Authorization (User/Admin)
- Post Gigs (Jobs) with full CRUD operations
- Browse Gigs (Search by title)
- Place Bids on Gigs
- Hire Freelancers (Atomic transaction)
- Real-time Notifications (Socket.io)
- Dashboard for managing Gigs and Bids
- Input validation on all endpoints
- Centralized error handling
- Comprehensive API documentation with Swagger

## API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

The Swagger UI provides:
- Complete API reference for all endpoints
- Request/response schemas
- Try-it-out functionality
- Authentication testing

## API Versioning

All API routes are versioned under `/api/v1`:
- Authentication: `/api/v1/auth/*`
- Gigs: `/api/v1/gigs/*`
- Bids: `/api/v1/bids/*`

## Role-Based Access Control

### User Roles
- **user** (default): Can create, read, update, and delete their own resources
- **admin**: Full access to all resources across all users

### Authorization Rules
- Users can only modify their own gigs
- Admins can modify any gig
- Protected routes require valid JWT token
- Role-specific operations return 403 Forbidden if unauthorized

## Setup

### Backend
1. `cd server`
2. `npm install`
3. Create `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_secure_jwt_secret_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. `npm run dev` (Runs on port 5000)

### Frontend
1. `cd client`
2. `npm install`
3. Update API endpoints to use `/api/v1` prefix
4. `npm run dev` (Runs on port 5173)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Gigs (CRUD)
- `GET /api/v1/gigs` - Get all open gigs (public)
- `POST /api/v1/gigs` - Create gig (authenticated)
- `GET /api/v1/gigs/my` - Get user's gigs (authenticated)
- `GET /api/v1/gigs/:id` - Get gig by ID (public)
- `PUT /api/v1/gigs/:id` - Update gig (owner or admin)
- `DELETE /api/v1/gigs/:id` - Delete gig (owner or admin)

### Bids
- `GET /api/v1/bids` - Get all bids
- `POST /api/v1/bids` - Create bid
- Additional bid endpoints...

## Scalability & Security Considerations

### Authentication & Security
- **Stateless JWT Authentication**: Tokens are self-contained, enabling horizontal scaling without session storage dependencies
- **HttpOnly Cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Joi schemas validate all user inputs before processing
- **Helmet.js**: Sets security-related HTTP headers
- **CORS Configuration**: Restricts cross-origin requests to trusted domains
- **Role-Based Access Control**: Granular permissions prevent unauthorized access

### Horizontal Scaling
- **Stateless Architecture**: JWT-based auth allows requests to be handled by any server instance
- **Database Connection Pooling**: Mongoose manages connection pools efficiently
- **Load Balancing Ready**: Multiple server instances can run behind a load balancer (nginx, AWS ALB)
- **Process Management**: Use PM2 or similar for clustering and zero-downtime deployments

### Caching Strategy
- **Redis Integration** (Recommended for production):
  - Cache frequently accessed gigs and user data
  - Session storage for real-time features
  - Rate limiting to prevent abuse
  - Example: `GET /api/v1/gigs` results cached for 5 minutes

### Database Optimization
- **Indexing**: Add indexes on frequently queried fields (email, ownerId, status)
- **Query Optimization**: Use `.lean()` for read-only operations
- **Pagination**: Implement limit/offset for large datasets
- **Database Replication**: MongoDB replica sets for high availability

### Containerization & Deployment
- **Docker**: Containerize application for consistent environments
  ```dockerfile
  # Example: Multi-stage build for optimized images
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 5000
  CMD ["npm", "start"]
  ```
- **Docker Compose**: Orchestrate app, database, and Redis
- **Kubernetes**: For advanced orchestration and auto-scaling

### Monitoring & Logging
- **Structured Logging**: Use Winston or Pino for production logs
- **Error Tracking**: Integrate Sentry or similar for error monitoring
- **Performance Monitoring**: New Relic, DataDog, or Prometheus
- **Health Checks**: `/health` endpoint for load balancer monitoring
- **Metrics**: Track response times, error rates, and throughput

### API Rate Limiting
- **express-rate-limit**: Prevent abuse and DDoS attacks
  ```javascript
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);
  ```

### Environment-Specific Configuration
- **Development**: Detailed logging, CORS enabled for localhost
- **Staging**: Production-like environment for testing
- **Production**: 
  - Secure cookies (sameSite: 'none', secure: true)
  - Minimal logging (errors only)
  - Rate limiting enabled
  - Database connection pooling optimized

### Future Enhancements
- **Microservices Architecture**: Split into auth, gigs, bids, and notification services
- **Message Queue**: RabbitMQ or Kafka for async operations (emails, notifications)
- **CDN**: CloudFront or Cloudflare for static assets
- **Database Sharding**: Horizontal partitioning for massive scale
- **GraphQL**: Alternative API layer for flexible queries
- **WebSocket Scaling**: Redis adapter for Socket.io in multi-server setup

## Testing

### Recommended Testing Strategy
- **Unit Tests**: Jest for controllers, middleware, and utilities
- **Integration Tests**: Supertest for API endpoint testing
- **Load Testing**: Artillery or k6 for performance benchmarks
- **Security Testing**: OWASP ZAP for vulnerability scanning

## License

MIT
