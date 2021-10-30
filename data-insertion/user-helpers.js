var db=require('../config/connection')
var collection=require("../config/collections")
const bcrypt=require('bcrypt')
const { response } = require('express')


module.exports={
    doSignup:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
                
            })
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
