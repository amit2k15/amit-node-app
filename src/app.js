const express = require('express');

function createApp() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello from Dockerized Node.js app!',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  return app;
}

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  module.exports = server;
}

module.exports = createApp;