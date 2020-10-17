var express = require('express'),
    path    = require('path'),
    bodyParser = require('body-parser'),
    cons    = require('consolidate'),
    dust    = require('dustjs-helpers'),
    pg      = require('pg'),
    app     = express();

//db connection string

const { Client } = require('pg');
const connectionString = 'postgres://postgres:Bayu081809235823@localhost:5432/mlmgame';
const client = new Client({
    connectionString: connectionString
});

client.connect()
    .then(res => console.log("Connected successfully..."))
    .catch(err => console.log("Connection failed..."));

//assign dust engine to .dust files
app.engine('dust', cons.dust);

//set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    client.query('SELECT * FROM userdb', function(err, result){
        if(err){
            return console.error('error running query', err);
        }
        console.log(result.rows);
        res.render('index', {user: result.rows});
    });

    
});

app.post('/add', function(req, res){
    client.query("INSERT INTO userdb(username, first_name, last_name, email, gender, date_of_birth) VALUES($1, $2, $3, $4, $5, $6)",
    [req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.gender, req.body.dateOfBirth], function(err, result){
        if(err){
            return console.error('error running query', err);
        }
        res.redirect('/');
    });
});

app.delete('/delete/:username', function(req, res){
    client.query("DELETE FROM userdb WHERE username = $1;", [req.params.username], function(err, result){
        if(err){
            return console.error('error running query', err);
        }
        client.query('SELECT * FROM userdb', function(err, result){
            if(err){
                return console.error('error running query', err);
            }
            console.log(result.rows);
            res.render('index', {user: result.rows});
        });
    });
});


app.post('/edit', function(req, res){
    client.query("UPDATE userdb SET first_name=$2, last_name=$3, email=$4, gender=$5, date_of_birth=$6 WHERE username=$1",
    [req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.gender, req.body.dateOfBirth], function(err, result){
        if(err){
            return console.error('error running query', err);
        }
        res.redirect('/');
    });

    
});


//server
app.listen(3000, function(){
    console.log('server started on port 3000');
});