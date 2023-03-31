// const Sequelize=require('sequelize')

// const sequelize=require('../util/database')

// const ForgotPassword=sequelize.define('forgotpasswordrequests',{
//     id:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         primaryKey:true
//     },
//     userId:{
//         type:Sequelize.INTEGER
//     },
//     isactive:Sequelize.BOOLEAN
// })

// module.exports=ForgotPassword




const mongoose=require('mongoose')

const Schema=mongoose.Schema

const forgotPasswordSchema=new Schema({
    isactive:{
        type:Boolean
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model('ForgotPassword',forgotPasswordSchema)