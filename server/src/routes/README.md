# API Routes Structure

This directory contains all API routes organized by version.

## Directory Structure

```
routes/
├── v1/                 # API Version 1 (Current/Active)
│   ├── index.js       # Route exports
│   ├── authRoutes.js  # Authentication endpoints
│   ├── gigRoutes.js   # Gig CRUD endpoints
│   └── bidRoutes.js   # Bid endpoints
│
└── v2/                 # API Version 2 (Future/Placeholder)
    ├── index.js       # Route exports
    ├── authRoutes.js  # Placeholder for future auth routes
    ├── gigRoutes.js   # Placeholder for future gig routes
    └── bidRoutes.js   # Placeholder for future bid routes
```

## API Versioning Strategy

### Current Version: v1

All active routes are in the `v1/` folder and accessible via `/api/v1/*` endpoints.

**Active Endpoints:**
- `/api/v1/auth/*` - Authentication (register, login, logout)
- `/api/v1/gigs/*` - Gig management (CRUD operations)
- `/api/v1/bids/*` - Bid management

### Future Version: v2

The `v2/` folder contains placeholder files for future API enhancements. When implementing v2:

1. **Add new features** to v2 route files
2. **Uncomment v2 routes** in `src/index.js`
3. **Update documentation** in Swagger config
4. **Maintain v1 routes** for backward compatibility

## Adding a New Version

When creating a new API version (e.g., v3):

1. Create a new folder: `routes/v3/`
2. Copy the structure from `v2/` or create new route files
3. Create an `index.js` file to export all routes
4. Register routes in `src/index.js`:
   ```javascript
   const v3Routes = require('./routes/v3');
   app.use('/api/v3/auth', v3Routes.authRoutes);
   app.use('/api/v3/gigs', v3Routes.gigRoutes);
   app.use('/api/v3/bids', v3Routes.bidRoutes);
   ```
5. Update Swagger configuration to document v3 endpoints

## Best Practices

### 1. **Backward Compatibility**
- Never break existing v1 routes
- Keep v1 active even after releasing v2
- Deprecate old versions gradually with proper notice

### 2. **Version Deprecation**
When deprecating a version:
- Add deprecation warnings in responses
- Set a sunset date (e.g., 6 months notice)
- Document migration path in README
- Send deprecation headers:
  ```javascript
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 01 Jan 2027 00:00:00 GMT');
  ```

### 3. **Breaking Changes**
Only introduce breaking changes in new versions:
- Changed response structure
- Removed endpoints
- Modified authentication mechanism
- Different validation rules

### 4. **Non-Breaking Changes**
Can be added to existing versions:
- New optional fields
- New endpoints
- Performance improvements
- Bug fixes

## Version Lifecycle

```
v1 (Active) ──────────────────────────────────────────────►
                │
                └──► v2 (Development) ──► v2 (Active) ─────►
                                              │
                                              └──► v3 (Development)
```

## Migration Guide

When migrating from v1 to v2:

1. **Review v2 changes** in the changelog
2. **Update API endpoints** in your client code
3. **Test thoroughly** in development
4. **Deploy gradually** using feature flags
5. **Monitor errors** and rollback if needed

## Example: Activating v2

To activate v2 routes, edit `src/index.js`:

```javascript
// Uncomment these lines:
const v2Routes = require('./routes/v2');
app.use('/api/v2/auth', v2Routes.authRoutes);
app.use('/api/v2/gigs', v2Routes.gigRoutes);
app.use('/api/v2/bids', v2Routes.bidRoutes);
```

Then update Swagger config to include v2 documentation.

## Documentation

Each version should be documented in:
- **Swagger/OpenAPI** - Interactive API docs at `/api-docs`
- **README.md** - High-level overview
- **CHANGELOG.md** - Version-specific changes
- **Route comments** - JSDoc annotations in route files

## Questions?

For questions about API versioning strategy, refer to:
- Main README.md
- UPGRADE_CHANGELOG.md
- Swagger documentation at `/api-docs`
