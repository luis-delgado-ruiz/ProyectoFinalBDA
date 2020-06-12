//rutas principales de la pagina
var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');

router.get('/cart', function(req, res, next) {
    Cart
      .findOne({ user: req.user._id })
      .populate('items.item')
      .exec(function(err, foundCart) {
        if (err) return next(err);
        res.render('main/cart', {
          foundCart: foundCart
        });
      });
});

router.get('/', function(req, res){
    res.render('main/home');
});

router.get('/about', function(req,res){
    res.render('main/about');
})

router.get('/users', function(req,res){
    User.find({}, function(err, users){
        res.json(users);
    })
})

router.post('/product/:product_id', function(req,res,next){
    Cart.findOne({user: req.user._id}, function(err,cart){
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        });
        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
        cart.save(function(err){
            if(err) return next(err);
            return res.redirect('/cart');
        });
    });
});

router.get('/products/:id', function(req,res,next){
    Product.find({category:req.params.id}).populate('category').exec(function(err, products){
        if(err) return next(err);
        res.render('main/category',{
            products: products
        });
    });
});

router.get('/product/:id', function(req,res,next){
    Product.findById({_id:req.params.id}, function(err,product){
        if(err) return next(err);
        res.render('main/product',{
            product:product
        });
    });
});


module.exports = router;