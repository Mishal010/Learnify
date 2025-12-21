import { sendEmail } from "../utils/sendEmail.js";
import { contactMailTemplate } from "../utils/emails/contactMail.js";

/**
 * POST /api/contact
 * Body: { name, email, subject, message }
 */
export const sendContactToAdmin = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res
        .status(500)
        .json({ message: "Admin email is not configured on the server" });
    }

    const html = contactMailTemplate({ name, email, subject, message });

    await sendEmail({
      to: adminEmail,
      subject: `Contact Form: ${subject || "New Message"}`,
      html,
      replyTo: email,
    });

    return res
      .status(200)
      .json({ success: true, message: "Message sent to admin" });
  } catch (error) {
    console.error("Error sending contact mail:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to send message" });
  }
};
