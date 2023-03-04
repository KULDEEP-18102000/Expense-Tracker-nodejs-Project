const path = require('path')
// const { Transaction } = require('sequelize')
const Expense = require('../models/expense')
const User = require('../models/user')
const sequelize = require('../util/database')
const S3service = require('../services/S3services')
// const { resolve } = require('path')
const UserServices = require('../services/userservices')
const File = require('../models/files')



exports.downloadexpense = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req)
        console.log(expenses)
        const stringifiedexpenses = JSON.stringify(expenses)

        const userId = req.user.id
        const filename = `Expense${userId}/${new Date()}.txt`
        const fileURl = await S3service.uploadToS3(stringifiedexpenses, filename)
        await req.user.createFile({ fileURl: fileURl })
        res.status(201).json({ fileURl, success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ fileURl: '', success: false, err: error })
    }
}

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

// const expense_per_page = 10
// const expense_per_page=localStorage.getItem('rows')

exports.getExpenses = async (req, res) => {
    try {
        const expense_per_page=req.body.rowperpage
        const page = +req.query.page || 1
        let total_expenses = await Expense.count({ where: { userId: req.user.id } })
        // const expenses = await Expense.findAll({ where: { userId: req.user.id } },
        //     {
        //         offset:(page-1)*expense_per_page,
        //         limit:expense_per_page
        //     })
        const expenses=await req.user.getExpenses({
            offset: (page - 1) * expense_per_page,
            limit: expense_per_page
        })
        res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: expense_per_page * page < total_expenses,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(total_expenses / expense_per_page)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
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

}

exports.GetAllFiles = async (req, res) => {
    try {
        const files = await File.findAll({ userId: req.user.id })
        res.status(200).json(files)
    } catch (error) {
        res.status(500).json(error)
    }
}