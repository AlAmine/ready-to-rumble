const express = require('express')
const app = express()
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const md5 = require('MD5')
const url = 'mongodb://nodeApp:567890@127.0.0.1:27017/memory';
let DB;

app.use(express.static('public'))

app.listen(process.env.PORT || 8080, () => console.log('We are in the Building'))
