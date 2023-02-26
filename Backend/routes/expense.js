const express=require('express')
const router=express.Router()

const expenseController=require('../controllers/expense')

// router.get('/',expenseController.GetExpensePage)

router.get('/get-expenses',expenseController.getExpenses)

router.post('/add-expense',expenseController.AddExpense)

router.delete('/delete-expense/:id',expenseController.deleteExpense)

module.exports=router