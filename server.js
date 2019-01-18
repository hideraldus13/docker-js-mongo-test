const express = require('express');
const mongodb = require('mongodb');
const bodyParser= require('body-parser');
const config = require('./db');

const app = express();

const PORT = 4000;  
const client = mongodb.MongoClient;

var banco;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

client.connect(config.DB, function(err, db) {
    if(err) {
        console.log(err.message)
    }
    else {
        console.log('connected!!');
        banco = db.db('escreveai');
        app.listen(PORT, () => {
            console.log('listening on 4000') 
        })
    }
});  

app.get('/', (req, res) => {
    banco.collection('notas').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {notas: result})
    })
  })

app.post('/notas', (req, res) => {
    console.log(req.body)
    banco.collection('notas').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
});
