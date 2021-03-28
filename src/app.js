const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
router.use(compression());

// Remove Express headers from responses
app.disable('x-powered-by');

// Add the body parser middleware
app.use(bodyParser.json({ type: 'application/gzip', limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'application/json', limit: '50mb', extended: true }));

// Health check
app.get('/sping', (req, res) => {
  res.status(200).send('OK');
});

app.get('*', (req, res) => {
  res.status(200).send('Working');
});

app.use('/', router);

module.exports = app;