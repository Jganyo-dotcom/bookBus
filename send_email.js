const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject,
      text,
      html,
    }

    await sgMail.send(msg)
    console.log("Email sent successfully")
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error)
    throw error
  }
}

module.exports = sendEmail
