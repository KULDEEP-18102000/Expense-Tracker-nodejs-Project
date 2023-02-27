const path=require('path')
const Expense=require('../models/expense')

exports.AddExpense=async(req,res)=>{
    const amount=req.body.amount
    const category=req.body.category
    const description=req.body.description
    try {
        const expense=await Expense.create({amount:amount,category:category,description:description,userId:req.user.id})
        res.status(200).json(expense)
    } catch (error) {
        // res.status(500)
        console.log(error)
    }
    
}

// exports.GetExpensePage=(req,res)=>{
//     // res.render(path.join(__dirname,'../../Frontend/expense'))
//     res.sendFile(path.join(__dirname,'../../Frontend/expense.html'))
// }

exports.getExpenses=async(req,res)=>{
    try {
        const expenses=await Expense.findAll({where:{userId:req.user.id}})
        res.status(200).json(expenses)
    } catch (error) {
        console.log(error)
    }
}

exports.deleteExpense=async(req,res)=>{
    const prodId=req.params.id
    Expense.findByPk(prodId)
    .then(expense=>{
        if(req.user.id===expense.userId){
            return expense.destroy()
        }else{
            throw err
        }
    })
    .then(res=>{
        console.log("deleted")
    })
    .catch(err=>{
        console.log(err)
    })
}