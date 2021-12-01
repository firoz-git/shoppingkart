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
router.get('/delete',function(req,res){
  let prodId=req.query.id;
  productHelpers.deleteProduct(prodId).then((response)=>{
    console.log(response);
    res.redirect('/admin')
  })
})
router.get('/edit/:id', (req,res)=>{
  let prodId=req.params.id
  productHelpers.editProduct(prodId).then((result)=>{
    console.log(result);
    res.render('Admin/edit-data', {result , admin:true}) //data send to edit hbs with id

  })
})
router.post('/edit-product/:id',(req,res)=>{ //the req need have id by added through link
  console.log(req.params.id,req.body);
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    let image=req.files.image
    image.mv('./public/images/'+req.params.id+'.jpg') //same  id ulla images vannal server replace cheyyum so copies undavilla
  })
})

module.exports = router;

