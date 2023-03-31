const expenseAmount = document.getElementById('amount')
// console.log(expenseAmount)
const expenseCategory = document.getElementById('category')
const expenseDescription = document.getElementById('description')
const ul = document.getElementById('list-items')
const rowperpage = document.getElementById('rowperpage').value
console.log(rowperpage)
localStorage.setItem('rows', rowperpage)

const isPremium = localStorage.getItem('isPremium')
console.log(isPremium)
if (isPremium != undefined) {
    console.log("inside")
    const Premium = document.getElementById('premium')
    const premium_btn = document.getElementById('rzp-button1')
    Premium.removeChild(premium_btn)
    const premium_heading = document.createElement('h3')
    premium_heading.appendChild(document.createTextNode('You are a Premium user now'))
    // console.log(premium_heading)
    Premium.appendChild(premium_heading)

    const leadershio_btn = document.createElement('button')
    leadershio_btn.appendChild(document.createTextNode('show leaderboard'))
    leadershio_btn.setAttribute('id', 'leadership')
    leadershio_btn.setAttribute('class', 'btn')
    Premium.appendChild(leadershio_btn)

    const report_btn = document.createElement('button')
    report_btn.appendChild(document.createTextNode('show Report'))
    report_btn.setAttribute('id', 'report')
    report_btn.setAttribute('class', 'btn')
    Premium.appendChild(report_btn)

    console.log(document.getElementById('leadership'))
    document.getElementById('leadership').onclick = async function () {
        console.log("clicked leadership")
        const Premium = document.getElementById('premium')
        const leadership_heading = document.createElement('h3')
        leadership_heading.appendChild(document.createTextNode('Leadership'))
        Premium.appendChild(leadership_heading)
        const ul = document.createElement('ul')
        ul.setAttribute('id', 'leader-items')
        Premium.appendChild(ul)
        const users = await axios.get('http://localhost:3000/premium/showleaderboard')
        console.log(users)
        for (let i = 0; i < users.data.length; i++) {
            const li = document.createElement('li')
            console.log(users.data[i])
            li.appendChild(document.createTextNode(`${users.data[i].name}  ${users.data[i].Total_cost}`))
            li.setAttribute("id", users.data[i]._id)
            // const delete_btn = `<button onclick="deleteFunction(event)">delete</button>`;
            // li.innerHTML = li.innerHTML + delete_btn
            ul.appendChild(li)
        }
    }

    document.getElementById('report').onclick = async function () {
        window.location.href = '/report.html'
    }

} else {
    document.getElementById('rzp-button1').onclick = async function (e) {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } })
        console.log(response)
        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } })
                alert('You are a Premium user now')
                localStorage.setItem('isPremium', true)
                const Premium = document.getElementById('premium')
                const premium_btn = document.getElementById('rzp-button1')
                Premium.removeChild(premium_btn)
                const premium_heading = document.createElement('h3')
                premium_heading.appendChild(document.createTextNode('You are a Premium user now'))
                console.log(premium_heading)
                Premium.appendChild(premium_heading)
                // document.getElementsByTagName('body').removeChild(document.getElementById('rzp-button1'))

                const leadershio_btn = document.createElement('button')
                leadershio_btn.appendChild(document.createTextNode('show leaderboard'))
                leadershio_btn.setAttribute('id', 'leadership')
                leadershio_btn.setAttribute('class', 'btn')
                Premium.appendChild(leadershio_btn)

                const report_btn = document.createElement('button')
                report_btn.appendChild(document.createTextNode('show Report'))
                report_btn.setAttribute('id', 'report')
                report_btn.setAttribute('class', 'btn')
                Premium.appendChild(report_btn)
            },
        };
        const rzpl = new Razorpay(options)
        rzpl.open()
        e.preventDefault()

        rzpl.on('payment.failed', async function (response) {
            console.log(response)
            alert('something went wrong')
        })
    }


}

