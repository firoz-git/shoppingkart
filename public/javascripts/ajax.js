function addToCart(prodId){ //add to cart function is in the button and the prodid is the id form this._id 
    $.ajax({
      url:'/add-to-cart/'+prodId,
      method:'get',
      success:(response)=>{
          if(response.status){ 
                let count=$('#cart-count').html() //here the # is used to find out the id. and take the valye inside of that id to store in the count
                count=parseInt(count)+1
                $('#cart-count').html(count) //button nekkumbol dbil count koodiyenkil mathram koottanam allel no change
          } 
        alert("Do you want to add in your cart")
        
      }
    })
}
//this page is connected with the layout and the layout is connected to the whole hbs files
  