import sendEmail from "./sendEmail.js";

const sendVerifyEmail = async (toEmail, name , token) => {
    const subject = `Hello ${name} ! Welcome to Let's Code .Verify Your Account now .`;

    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    const currentYear = new Date().getFullYear();

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin: 0;">Confirm Your Email</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <p style="color: #525f7f; font-size: 16px; line-height: 24px; margin: 0;">
                Welcome! Please click the button below to verify your email address and get full access to your account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" bgcolor="#007bff" style="border-radius: 6px;">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 14px 30px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px; background-color: #fcfcfc; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #007bff; font-size: 12px; margin: 0; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #007bff; text-decoration: none;">${verificationUrl}</a>
              </p>
            </td>
          </tr>
        </table>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td style="padding: 20px; text-align: center; color: #999999; font-size: 12px;">
              &copy; ${currentYear} Let's Code. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    return await sendEmail(toEmail, subject, emailBody);
};

export default sendVerifyEmail;