const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

function keepAlive() {
  app.listen(3000, () => {
    console.log('🌐 Web server running on port 3000');
  });
}

module.exports = keepAlive; // Export the keep-alive function

