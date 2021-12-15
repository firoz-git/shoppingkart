const { response } = require("express");
var express = require("express");
const { helpers } = require("handlebars");
const { resolve } = require("promise");
const productHelpers = require("../data-insertion/product-helpers");
const userHelpers = require("../data-insertion/user-helpers");
var router = express.Router();
const verifylogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login"); //it helps to reduve checking each route operations by just call this verifylogin
  }
};
/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user; //user data taken for session related oprations in the homepage
  let cartCount = null;
  if (user) {
    //only take the count when session is present
    cartCount = await userHelpers.getcartCount(req.session.user._id); //herer poassing the session id and result sores in cartcount
    console.log(cartCount);
  }
  productHelpers.getAllProduct().then((products) => {
    res.render("User/user", { products, user, cartCount });
  });
});
router.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("User/user-login", { loginErr: req.session.loginErr });
    req.session.loginErr = false; //false illenki refresh akkumbolum eror msg kanum
  }
});

router.get("/signup", function (req, res) {
  res.render("User/signup");
});

router.post("/signup", function (req, res) {
  userHelpers.doSignup(req.body).then((response) => {
    //avidunn resolve cheythat ivde kittum ee resposeil
    console.log(response);
    res.render("User/user-login");
  });
});
router.post("/login", function (req, res) {
  userHelpers.doLogin(req.body).then((response) => {
    console.log(response); //here we can see the user and status inside of response in the form of object
    if (response.status) {
      req.session.loggedIn = true; //session used to stay logged in
      req.session.user = response.user; //responseil ulla user data store to user of session
      console.log(req.session.user);
      res.redirect("/"); //already root to home page set cheythath kond just redirect cheyyam to that location
    } else {
      //password or username failed elae will invoke
      req.session.loginErr = "Incorrect Email or Password"; //or ivde true koduth if of hbs il check cheyth true vine . ennit avde <p> yil msg kodukkam
      res.redirect("/login");
    }
  });
});
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});
router.get("/cart", verifylogin, async (req, res) => {
  let products = await userHelpers.getCartdata(req.session.user._id);
  let amount=0
  for(let i=0;i<products.length;i++){
  let total=(products[i].product.price*products[i].quantity)
    amount=amount+total;
  }
  res.render("User/cart", { products,amount, user: req.session.user });
});

router.get("/add-to-cart/:id", (req, res) => {     //checking for ajax working
  
  userHelpers.addCart(req.params.id, req.session.user._id).then(() => { //after using ajax there is no need to redirect beaause ajax help to restart only the portion not the whole page    
                                                                      
    res.json({ status: true });                                         // it helps the if checking of ajax js
  });
});

router.post("/change-Prod-Quantity", function (req, res, next) {
  userHelpers.changeProdQuantity(req.body).then((result) => {

    res.json(result);
  });
});
router.get("/place-order",verifylogin, async(req, res) => {
  let total=await userHelpers.totalPrice(req.session.user._id)
  // console.log(total);

  res.render('User/place-order',{total,user:req.session.user})
 });
router.post('/check',verifylogin,(req,res)=>{
  console.log(req.body);
})
module.exports = router;
