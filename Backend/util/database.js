const Sequelize=require('sequelize');

const sequelize=new Sequelize('expense','root',`${process.env.PASSWORD}`,{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize