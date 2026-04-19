const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendGroupQREmails(members, eventTitle) {
  for (const member of members) {
    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: member.email,
      subject: `Your QR Pass for ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">You're registered! 🎉</h2>
          <p>Hi ${member.name},</p>
          <p>You have been registered for <strong>${eventTitle}</strong>.</p>
          <p>Your unique QR pass code is:</p>
          <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #1f2937; margin: 16px 0;">
            ${member.qrCode}
          </div>
          <p style="color: #6b7280; font-size: 13px;">
            Present this code at the event entrance for check-in. Do not share it with others.
          </p>
          <p style="color: #6b7280; font-size: 13px;">See you there!</p>
          <p style="color: #6b7280; font-size: 13px;">— The EventHub Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = { sendGroupQREmails };