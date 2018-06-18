var express = require('express');
var crypto = require('crypto');
var User = require('../models/user');
var Auth_mdw = require('../middlewares/auth');

var router = express.Router();
var secret = 'codepolitan';
var session_store;

var default_password = crypto.createHmac('sha256', secret)
                   .update('default')
                   .digest('hex');

router.get('/', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session;

    User.find({}, function(err, user){
        console.log(user);
        res.render('users/index', { session_store:session_store, users: user });
    }).select('username email firstname lastname admin createdAt updatedAt');
});

// CREATE
router.get('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session;

    res.render('users/add', { session_store:session_store });
});

router.post('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function (req, res, next){
    session_store = req.session;

    req.assert('username', 'Nama diperlukan').isAlpha().withMessage('Username harus terdiri dari angka dan huruf').notEmpty();
    req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
    req.assert('firstname', 'Nama depan harus terdiri dari angka dan huruf').isAlpha();
    req.assert('lastname', 'Nama belakang harus terdiri dari angka dan huruf').isAlpha();

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_username = req.sanitize( 'username' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_firstname = req.sanitize( 'firstname' ).escape().trim();
        v_lastname = req.sanitize( 'lastname' ).escape().trim();
        v_admin = req.sanitize( 'admin' ).escape().trim();

        User.find({username:req.param('username')}, function (err, user){
            if (user.length == 0)
            {
                var admin = new User({
                    username: v_username,
                    email: v_email,
                    password: default_password,
                    firstname: v_firstname,
                    lastname: v_lastname,
                    admin: v_admin,
                });

                admin.save(function(err) {
                    if (err) 
                    {
                        console.log(err);

                        req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                        res.redirect('/users');
                    }
                    else
                    {
                        req.flash('msg_info', 'User berhasil dibuat...');
                        res.redirect('/users');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Punten, username sudah digunakan...');
                res.render('users/add', { 
                    session_store:session_store,
                    username: req.param('username'),
                    email: req.param('email'),
                    firstname: req.param('firstname'),
                    lastname: req.param('lastname'),
                });
            }
        });
    }
    else
    {   
        // menampilkan pesan error
        errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'</li>';
        }

        errors_detail += "</ul>";

        req.flash('msg_error', errors_detail);
        res.render('users/add', {
            session_store: session_store, 
            username: req.param('username'),
            email: req.param('email'),
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
        });
    }

});

// UPDATE
router.get('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session;

    User.findOne({_id:req.params.id}, function (err, user){
        if (user)
        {
            console.log(user);

            res.render('users/edit', { session_store:session_store, user: user });
        }
        else
        {
            req.flash('msg_error', 'Punten, user tidak ditemukan!');
            res.redirect('/users');
        }
    });
});

router.put('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function (req, res, next){
    session_store = req.session;

    req.assert('username', 'Nama diperlukan').isAlpha().withMessage('Username harus terdiri dari angka dan huruf').notEmpty();
    req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
    req.assert('firstname', 'Nama depan harus terdiri dari angka dan huruf').isAlpha();
    req.assert('lastname', 'Nama belakang harus terdiri dari angka dan huruf').isAlpha();

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_username = req.sanitize( 'username' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_firstname = req.sanitize( 'firstname' ).escape().trim();
        v_lastname = req.sanitize( 'lastname' ).escape().trim();
        v_admin = req.sanitize( 'admin' ).escape().trim();


        User.findById(req.params.id, function(err, user){
            user.username = req.param('username');
            user.email = req.param('email');
            user.firstname = req.param('firstname');
            user.lastname = req.param('lastname');
            user.admin = req.param('admin');

            user.save(function(err, user){
                if (err) 
                {
                    req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                }
                else
                {
                    req.flash('msg_info', 'Edit user berhasil!');
                }

                res.redirect('/users/edit/'+req.params.id);

            });
        });
    }
    else
    {   
        // menampilkan pesan error
        errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'</li>';
        }

        errors_detail += "</ul>";

        req.flash('msg_error', errors_detail);
        res.render('users/edit', {
            _id: req.params.id, 
            session_store: session_store, 
            username: req.param('username'),
            email: req.param('email'),
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
        });
    }


});

// DELETE
router.delete('/delete/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function (req, res, next){
    User.findById(req.params.id, function(err, user){
        user.remove(function(err, user){
            if (err) 
            {
                req.flash('msg_error', 'Punten, sepertinya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Hapus user berhasil!');
            }
            res.redirect('/users');
        });
    });
});

module.exports = router;