const express = require('express');
// const fetch = require('node-fetch');

const api = express.router();

api.post('registerCase', (req, res) => {
  res.status(200).send('Dummy Respnse');
});
