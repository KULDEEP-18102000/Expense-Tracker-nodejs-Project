const Razorpay=require('razorpay')
const Order=require('../models/orders')

const purchasepremium=async(req,res)=>{
    try {
        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount=3000

        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            const new_order=Order.create({userId:req.user._id,orderid:order.id,status:'PENDING'})
            // const order=req.user.createOrder({orderid:order.id,status:'PENDING'})
            return res.status(200).json({order,key_id:rzp.key_id})
        })
    } catch (error) {
        console.log(error)
        res.status(403).json({message:'Something went wrong',error:error})
    }
}

const updateTransactionStatus=async(req,res)=>{
    try {
        const {payment_id,order_id}=req.body
        const order= await Order.findOne({orderid:order_id})
        order.paymentid=payment_id
        order.status='SUCCESSFUL'
        await order.save()
        // await order.update({paymentid:payment_id,status:'SUCCESSFUL'})
        req.user.ispremiumuser=true
        await req.user.save()
        // await req.user.update({ispremiumuser:true})
        return res.status(202).json({success:true,message:'Transaction Successfull'})
    } catch (error) {
        throw error
    }

}

module.exports={
    purchasepremium,
    updateTransactionStatus
}