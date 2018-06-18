var express = require('express');
var Divisi = require('../models/divisi');
var Auth_mdw = require('../middlewares/auth');

var router = express.Router();
var session_store;

router.get('/', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session;

    Divisi.find({}, function(err, rows){
        console.log(rows);
        res.render('divisi/index', { session_store:session_store, divisi: rows });
    });
});

// CREATE

router.get('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    res.render('divisi/add', { session_store:session_store });
});

router.post('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    req.assert('nama', 'Nama diperlukan').notEmpty();

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_nama = req.sanitize( 'nama' ).escape().trim();
        v_keterangan = req.sanitize( 'keterangan' ).escape().trim();

        Divisi.find({ nama: req.param('nama') }, function (err, row){
            if (row.length == 0)
            {
                var divisi = new Divisi({
                    nama: v_nama,
                    keterangan: v_keterangan,
                });

                divisi.save(function(err) {
                    if (err) 
                    {
                        console.log(err);

                        req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                        res.redirect('/divisi');
                    }
                    else
                    {
                        req.flash('msg_info', 'Divisi berhasil dibuat...');
                        res.redirect('/divisi');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Punten, divisi sudah ada...');
                res.render('divisi/add', { 
                    session_store:session_store,
                    nama: req.param('nama'),
                    keterangan: req.param('keterangan'),
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
        res.render('divisi/add', {
            session_store: session_store, 
            nama: req.param('nama'),
            keterangan: req.param('keterangan'),
        });
    }
});


// EDIT

router.get('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    Divisi.findOne({_id:req.params.id}, function (err, divisi){
        if (divisi)
        {
            console.log(divisi);

            res.render('divisi/edit', { session_store:session_store, divisi: divisi });
        }
        else
        {
            req.flash('msg_error', 'Punten, divisi tidak ditemukan!');
            res.redirect('/divisi');
        }
    });
});

router.put('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    req.assert('nama', 'Nama diperlukan').notEmpty();

    var errors = req.validationErrors();  
    console.log(errors);

    if (!errors)
    {
        v_nama = req.sanitize( 'nama' ).escape().trim();
        v_keterangan = req.sanitize( 'keterangan' ).escape().trim();

        Divisi.findById(req.params.id, function (err, row){
            row.nama = v_nama;
            row.keterangan = v_keterangan;

            row.save(function(err) {
                if (err) 
                {
                    console.log(err);

                    req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                    res.redirect('/divisi');
                }
                else
                {
                    req.flash('msg_info', 'Edit divisi berhasil...');
                    res.redirect('/divisi');
                }
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
        res.render('divisi/edit', {
            _id: req.params.id,
            session_store: session_store, 
            nama: req.param('nama'),
            keterangan: req.param('keterangan'),
        });
    }
});

// DELETE

router.delete('/delete/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    Divisi.findById(req.params.id, function(err, row){
        row.remove(function(err, user){
            if (err) 
            {
                console.log(err);
                req.flash('msg_error', 'Punten, sepertinya divisi yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Hapus divisi berhasil!');
            }
            res.redirect('/divisi');
        });
    });
});

module.exports = router;