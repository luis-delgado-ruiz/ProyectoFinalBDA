var Cart = require('../models/cart');

module.exports = function(req,res,next){
    if(req.user) {
        var total = 0;
        Cart.findOne({ user:req.user._id}, function(err,cart){
            if(cart){
                for(var i = 0; i < cart.items.length; i++){
                    total += cart.items[i].quantity;
                }
                res.locals.cart = total;
            } else {
                res.locals.cart = 0;
            }
            next();
        });
    } else {
        next();
    }
}

//este codigo busca si hay un usuario, en el caso de que haya se busca el carrito
//que esta ligado al usuario y recorre el carrito para sacar el total