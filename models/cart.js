var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    total: {type: Number, default: 0},
    items: [{
        item: {type: Schema.Types.ObjectId, ref:'Product'},
        quantity: {type: Number, default: 1},
        price: {type: Number, default: 0},
    }]
});

module.exports = mongoose.model('Cart', CartSchema);

//el esquema de el carrito para la base de datos en mongo