document.getElementById('rowperpage').onchange = async function () {
    console.log("changed")
    const rowperpage = document.getElementById('rowperpage').value
    console.log(rowperpage)
    localStorage.setItem('rows', rowperpage)
    const token = localStorage.getItem('token')
    const page = 1;
    my_obj = {
        rowperpage: parseInt(rowperpage)
    }
    try {
        const response = await axios.post(`http://localhost:3000/expense/get-expenses?page=${page}`, my_obj, { headers: { "Authorization": token } })
        console.log(response.data)
        listexpenses(response.data.expenses)
        showPagination(response.data)
    } catch (error) {
        console.log(error)
    }
}


document.getElementById('my-form').addEventListener('submit', onsubmit)

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token')
    const rowperpage = JSON.parse(localStorage.getItem('rows'))
    const page = 1;
    // const rowperpage=document.ge
    my_obj = {
        rowperpage: parseInt(rowperpage)
    }
    try {
        const response = await axios.post(`http://localhost:3000/expense/get-expenses?page=${page}`, my_obj, { headers: { "Authorization": token } })
        console.log(response.data)
        listexpenses(response.data.expenses)
        showPagination(response.data)
    } catch (error) {
        console.log(error)
    }
})




const listexpenses = (expenses) => {
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstChild)
    }
    for (let i = 0; i < expenses.length; i++) {
        const li = document.createElement('li')
        console.log(expenses[i])
        li.appendChild(document.createTextNode(`${expenses[i].amount} ${expenses[i].category} ${expenses[i].description}`))
        li.setAttribute("id", expenses[i]._id)
        const delete_btn = `<button onclick="deleteFunction(event)">delete</button>`;
        li.innerHTML = li.innerHTML + delete_btn
        ul.appendChild(li)
    }
}

async function getExpenses(page) {
    const rowperpage = document.getElementById('rowperpage').value
    my_obj = {
        rowperpage: parseInt(rowperpage)
    }
    try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`http://localhost:3000/expense/get-expenses?page=${page}`, my_obj, { headers: { "Authorization": token } })
        listexpenses(response.data.expenses)
        showPagination(response.data)
    } catch (error) {
        console.log(error)
    }
}

function showPagination({
    currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage
}) {
    const pagination = document.getElementById('pagination')
    while (pagination.hasChildNodes()) {
        pagination.removeChild(pagination.firstChild)
    }
    // pagination.innerHTML = '';
    if (hasPreviousPage) {
        const btn2 = document.createElement('button')
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => getExpenses(previousPage))
        pagination.appendChild(btn2)
    }

    const btn1 = document.createElement('button')
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.addEventListener('click', () => getExpenses(currentPage))
    pagination.appendChild(btn1)

    if (hasNextPage) {
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => getExpenses(nextPage))
        pagination.appendChild(btn3)
    }
}

async function onsubmit() {
    try {
        const expense_obj = {
            amount: expenseAmount.value,
            category: expenseCategory.value,
            description: expenseDescription.value
        }
        const token = localStorage.getItem('token')
        console.log(expense_obj)
        const expense = await axios.post('http://localhost:3000/expense/add-expense', expense_obj, { headers: { "Authorization": token } })
        window.location.href='/expense.html'
        console.log(expense)
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(`${expense.amount} ${expense.category} ${expense.description}`))
        li.setAttribute("id", expense._id)
        const delete_btn = `<button onclick="deleteFunction(event)">delete</button>`;
        li.innerHTML = li.innerHTML + delete_btn
        ul.appendChild(li)
    } catch (error) {
        throw error
    }
}

async function deleteFunction(event) {
    try {
        event.preventDefault()
        const ul_item = event.target.parentNode.parentNode
        const li_item = event.target.parentNode
        ul_item.removeChild(li_item)
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:3000/expense/delete-expense/${event.target.parentNode.id}`, { headers: { "Authorization": token } })
    } catch (error) {
        throw error
    }
}