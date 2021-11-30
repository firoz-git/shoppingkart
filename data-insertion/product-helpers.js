var db=require('../config/connection')
var collection=require("../config/collections")
const promise=require('promise')
const { response } = require('express')
var objId= require('mongodb').ObjectID

module.exports={
    addProduct:(product,callback)=>{
        db.get().collection('product').insertOne(product,(error,res)=>{
            if(error){
                console.log(error);
            }else{
                db.get().collection('product').findOne(product,(error,res)=>{
                    if(error){
                        console.log(error);
                    }else{
                        callback(res._id)
                    }
                })
                
            }
        }
        )
    },
    getAllProduct:()=>{
        return new promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()//array ayan data get cheyyumbol kittunnath
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objId(prodId)}).then((response)=>{
                resolve(response)
               
            })
        })
    }
}

