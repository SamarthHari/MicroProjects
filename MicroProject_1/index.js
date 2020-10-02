var express = require('express');
var bodyParser = require("body-parser");
const middleware = require('./middleware.js');
const server = require('./server');
var app = express();
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const url= 'mongodb://localhost:27017/';
const dbName='Hosp';
const hosp = "hospinfo";
const vent="ventinfo";
let db;
MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true },(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Database Connection Established: ${url}`);
    console.log(`Database Connected: ${dbName} `);

    app.get('/showHosp', middleware.checkToken,(req,res)=>{
        db.collection(hosp,function(err,collection){
            collection.find().toArray().then(result => res.json(result));
        })
    })

    
    app.get('/showVent', middleware.checkToken,(req,res)=>{
        db.collection(vent,function(err,collection){
            collection.find().toArray().then(result => res.json(result));
        })
    })


    app.post('/getVentByStatus', middleware.checkToken, (req, res) => {
        db.collection(vent, function (err, collection) {
           collection.find({"status":req.body.cur}).toArray(function(err, para) {
            if(err) throw err;    
            res.send(para);            
        });
        
            });
        });
	app.post('/getHospDetails', middleware.checkToken, (req, res) => {
    
                db.collection(hosp, function (err, collection) {
                   collection.find({"name":req.body.hospname}).toArray(function(err, items) {
                    if(err) throw err;    
                    res.send(items);            
                });
                    });
                });  
    app.post('/getVentByHospName',middleware.checkToken, (req, res) => {
    
            db.collection(vent, function (err, collection) {
               collection.find({"name":req.body.hospname}).toArray(function(err, para) {
                if(err) throw err;    
                res.send(para);            
            });
                });
            });
            
    
        app.put('/updateVent', middleware.checkToken, (req,res)=>{
            db.collection(vent, function (err, collection) {
            
                collection.update({"ventilatorId":req.body.ventid}, { $set: {"status" : req.body.ventstatus} },
                        function(err, result){
                                if(err) throw err;    
                                    res.send('Document Updated Successfully');
                    });
                });
            });
            app.post('/addVent', middleware.checkToken, (req,res)=>
            {
                db.collection(vent,function(err,collection)
                {
                    if(err) throw err;
                    collection.insert({ "hId" :req.body.nid,
                    "ventilatorId" : req.body.nvid,
                    "status" : req.body.ns,
                    "name" : req.body.nn}).then(() =>{res.send("Added Succesfully")});
                });
            });
            app.delete('/removeVent', middleware.checkToken, (req,res)=>
            {
                
                db.collection(vent,function(err,collection)
                {
                    if(err) throw err;
                    collection.remove({"ventilatorId":req.body.ventid}).then(() =>{res.send("Deleted Succesfully")});
                });
            });
        });
app.listen(3000);

