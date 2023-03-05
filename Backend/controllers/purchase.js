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
            req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
                return res.status(200).json({order,key_id:rzp.key_id})
            })
            .catch(err=>{
                throw new Error(err)
            })
        })
    } catch (error) {
        console.log(error)
        res.status(403).json({message:'Something went wrong',error:error})
    }
}

const updateTransactionStatus=(req,res)=>{
    try {
        const {payment_id,order_id}=req.body
        Order.findOne({where:{orderid:order_id}}).then((order)=>{
            order.update({paymentid:payment_id,status:'SUCCESSFUL'}).then(()=>{
                req.user.update({ispremiumuser:true}).then(()=>{
                    return res.status(202).json({success:true,message:'Transaction Successfull'})
                
                }).catch((err)=>{
                    throw new Error(err)
                })
            })
        })
        .catch((err)=>{
            throw new Error(err)
        })
    } catch (error) {
        throw error
    }

    // try {
    //     Promise.all().then().catch()
    // } catch (error) {
        
    // }
}

module.exports={
    purchasepremium,
    updateTransactionStatus
}