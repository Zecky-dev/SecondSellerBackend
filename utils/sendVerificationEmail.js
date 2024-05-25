const nodemailer = require('nodemailer')
require('dotenv').config()

// 6 haneli rastgele kod üretir
const generateRandomNumber =  (len) => {
    let randomNumber = ''
    for(let i = 0; i < len; i++) {
        randomNumber += Math.floor(Math.random() * 10)
    }
    return randomNumber
}

// Doğrulama e-postası gönderir ardından oluşturduğu kodu döndürür
const sendVerificationEmail = (to) => {
    const verificationCode = generateRandomNumber(6)
    const verificationHTML = `
        <div>
            <h2>SecondSeller - E-posta Aktivasyon</h2>
            <p>SecondSeller uygulamasına hoşgeldiniz :)<br/>Aktivasyon kodu ${verificationCode} </p>
        </div>
    `

    const {
        EMAIL_SERVICE,
        EMAIL_HOST,
        EMAIL_USER,
        EMAIL_PASS
    } = process.env

    const transporter = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        host: EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    })
    const mailOptions = {
        from: "info.secondseller@gmail.com",
        to,
        subject: "E-posta Aktivasyonu",
        html: verificationHTML
    }

    return new Promise((resolve,reject) => {
        transporter.sendMail(mailOptions,(error,info) => {
            if(error) {
                console.error("Error sending email: ", error)
                reject(error)
            }
            else {
                console.log("Email sent: ", info.response)
                resolve(verificationCode)
            }
        })
    })
}

module.exports = { sendVerificationEmail }



