const ForgotPassword = require('../models/forgotpasswordrequests')
const User = require('../models/user')
// import { v4 as uuidv4 } from 'uuid';
const uuidv4 = require('uuid').v4
const bcrypt = require('bcryptjs')


exports.forgotPassword = async (req, res) => {
    try {
        // console.log(process.env.SIB_API_KEY)
        // console.log(process.env.SIB_SENDER)
        const useremail = req.body.email
        console.log(useremail)
        const user = await User.findOne({ email: useremail } )
        // console.log(user.dataValues)
        const forgotpassword = await ForgotPassword.create({ id: uuidv4(), userId: user._id, isactive: true })
        console.log(forgotpassword)

        var Sib = require('sib-api-v3-sdk');
        var Client = Sib.ApiClient.instance;
        // # Instantiate the client\
        var apiKey = Client.authentications['api-key'];

        apiKey.apiKey = process.env.SIB_API_KEY;

        const transEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: process.env.SIB_SENDER
        }

        const receivers = [
            {
                email: useremail
            },
        ]

        await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Your reset password',
            htmlContent: `your reset password has been sent to you <a href="http://localhost:3000/password/resetpassword/${forgotpassword.id}">Reset Password</a> `
        })
    } catch (error) {
        console.log(error)
    }

}

exports.resetpassword = async (req, res) => {
    try {
        const id = req.params.id
        const forgotRequest = await ForgotPassword.findOne({ where: { id: id } })
        if (forgotRequest) {
            if (forgotRequest.isactive == true) {
                await forgotRequest.update({ isactive: false })
                console.log("suceesfull active")
                res.status(200).send(`
        <html>
            <script>
                                            
            </script>
            <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
            </form>
            </html>
        `)
                res.end()
            }
        }
    } catch (error) {
        console.log(error)
    }
}

exports.updatepasword = async (req, res) => {
    try {
        const id = req.params.id
        const new_password = req.query.newpassword
        const forgotrequest = await ForgotPassword.findOne({ id: id })
        const userId = forgotrequest.userId
        const user = await User.findOne({ id: userId })
        if (user) {
            bcrypt.hash(new_password, 10, async(error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    user.password=result
                    await user.save()
                    // await user.update({ password: result })
                    res.status(200).json({ message: 'Successfully updated new user' })
                }
            })
        } else {
            res.status(404).json({ error: 'No user Exists', success: false })
        }
    } catch (error) {
        console.log(error)
    }
}