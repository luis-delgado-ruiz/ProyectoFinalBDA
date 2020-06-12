var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: { type: String, unique: true, lowercase: true}
});

module.exports = mongoose.model('Category', CategorySchema);

//el esquema de las categorias de los productos para la base de datos en mongo