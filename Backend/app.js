const express=require('express')
const app=express()

const cors=require('cors')

const BodyParser=require('body-parser')

const sequelize=require('./util/database')

const userRoutes=require('./routes/user')

app.use(cors())

app.use(BodyParser.json({extended:false}))

app.use('/user',userRoutes)



sequelize
.sync()
.then(result=>{
    // console.log(result)
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})