const express=require('express')
const app=express()

const cors=require('cors')

const BodyParser=require('body-parser')

const sequelize=require('./util/database')

const User=require('./models/user')
const Expense=require('./models/expense')
const Order=require('./models/orders')

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

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize
.sync({})
.then(result=>{
    // console.log(result)
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})