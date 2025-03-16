const https = require('https');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const agent = new https.Agent({
  rejectUnauthorized: false
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
  httpsAgent: agent
});

module.exports = cloudinary;


