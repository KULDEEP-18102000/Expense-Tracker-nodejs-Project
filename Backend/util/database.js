const Sequelize=require('sequelize');

const sequelize=new Sequelize('expense','root','kuldeepjadon@18',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize