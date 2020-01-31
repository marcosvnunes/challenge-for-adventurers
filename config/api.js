const axios = require('axios')

const api = axios.create({
  baseURL:'https://challenge-for-adventurers.herokuapp.com/'
});

module.exports = api;