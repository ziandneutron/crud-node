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

const Sekolah = mongoose.model('info_sekolah', {
    nama: String,
    alamat: String,
    kepala: String
});

router.get('/', function (req, res, next) {
    Sekolah.find((err, dataSekolah) => {
        console.log(dataSekolah);
        let infoSekolah = {
            id: '',
            nama: '',
            alamat: '',
            kepala: ''
        };

        if (dataSekolah.length > 0) {
            infoSekolah = dataSekolah[0];
        }
        let data = {
            layout: 'admin',
            title: 'Pengaturan',
            sekolah: infoSekolah
        };
        res.render('pengaturan', data);
    });
});

router.post('/', function (req, res, next) {
    let dataSekolah = req.body;
    if (dataSekolah.id) {
        Sekolah.findById(dataSekolah.id, function (err, resData) {
            if (!resData) {
                res.status(404).send("data tidak ditemukan!");
            } else {
                resData.nama = dataSekolah.nama;
                resData.alamat = dataSekolah.alamat;
                resData.kepala = dataSekolah.kepala;
                resData.save().then(resData => {
                    res.redirect('/admin/pengaturan');
                })
            }
        })
    } else {
        let infoSekolah = new Sekolah(dataSekolah);
        infoSekolah.save().then(resData => {
            res.redirect('/admin/pengaturan');
        }).catch(err => {
            res.status(400).send('Simpan pengaturan gagal!');
        });
    }
});

module.exports = router;