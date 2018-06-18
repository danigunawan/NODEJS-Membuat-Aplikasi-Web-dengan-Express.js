var express = require('express');
var Anggota = require('../models/anggota');
var Auth_mdw = require('../middlewares/auth');
var moment = require('moment');

var router = express.Router();
var session_store;

router.get('/', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next) {
    session_store = req.session;

    Anggota.find({}, function(err, rows){
        console.log(rows);

        res.render('anggota/index', { session_store:session_store, anggota: rows });
    });
});

// CREATE

router.get('/add', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    res.render('anggota/add', { session_store:session_store });
});

router.post('/add', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    req.assert('nama', 'Nama diperlukan').notEmpty();
    req.assert('tempat_lahir', 'Tempat lahir diperlukan').notEmpty();
    req.assert('tanggal_lahir', 'Tanggal lahir diperlukan').notEmpty();
    req.assert('email', 'E-Mail diperlukan').isEmail().withMessage('E-mail tidak valid').notEmpty();
    req.assert('telepon', 'Telepon diperlukan').notEmpty();

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_nama = req.sanitize( 'nama' ).escape().trim();
        v_gender = req.sanitize('gender').escape().trim();
        v_keterangan = req.sanitize( 'keterangan' ).escape().trim();
        v_tempat_lahir = req.sanitize('tempat_lahir').escape().trim();
        v_tanggal_lahir = req.sanitize('tanggal_lahir').escape().trim();
        v_email = req.sanitize('email').escape().trim();
        v_telepon = req.sanitize('telepon').escape().trim();

        Anggota.find({ nama: req.param('nama') }, function (err, row){
            if (row.length == 0)
            {
                var anggota = new Anggota({
                    nama: v_nama,
                    keterangan: v_keterangan,
                    gender: v_gender,
                    tempat_lahir: v_tempat_lahir,
                    tanggal_lahir: v_tanggal_lahir,
                    email: v_email,
                    telepon: v_telepon,
                    alamat: [],
                    kontak: [],
                });

                anggota.save(function(err) {
                    if (err) 
                    {
                        console.log(err);

                        req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                        res.redirect('/anggota');
                    }
                    else
                    {
                        req.flash('msg_info', 'Anggota berhasil dibuat...');
                        res.redirect('/anggota');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Punten, anggota yang dimaksud sudah ada...');
                tanggal_lahir = moment(req.param('tanggal_lahir')).format("YYYY-MM-DD");
                res.render('anggota/add', { 
                    session_store:session_store,
                    nama: req.param('nama'),
                    keterangan: req.param('keterangan'),
                    gender: req.param('gender'),
                    tempat_lahir: req.param('tempat_lahir'),
                    tanggal_lahir: tanggal_lahir,
                    email: req.param('email'),
                    telepon: req.param('telepon'),
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

        tanggal_lahir = moment(req.param('tanggal_lahir')).format("YYYY-MM-DD");
        req.flash('msg_error', errors_detail);
        res.render('anggota/add', {
            session_store: session_store, 
            nama: req.param('nama'),
            keterangan: req.param('keterangan'),
            gender: req.param('gender'),
            tempat_lahir: req.param('tempat_lahir'),
            tanggal_lahir: tanggal_lahir,
            email: req.param('email'),
            telepon: req.param('telepon'),
        });
    }
});


router.get('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    Anggota.findOne({_id:req.params.id}, function (err, row){
        if (row)
        {
            console.log(row);

            tanggal_lahir = moment(row.tanggal_lahir).format("YYYY-MM-DD");
            res.render('anggota/edit', { session_store:session_store, anggota: row});
        }
        else
        {
            req.flash('msg_error', 'Punten, anggota tidak ditemukan!');
            res.redirect('/anggota');
        }
    });
});

// EDIT

router.put('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    req.assert('nama', 'Nama diperlukan').notEmpty();
    req.assert('tempat_lahir', 'Tempat lahir diperlukan').notEmpty();
    req.assert('tanggal_lahir', 'Tanggal lahir diperlukan').notEmpty();
    req.assert('email', 'E-Mail diperlukan').isEmail().withMessage('E-mail tidak valid').notEmpty();
    req.assert('telepon', 'Telepon diperlukan').notEmpty();

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_nama = req.sanitize( 'nama' ).escape().trim();
        v_gender = req.sanitize('gender').escape().trim();
        v_keterangan = req.sanitize( 'keterangan' ).escape().trim();
        v_tempat_lahir = req.sanitize('tempat_lahir').escape().trim();
        v_tanggal_lahir = req.sanitize('tanggal_lahir').escape().trim();
        v_email = req.sanitize('email').escape().trim();
        v_telepon = req.sanitize('telepon').escape().trim();

        Anggota.findById(req.params.id, function (err, row){

            row.nama = v_nama;
            row.keterangan = v_keterangan;
            row.gender = v_gender;
            row.tempat_lahir = v_tempat_lahir;
            row.tanggal_lahir = v_tanggal_lahir;
            row.email = v_email;
            row.telepon = v_telepon;

            row.save(function(err) {
                if (err) 
                {
                    console.log(err);

                    req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                    res.redirect('/anggota/edit/'+req.params.id);
                }
                else
                {
                    req.flash('msg_info', 'Edit anggota berhasil...');
                }

                res.redirect('/anggota/'+req.params.id);

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

        console.log(req.params.id);

        tanggal_lahir = moment(req.param('tanggal_lahir')).format("YYYY-MM-DD");
        req.flash('msg_error', errors_detail);
        res.render('anggota/edit', {
            anggota: {},
            session_store: session_store, 
            nama: req.param('nama'),
            keterangan: req.param('keterangan'),
            gender: req.param('gender'),
            tempat_lahir: req.param('tempat_lahir'),
            tanggal_lahir: tanggal_lahir,
            email: req.param('email'),
            telepon: req.param('telepon'),
            anggota_id: req.params.id,
        });
    }
});

// DELETE

router.delete('/delete/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    Anggota.findById(req.params.id, function(err, row){
        row.remove(function(err, user){
            if (err) 
            {
                console.log(err);
                req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Hapus anggota berhasil!');
            }
            res.redirect('/anggota');
        });
    });
});


// KONTAK

router.get('/kontak/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            res.render('anggota/kontak', {session_store: session_store, anggota: row})
        }
    });
});

