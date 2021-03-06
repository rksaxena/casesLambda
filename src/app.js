const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const { requestHandler } = require('./artifactHandler');
const api = require('./routes/api');

const app = express();
const router = express.Router();
router.use(compression());

router.use('/api', api);

// Remove Express headers from responses
app.disable('x-powered-by');

// Add the body parser middleware
app.use(bodyParser.json({ type: 'application/gzip', limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'application/json', limit: '50mb', extended: true }));

// Health check
app.get('/sping', (req, res) => {
  res.status(200).send('OK');
});

//app.get('*', async (req, res, next) => {
//  requestHandler(req, res, next);
//});

app.use('/', router);

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


module.exports = app;
