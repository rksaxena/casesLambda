const express = require('express');
var FormData = require('form-data');
//var data = new FormData();

const { request } = require('../utils/apiHelper');

const api = express.Router();

api.route('/registerCase').post(async (req, res) => {
  console.log(req.body); 
  let form_data = new FormData();
  for ( var key in req.body ) {
    form_data.append(key, req.body[key]);
  }

  const opts = {
    method: 'POST',
    headers: { 
      ...form_data.getHeaders()
    },
    data: form_data
  }
  const url = 'https://script.google.com/macros/s/AKfycbyX8Hub8gPVGOsTSpHZDZjpJKL-OnKenqN1t7fG7ZzMXIpSZimnzUWhNr5o-socg5gLZw/exec'
  const response = await request(url, opts);
  console.log(response);
  res.status(200).send(response);
});

module.exports = api;
