var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sekolah', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
});

const Kelas = mongoose.model('kelas', {
    kode: String,
    nama: String
});

router.get('/', function (req, res, next) {
    Kelas.find((err, resData) => {
        let data = {
            layout: 'admin',
            title: 'Daftar Kelas',
            kelas: resData
        };
        res.render('kelas/list', data);
    });
});

router.get('/edit/:id', function (req, res, next) {
    Kelas.findById(req.params.id, (err, resData) => {
        let data = {
            layout: 'admin',
            title: 'Daftar Kelas',
            kelas: resData
        };
        res.render('kelas/edit', data);
    });
});

router.post('/:id/update', function (req, res, next) {
    let dataKelas = req.body;
    Kelas.findById(req.params.id, function (err, resData) {
        if (!resData) {
            res.status(404).send("data tidak ditemukan!");
        } else {
            resData.kode = dataKelas.kode;
            resData.nama = dataKelas.nama;
            
            resData.save().then(resData => {
                res.redirect('/admin/kelas');
            })
        }
    });
});

router.get('/:id/delete', function (req, res, next) {
    Kelas.findById(req.params.id, function (err, resData) {
        if (!resData) {
            res.status(404).send("data tidak ditemukan!");
        } else {            
            resData.delete().then(resData => {
                res.redirect('/admin/kelas');
            })
        }
    });
});

router.get('/add', function (req, res, next) {

    let data = {
        layout: 'admin',
        title: 'Tambah Kelas',
        content: 'Halaman Kelas'
    };
    res.render('kelas/add', data);
});

router.post('/add', function (req, res, next) {
    let dataKelas = req.body;
    let kelas = new Kelas(dataKelas);
    kelas.save().then(resData => {
        res.redirect('/admin/kelas');
    }).catch(err => {
        res.status(400).send('Simpan kelas gagal!');
    });
});

module.exports = router;