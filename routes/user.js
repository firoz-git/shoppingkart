const { response } = require("express");
var express = require("express");
const { resolve } = require("promise");
const productHelpers = require("../data-insertion/product-helpers");
const userHelpers = require("../data-insertion/user-helpers");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let user=req.session.user  //user data taken for session related oprations in the homepage
  
  productHelpers.getAllProduct().then((products)=>{
    
    res.render("User/user", { products,user});
  })
  
});
router.get('/login',function(req,res){
  res.render("User/user-login")
})

router.get('/signup',function(req,res){
  res.render('User/signup')

})

router.post('/signup', function(req,res){
  userHelpers.doSignup(req.body).then((response)=>{  //avidunn resolve cheythat ivde kittum ee resposeil
    console.log(response)
    res.render("User/user-login")
  })
  })
router.post('/login',function(req,res){
  // console.log(req.body);
  userHelpers.doLogin(req.body).then((response)=>{
    console.log(response); //here we can see the user and status inside of response in the form of object
    if(response.status){
      
      req.session.loggedIn=true //session used to stay logged in
      req.session.user=response.user //responseil ulla user data store to user of session
      console.log(req.session.user);
      res.redirect('/') //already root to home page set cheythath kond just redirect cheyyam to that location
    }else{
      res.render("User/user-login")
    }
  })
  
})

module.exports = router;
