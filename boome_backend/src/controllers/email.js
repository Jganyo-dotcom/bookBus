const sendEmail = require("../utils/sendEmail")

const sendWelcomeEmail = async (req, res) => {
  const { email } = req.body

  try {
    await sendEmail({
      to: email,
      subject: "Welcome 🎉",
      text: "Welcome to our platform!",
      html: "<h1>Welcome!</h1><p>Glad to have you onboard.</p>",
    })

    res.status(200).json({ message: "Email sent" })
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" })
  }
}

module.exports = { sendWelcomeEmail }
