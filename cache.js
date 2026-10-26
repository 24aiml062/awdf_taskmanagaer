const NodeCache = require('node-cache');

// P9: Initialize node-cache with 60 seconds standard TTL
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

module.exports = cache;
