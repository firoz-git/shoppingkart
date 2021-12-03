const { response } = require("express");
var express = require("express");
const { resolve } = require("promise");
const productHelpers = require("../data-insertion/product-helpers");
const userHelpers = require("../data-insertion/user-helpers");
var router = express.Router();
const verifylogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login') //it helps to reduve checking each route operations by just call this verifylogin
  }
}
/* GET home page. */
router.get("/", function (req, res, next) {
  let user=req.session.user  //user data taken for session related oprations in the homepage
  
  productHelpers.getAllProduct().then((products)=>{
    
    res.render("User/user", { products,user});
  })
  
});
router.get('/login',function(req,res){
  if(req.session.loggedIn){
    res.redirect('/')
  }else{

    res.render("User/user-login", {"loginErr":req.session.loginErr})
    req.session.loginErr=false  //false illenki refresh akkumbolum eror msg kanum
  }
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
  
  userHelpers.doLogin(req.body).then((response)=>{
    console.log(response); //here we can see the user and status inside of response in the form of object
    if(response.status){
      
      req.session.loggedIn=true //session used to stay logged in
      req.session.user=response.user //responseil ulla user data store to user of session
      console.log(req.session.user);
      res.redirect('/') //already root to home page set cheythath kond just redirect cheyyam to that location
    }else{  //password or username failed elae will invoke
      req.session.loginErr="Incorrect Email or Password" //or ivde true koduth if of hbs il check cheyth true vine . ennit avde <p> yil msg kodukkam
      res.redirect('/login')
    }
  })
  
})
router.get('/logout', function(req,res){
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifylogin,(req,res)=>{
  res.render("User/cart")
})

router.get('/add-to-cart/:id',verifylogin,function(req,res){
  // console.log(req.params.id) //productid same as in db
  console.log(req.session.user._id); //session created id
  userHelpers.addCart(req.params.id,req.session.user._id).then((resolve)=>{
    // console.log(resolve);
    res.redirect('/')
  })
})


module.exports = router;
