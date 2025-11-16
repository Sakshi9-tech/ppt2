import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  try {
    console.log('Testing Gmail configuration...');
    console.log('Email:', process.env.EMAIL_USER);
    console.log('Password length:', process.env.EMAIL_PASS?.length);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail connection successful');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'EtherXPPT Test Email',
      text: 'This is a test email from EtherXPPT server.',
      html: '<h1>Test Email</h1><p>Your Gmail configuration is working!</p>'
    });

    console.log('✅ Test email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

testEmail();