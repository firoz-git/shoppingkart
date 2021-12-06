
  
function addToCart(proId) {
  $.ajax({
       url: '/add-to-cart/' + proId,
       method: 'get',
       success: (response) => {
           if (response.status) {
               let count = $('#cart-count').html()
               count = parseInt(count) + 1
               $("#cart-count").html(count);
               
               //$(".addtocart-button").html("Added"); 
           }
           
       }
   })
   
}

//this page is connected with the layout and the layout is connected to the whole hbs files

function changeQuantity(cartId, prodId, count) {
  let quantity = parseInt(document.getElementById(prodId).innerHTML); //this.quantity taken by document.getelementbyid ivde id ennath pordid aan koduthath so aaa id ulla tag inte inner html value edukkum
  count = parseInt(count);
  $.ajax({
    url: "/change-Prod-Quantity", //link
    data: {
      cart: cartId, //post sending data //cartid and userid are unique one user get one cart id another user get another cart id so we can verify either cart or user id
      product: prodId,
      count: count,
      quantity: quantity, //this.quantity
    },
    method: "post",
    success: (response) => {
      if (response.removeProduct) {
        alert("are you really want to remove this product");
        location.reload();
      } else {
        document.getElementById(prodId).innerHTML = quantity + count;
      }
    },
  });
}
