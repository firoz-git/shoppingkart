var db=require('../config/connection')
var collection=require("../config/collections")
const bcrypt=require('bcrypt')
const { response } = require('express')
var objId= require('mongodb').ObjectID
const { reject } = require('promise')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
                resolve(response)
            })
        })
    },
    doLogin:(loginData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={} //response object akki ithilekkan user and status store avum like object format
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:loginData.email})
            // console.log(user);
            if(user){
                bcrypt.compare(loginData.password,user.password).then((status)=>{
                    if(status){
                        response.user=user //response objectinte inside an user ullath wit status true
                        response.status=true
                        resolve(response) //send the response to dologin function
                    }else{
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed');
                resolve({status:false})
            }
         })
    },
    addCart:(prodId,sessionId)=>{
        return new Promise(async (resolve,reject)=>{
            let usercart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objId(sessionId)})
            
            
            if(usercart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objId(sessionId)},
                {
                    $push:{product:objId(prodId)}
                }).then((response)=>{
                    resolve()
                })
            
            
            }else{
                let cartObj={
                    user:objId(sessionId), //there is session id on the data base to find out which user is and which one need to add 
                    product:[objId(prodId)] //product ids stored in array form
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        }) 
    },
    getCartdata:(sessionId)=>{
        return new Promise(async(resolve,reject)=>{ // cart collectoinile product id s eduth product collectionil poy same id ulla productsine edukkanam eee oru process aggregate vechan cheyyunnath
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objId(sessionId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{prodList:'$product'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}









// module.exports={
//     doSignup:(userData,callback)=>{
//         userData.password=bcrypt.hash(userData.password,10)
//         db.get().collection(collection.USER_COLLECTION).insertOne(userData,(error,res)=>{
//             if(error){
//                 console.log(error);
//             }else{
//                 db.get().collection(collection.USER_COLLECTION).findOne(userData,(error,res)=>{
//                     if(error){
//                         console.log(error);
//                     }else{
//                         callback(res._id)
//                     }
//                 })
                
//             }
//         }
//         )
//     },
// }
