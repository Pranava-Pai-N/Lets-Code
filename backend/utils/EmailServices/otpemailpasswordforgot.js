import sendEmail from "./sendEmail.js";

const sendOtpEmail = async (toemail, name, otp) => {
    const subject = "Password Reset OTP - Let's Code";

    const body = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
            .content { padding: 30px 20px; text-align: center; }
            .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; margin: 20px 0; padding: 10px; background-color: #f3f4f6; border-radius: 5px; display: inline-block; }
            .footer { font-size: 12px; color: #6b7280; text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; }
            .btn { background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="color: #1f2937;">Password Reset</h2>
            </div>
            <div class="content">
                <p>Hello <strong>${name}</strong>,</p>
                <p>We received a request to reset your password. Use the code below to proceed. This code is valid for 10 minutes.</p>
                <div class="otp-code">${otp}</div>
                <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Let's Code. All rights reserved.</p>
                <p>Security Tip: Never share your OTP with anyone.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return await sendEmail(toemail,subject,body)
}

export default sendOtpEmail;