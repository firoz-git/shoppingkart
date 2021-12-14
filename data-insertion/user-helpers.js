var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("express");
var objId = require("mongodb").ObjectID;
const { reject } = require("promise");
const { CART_COLLECTION } = require("../config/collections");

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((response) => {
          resolve(response);
        });
    });
  },
  doLogin: (loginData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {}; //response object akki ithilekkan user and status store avum like object format
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: loginData.email });
      // console.log(user);
      if (user) {
        bcrypt.compare(loginData.password, user.password).then((status) => {
          if (status) {
            response.user = user; //response objectinte inside an user ullath wit status true
            response.status = true;
            resolve(response); //send the response to dologin function
          } else {
            resolve({ status: false });
          }
        });
      } else {
        console.log("login failed");
        resolve({ status: false });
      }
    });
  },
  addCart: (prodId, sessionId) => {
    let prodObj = {
      item: objId(prodId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let usercart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objId(sessionId) });

      if (usercart) {
        //it is the output taken from db after the findOne action
        let prodExist = usercart.product.findIndex(
          (product) => product.item == prodId
        ); //product id ullathum (product.item) useril ninnulla podid match cheyyum appol same anenkil prodexist result varum athaan find index
        // console.log(prodExist); // matching true ayal 0 varum false anel -1

        if (prodExist != -1) {
          //zero ayaal that means copy vannal
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: objId(sessionId), "product.item": objId(prodId) },
              {
                $inc: { "product.$.quantity": 1 }, // 1is the value of incriment (adding +1)
              }
            );
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: objId(sessionId) },

              {
                $push: { product: prodObj },
              }
            )
            .then(() => {
              resolve();
            });
        }
      } else {
        let cartObj = {
          user: objId(sessionId), //there is session id on the data base to find out which user is and which one need to add
          product: [prodObj], //product ids stored in array form
        };
        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve(response);
          });
      }
    });
  },
  getCartdata: (sessionId) => {
    return new Promise(async (resolve, reject) => {
      // cart collectoinile product id s eduth product collectionil poy same id ulla productsine edukkanam eee oru process aggregate vechan cheyyunnath
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objId(sessionId) },
          },
          {
            $unwind: "$product", //userinte product details ellam separate kanikkum (Eg; 1.obj :ajmalinte iphone 2.obj:ajmalinte pixel 3.obj:ajmalinte oneplus )
          },
          {
            $project: {
              item: "$product.item", //here is the product id
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },{
            $project: {
              item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
          }
          }
        ])
        .toArray();
      resolve(cartItems); //it gives only the product id and quantity
    });
  },
  getcartCount: (sessionId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objId(sessionId) });
      if (cart) {
        count = cart.product.length;
      }
      resolve(count);
    });
  },

  changeProdQuantity: (result) => {

    let count = parseInt(result.count);
    return new Promise((resolve, reject) => {
      if (result.count == -1 && result.quantity == 1) {
        //quantity 1 ennit ount athava operation -1 cheyyan anenkil
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            { _id: objId(result.cart) },
            {
              $pull: { product: { item: objId(result.product) } },
            }
          )
          .then((response) => {
            console.log(response);
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            { _id: objId(result.cart), "product.item": objId(result.product) }, //result cart is the same as the cart id refer to the cart.hbs quantity ajax
            //product objectinte akathan item so using "product.item"
            {
              $inc: { "product.$.quantity": count }, // 1is the value of incriment (adding +1 or -1)
            }
          )
          .then((response) => {
            // console.log(response);
            resolve(true);
          });
      }
    });
  },
  totalPrice:(userId)=>{
    return new Promise(async (resolve, reject) => {
      let total  = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objId(userId) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },{
            $project: {
              item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
          }
          },
          {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity',{$convert:{input:'$product.price',to:'int'}}]}}
            }
          }
        ])
        .toArray();
        console.log(total[0].total); 
      resolve(total[0].total);
    });
    
  }
};

