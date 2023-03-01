const path = require('path')
// const { Transaction } = require('sequelize')
const Expense = require('../models/expense')
const User = require('../models/user')
const sequelize = require('../util/database')

exports.AddExpense = async (req, res) => {
    const t = await sequelize.transaction()

    const amount = req.body.amount
    const category = req.body.category
    const description = req.body.description
    try {
        const expense = await Expense.create({ amount: amount, category: category, description: description, userId: req.user.id }, { transaction: t })
        current_amount = req.user.Total_cost + parseInt(amount)
        await User.update({ Total_cost: current_amount },
            {
                where: { id: req.user.id },
                transaction: t
            })
        res.status(200).json(expense)
        await t.commit()
    } catch (error) {
        // res.status(500)
        await t.rollback()
        console.log(error)
    }

}


exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } })
        res.status(200).json(expenses)
    } catch (error) {
        console.log(error)
    }
}

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        
        const prodId = req.params.id
        const expense = await Expense.findByPk(prodId)
        if (req.user.id === expense.userId) {
            current_amount = req.user.Total_cost - expense.amount
            await User.update({ Total_cost: current_amount },
                {
                    where: { id: req.user.id },
                    transaction: t
                })
            await expense.destroy({ transaction: t })
            await t.commit()
        }
    } catch (error) {
        await t.rollback()
        throw error
    }


    // Expense.findByPk(prodId)
    // .then(expense=>{
    //     if(req.user.id===expense.userId){
    //         return expense.destroy()
    //     }else{
    //         throw err
    //     }
    // })
    // .then(res=>{
    //     console.log("deleted")
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
}