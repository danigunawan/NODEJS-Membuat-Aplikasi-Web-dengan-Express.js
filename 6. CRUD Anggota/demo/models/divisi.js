var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var divisiSchema = new Schema({
  nama: { type: String, required: true, unique: true },
  keterangan: String,
},
{
    timestamps: true
});

var Divisi = mongoose.model('Divisi', divisiSchema);

module.exports = Divisi;