  
var bodyParser = require('body-parser');

const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

app.listen(3000, () => {
    console.log('listening on 3000');
});
app.set('view engine', 'ejs');
app.use(express.static('public')); 
var result;

MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    console.log('Connected');
    db = client.db("Stocks");
    app.get('/', (req, res) => {
        db.collection('Products').find({}).toArray((err, result) => {
            res.render('index.ejs', { users: result });
        });
        
    });
    app.get('/add', (req, res) => {
            res.render('addprod.ejs');
        });
        app.get('/edit', (req, res) => {
           db.collection('Products').find({'Product ID': (req.query.pid)}).toArray((err,result)=>{
                res.render('edit.ejs',{users:result})
           });
        });
        app.get('/update', (req, res) => {
            res.render('update.ejs');
        });
        app.post('/added', (req, res) => {
            db.collection('Products').insertOne({ 
                'Product ID':(req.body.pid),
                'Brand':req.body.brand,
                'Category':req.body.category,
                'Name':req.body.pn,
                'Size':req.body.Size,
                'Quantity':req.body.qnty,
                'Cost Price':req.body.cp,
                'Selling Price':req.body.sp
            }

            , function(err,result){
              if(err) throw err;
              console.log("1 data inserted succesfully")
        })
        res.redirect('/');
        });
        app.post('/updated', (req, res) => {
            var date_ob = new Date(req.body.did);
                    let date = date_ob.getDate();
                    let month = date_ob.getMonth() + 1;
                    let year = date_ob.getFullYear();
                    var time_date = date + "-" + month + "-" + year;
                    db.collection('Sold').insertOne({
                        'Purchase Date': time_date, 
                        'Product ID':(req.body.pid),
                        'Quantity':req.body.qnty,
                        'Unit Price':Number(req.body.up),
                        'Sales':Number(req.body.qnty)*Number(req.body.up)
    
            }

            , function(err,result){
              if(err) throw err;
              console.log("1 data updated succesfully")
        })
        
        res.redirect('/details');
        });
    app.get('/delete',(req,res)=>
    {
        db.collection('Products').deleteOne({
            'Product ID':(req.query.pid)
        }
            , function(err,result){
                if(err) throw err;
                console.log("1 data deleted succesfully")
                console.log(req.query.pid)
        });
    res.redirect('/');
    });
    app.post('/edited', (req, res) => {
        db.collection('Products').updateOne({
            'Product ID': req.body.pid
        }, {
            $set: {
                'Quantity': Number(req.body.newq),
                'Cost Price': Number(req.body.newcp),
                'Selling Price': Number(req.body.newsp)
            }
        }, (err, result) => {
            if (err) throw err;
            console.log("1 data edited succesfully");
        });
        res.redirect('/');
    });
    app.get('/details', (req, res) => {
        db.collection('Sold').find({}).toArray((err,result)=>{
             res.render('details.ejs',{users:result})
        });
     });
    });
