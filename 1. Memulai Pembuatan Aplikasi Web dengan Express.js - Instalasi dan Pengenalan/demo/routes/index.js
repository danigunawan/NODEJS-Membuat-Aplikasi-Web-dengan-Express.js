var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* DEMO 1 - render template */
router.get('/demo1', function(req, res, next) {
  res.render(
                'demo1', 
                { 
                    message: 'Lorem ipsum sit dolor amet', 
                    user: {name:'suyono', email:'suyono@example.com', website: 'http://www.suyono.com'} 
                }
            );
});

/* DEMO 2 - parameter di URL */
router.get('/demo2/(:id)/(:category)', function (req, res, next){
    res.render('demo2', 
                        { 
                            id: req.params.id, 
                            category: req.params.category, 
                        }
                );
});

/* DEMO 3 - menampilkan respon JSON */
router.get('/demo3', function(req, res, next) {
  res.json({ 
                message: 'Lorem ipsum sit dolor amet', 
                user: {name:'suyono', email:'suyono@example.com', website: 'http://www.suyono.com'} 
        });
});


/* DEMO 4 - menerima request method POST dari form */
router.get('/demo4/', function (req, res, next){
  res.render('demo4');
});

router.post('/demo4/', function (req, res, next){
  res.json(
            {
              message: "request POST is executed",
              data: { 
                username: req.param('username'), 
                email: req.param('email'), 
                website: req.param('website'), 
                phone: req.param('phone'), 
              }
            }
        );
});

/* DEMO 5 - menerima request method PUT PAKAI POSTMAN*/
router.put('/demo5/', function (req, res, next){
  res.json(
            {
              message: "request PUT is executed",
              data: { 
                username: req.param('username'), 
                email: req.param('email'), 
                website: req.param('website'), 
                phone: req.param('phone'), 
              }
            }
        );
});


/* DEMO 6 - menerima request method DELETE PAKAI POSTMAN*/
router.delete('/demo6/', function (req, res, next){
  res.json(
            {
              message: "request DELETE is executed"
            }
        );
});


/* DEMO 7 - redirect url */
router.get('/demo7', function (req, res, next){
    res.redirect('/demo7_result');
});

router.get('/demo7_result', function (req, res, next){
    res.render('demo7');
});

module.exports = router;


