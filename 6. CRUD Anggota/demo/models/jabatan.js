var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jabatanSchema = new Schema({
  nama: { type: String, required: true, unique: true },
  keterangan: String,
},
{
    timestamps: true
});

var Jabatan = mongoose.model('Jabatan', jabatanSchema);

module.exports = Jabatan;