router.post('/kontak/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            v_kontak = req.sanitize( 'kontak' ).escape().trim();
            v_types = req.sanitize( 'types' ).escape().trim();

            row.kontak.push({kontak: v_kontak, types: v_types});
            row.save();

            res.redirect('/anggota/kontak/'+req.params.id);
        }
    });
});

router.delete('/kontak/(:id)/delete/(:kontak_id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            row.kontak.pull({_id: req.params.kontak_id});
            row.save();

            res.redirect('/anggota/kontak/'+req.params.id);
        }
    });
});

// ALAMAT

router.get('/alamat/(:id)',  Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            res.render('anggota/alamat', {session_store: session_store, anggota: row})
        }
    });
});

router.post('/alamat/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            v_alamat = req.sanitize( 'alamat' ).escape().trim();
            v_types = req.sanitize( 'types' ).escape().trim();

            row.alamat.push({alamat: v_alamat, types: v_types});
            row.save();

            res.redirect('/anggota/alamat/'+req.params.id);
        }
    });
});

router.delete('/alamat/(:id)/delete/(:alamat_id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            row.alamat.pull({_id: req.params.alamat_id});
            row.save();

            res.redirect('/anggota/alamat/'+req.params.id);
        }
    });
});

// DETAIL ANGGOTA
router.get('/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin,  function(req, res, next){
    session_store = req.session;

    Anggota.findById(req.params.id, function(err, row){
        if (err) 
        {
            console.log(err);
            req.flash('msg_error', 'Punten, sepertinya anggota yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            res.redirect('/anggota');
        }
        else
        {
            res.render('anggota/detail', {session_store: session_store, anggota: row, moment: moment})
        }
    });
});

module.exports = router;