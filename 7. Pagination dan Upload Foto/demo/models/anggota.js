var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var anggotaSchema = new Schema({
  nama: { type: String, required: true, unique: true },
  tempat_lahir: String,
  tanggal_lahir: Date,
  email: String,
  telepon: String,
  gender: String,
  keterangan: String,
  propic_path: String,

  alamat: [{alamat: String, types: String}], // multirecord 
  kontak: [{kontak: String, types: String}], // multirecord

},
{
    timestamps: true
});

var Anggota = mongoose.model('Anggota', anggotaSchema);

module.exports = Anggota;