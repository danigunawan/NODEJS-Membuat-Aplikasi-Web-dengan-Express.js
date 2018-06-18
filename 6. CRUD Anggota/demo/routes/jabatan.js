var express = require('express');
var Jabatan = require('../models/jabatan');
var Auth_mdw = require('../middlewares/auth');

var router = express.Router();
var session_store;

router.get('/', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session;

    Jabatan.find({}, function(err, rows){
        console.log(rows);
        res.render('jabatan/index', { session_store:session_store, jabatan: rows });
    });
});


// CREATE

router.get('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    res.render('jabatan/add', { session_store:session_store });
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

        Jabatan.find({ nama: req.param('nama') }, function (err, row){
            if (row.length == 0)
            {
                var jabatan = new Jabatan({
                    nama: v_nama,
                    keterangan: v_keterangan,
                });

                jabatan.save(function(err) {
                    if (err) 
                    {
                        console.log(err);

                        req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                        res.redirect('/jabatan');
                    }
                    else
                    {
                        req.flash('msg_info', 'Jabatan berhasil dibuat...');
                        res.redirect('/jabatan');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Punten, jabatan sudah ada...');
                res.render('jabatan/add', { 
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
        res.render('jabatan/add', {
            session_store: session_store, 
            nama: req.param('nama'),
            keterangan: req.param('keterangan'),
        });
    }
});

// EDIT
router.get('/edit/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    session_store = req.session;

    Jabatan.findOne({_id:req.params.id}, function (err, row){
        if (row)
        {
            console.log(row);

            res.render('jabatan/edit', { session_store:session_store, jabatan:  row});
        }
        else
        {
            req.flash('msg_error', 'Punten, jabatan tidak ditemukan!');
            res.redirect('/jabatan');
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

        Jabatan.findById(req.params.id, function (err, row){
            row.nama = v_nama;
            row.keterangan = v_keterangan;

            row.save(function(err) {
                if (err) 
                {
                    console.log(err);

                    req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                    res.redirect('/jabatan');
                }
                else
                {
                    req.flash('msg_info', 'Edit jabatan berhasil...');
                    res.redirect('/jabatan');
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
        res.render('jabatan/edit', {
            _id: req.params.id,
            session_store: session_store, 
            nama: req.param('nama'),
            keterangan: req.param('keterangan'),
        });
    }
});

router.delete('/delete/(:id)', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next){
    Jabatan.findById(req.params.id, function(err, row){
        row.remove(function(err, user){
            if (err) 
            {
                console.log(err);
                req.flash('msg_error', 'Punten, sepertinya jabatan yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Hapus jabatan berhasil!');
            }
            res.redirect('/jabatan');
        });
    });
});

module.exports = router;