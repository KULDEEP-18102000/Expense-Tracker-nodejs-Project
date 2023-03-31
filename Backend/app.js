const express=require('express')
const app=express()
const fs = require('fs');
const path=require('path')

const dotenv = require('dotenv');
dotenv.config();

const cors=require('cors')

const BodyParser=require('body-parser')

const mongoose=require('mongoose')

// const sequelize=require('./util/database')


const User=require('./models/user')
const Expense=require('./models/expense')
const Order=require('./models/orders')
const ForgotPassword=require('./models/forgotpasswordrequests')
const File=require('./models/files')

  

const userRoutes=require('./routes/user')
const expenseRoutes=require('./routes/expense')
const purchaseRoutes=require('./routes/purchase')
const premiumRoutes=require('./routes/premium')
const passwordRoutes=require('./routes/password')

app.use(cors())

app.use(BodyParser.json({extended:false}))

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumRoutes)
app.use('/password',passwordRoutes)

app.use((req,res)=>{
  console.log(req.url.split("?")[0])
  res.sendFile(path.join(__dirname,`public/${req.url.split("?")[0]}`))
})

// User.hasMany(Expense)
// Expense.belongsTo(User)

// User.hasMany(Order)
// Order.belongsTo(User)

// User.hasMany(ForgotPassword)
// ForgotPassword.belongsTo(User)

// User.hasMany(File)
// File.belongsTo(User)

// console.log(process.env.PASSWORD)

// sequelize
// .sync({})
// .then(result=>{
//     // console.log(result)
//     app.listen(3000)
// })
// .catch(err=>{
//     console.log(err)
// })

mongoose.connect('mongodb+srv://kuldeepjadon:kuldeepexpensetracker@cluster0.gcqi3a6.mongodb.net/?retryWrites=true&w=majority')
.then(result=>{
  console.log("connected")
  app.listen(3000)
})
.catch(err=>{
  console.log(err)
})