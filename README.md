# ShoppingList
> Fullstack Shopping List application build with MongoDB, Express, React and Node.js.

## Quick Start
### Installation

```bash
# Install dependencies for server
npm install

# Install dependencies for client
cd client && npm install

# Run the client & server with concurrently
npm run dev

# Run the express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

### Configuration

Add your own MONGO_URI and JWTSecret in the project config file.

```json
{
    "mongoURI": "YOUR_MONGO_URI",
    "jwtSecret": "YOUR_SECRET"
}
```
