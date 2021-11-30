var db=require('../config/connection')
var collection=require("../config/collections")
const bcrypt=require('bcrypt')
const { response } = require('express')


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
