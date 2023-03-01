
exports.getresetPassword = async (req, res) => {
    const useremail=req.body.email
    var Sib = require('sib-api-v3-sdk');
    var Client = Sib.ApiClient.instance;
    // # Instantiate the client\
    var apiKey = Client.authentications['api-key'];
    apiKey.apiKey = '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';

    const transEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'jadonkuldeepsingh2@gmail.com'
    }

    const receivers = [
        {
            email: useremail
        },
    ]

    transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Your reset password',
        textContent: 'your reset password has been sent to you'
    })
        .then(console.log)
        .catch(console.log)
}