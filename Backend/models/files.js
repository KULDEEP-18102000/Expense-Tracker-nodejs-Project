// const Sequelize=require('sequelize')
// const sequelize=require('../util/database')

// const File=sequelize.define('files',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     fileURl:{
//         type:Sequelize.STRING
//     }
// })

// module.exports=File




const mongoose=require('mongoose')

const Schema=mongoose.Schema

const fileSchema= new Schema({
    fileURl:{
        type:String
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model('File',fileSchema)