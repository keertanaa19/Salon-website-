const nodemailer = require('nodemailer');

const sendInvitationEmail = async (to, token, branchName) => {
    try {
        // Create a transporter using your email service logic
        // It relies on EMAIL_USER and EMAIL_PASS set up in the .env.
        // For Gmail, use an App Password.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this or make it configurable
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const setupLink = `http://localhost:5173/register?inviteToken=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: 'Invitation to Join as Branch Admin',
            html: `
                <h3>You have been invited to manage the ${branchName} branch</h3>
                <p>Please click the link below to set up your account and password:</p>
                <a href="${setupLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Set up Admin Account</a>
                <br>
                <p>Or copy and paste this link into your browser: <br>${setupLink}</p>
                <p><small>This link will expire in 24 hours.</small></p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Failed to send invitation email');
    }
};

module.exports = { sendInvitationEmail };
