const express=require('express')
const app=express()

const cors=require('cors')

const BodyParser=require('body-parser')

const sequelize=require('./util/database')

const User=require('./models/user')
const Expense=require('./models/expense')

const userRoutes=require('./routes/user')
const expenseRoutes=require('./routes/expense')

app.use(cors())

app.use(BodyParser.json({extended:false}))

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

sequelize
.sync({})
.then(result=>{
    // console.log(result)
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})