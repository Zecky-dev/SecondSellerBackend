const nodemailer = require('nodemailer');
require('dotenv').config();

// Rastgele 6 haneli kod üretir
const generateRandomNumber = (len) => {
    let randomNumber = '';
    for (let i = 0; i < len; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
};

// Şifre sıfırlama e-postası gönderir ve oluşturulan kodu döndürür
const sendResetPasswordEmail = (to) => {
    const resetCode = generateRandomNumber(6);
    
    const resetHTML = `
        <div>
            <h2>SecondSeller - Şifre Sıfırlama</h2>
            <p>Şifre sıfırlama kodunuz: ${resetCode}</p>
        </div>
    `;

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'info.secondseller@gmail.com',
        to,
        subject: 'Şifre Sıfırlama',
        html: resetHTML,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
                reject(error);
            } else {
                console.log('Email sent: ', info.response);
                resolve(resetCode);
            }
        });
    });
};

module.exports = { sendResetPasswordEmail };
