const { response } = require("express");
var express = require("express");
const productHelpers = require("../data-insertion/product-helpers");
const userHelpers = require("../data-insertion/user-helpers");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  
  productHelpers.getAllProduct().then((products)=>{
    
    res.render("User/user", { products});
  })
  
});
router.get('/login',function(req,res){
  res.render("User/user-login")
})

router.get('/signup',function(req,res){
  res.render('User/signup')

})

router.post('/signup', function(req,res){
  userHelpers.doSignup(req.body).then((response)=>{
    
  })
  })


module.exports = router;
