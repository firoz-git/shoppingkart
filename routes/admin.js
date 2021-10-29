var express = require("express");
var router = express.Router();

const productHelpers = require("../data-insertion/product-helpers");



/* GET users listing. */
router.get("/", function (req, res, next) {
  
  productHelpers.getAllProduct().then((products)=>{   //using promise (then)
    res.render("Admin/admin-product", { products, admin: true });
  })  
});

router.get("/add-product", function (req, res) {
  //mukalilathe getil '/' avde already admin vilichitund so ivdebakki koduthale work avoo
  res.render("Admin/adding",{admin:true});
});
router.post("/add-product", function (req, res,next) {
  console.log(req.body);
  console.log(req.files.image);
 

  productHelpers.addProduct(req.body,(id)=>{   //using call back
    let image=req.files.image
    console.log(id);
    image.mv('./public/images/'+id+'.jpg',(err)=>{
      if(!err){
        console.log(!err);
        res.render('Admin/adding',{admin:true})
      }else{
        console.log(err);
      }
    })
})

});
module.exports = router;

