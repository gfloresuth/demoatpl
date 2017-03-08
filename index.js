// se agrega modulo express
var express = require('express');
var bodyParser = require('body-parser');





var Promise = require('bluebird');


var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : 'localhost',
        user : 'root',
        password : 'secret123',
        database : 'minishop'
    }
});




var modelProducts = require('./models/products');



var objProducts= Promise.promisifyAll(new modelProducts(knex));



// se crea servidor
var app = express();
// se usa body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// se declara puerto
const PORT=3000;

// se agrega ruta fija /assets en directorio /assets
app.use('/assets', express.static(__dirname + '/assets'));
// se agrega un engine llamado 'html', el cual es 'atpl'
app.engine('html', require('atpl').__express);
// se especifica que el 'view engine' es 'html' (declarado previamente)
app.set('view engine','html');

app.set('devel',false);



app.get('/products/pages/', function (req, res, next) {
    console.log('[GET /products]');
    objProducts.getProducts({perPage:5,currentPage:1}).then(function(data){
       
        res.render('listado',{products:data});
    });
});

app.get('/products/pages/:page', function (req, res, next) {
    console.log('[GET /products/pages]');
    objProducts.getProducts({perPage:5,currentPage:req.params.page}).then(function(data){
        res.render('listado',{products:data});
    });
});


app.get('/products/pagesinfo', function (req, res, next) {
    console.log('[GET /products/pages]');
    objProducts.getPages(5).then(function(data){
        res.send(data);
    });
});
app.get('/products/:id', function (req, res, next) {
    knex('products').select().where({
        id: req.params.id
    }).then(function(data){
        res.render('listado',{products:data});
    });
});




app.listen(3000, function() {
  console.log('ok');
});