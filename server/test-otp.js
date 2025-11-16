import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testOTP = async () => {
  console.log('🧪 Testing OTP Email Service...\n');
  
  // Check environment variables
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured in .env file');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Test connection
  try {
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return;
  }

  // Generate test OTP
  const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const testEmail = process.env.EMAIL_USER; // Send to self for testing

  console.log(`📨 Sending test OTP to: ${testEmail}`);
  console.log(`🔢 Test OTP: ${testOTP}\n`);

  // Create test email
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: testEmail,
    subject: 'EtherXPPT - Test OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">🧪 Test OTP Email</h2>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; text-align: center;">
          <h3>Your Test OTP:</h3>
          <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${testOTP}</div>
        </div>
        <p>This is a test email to verify OTP functionality.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `
  };

  // Send email
  try {
    const result = await transporter.sendMail(emailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox for the test OTP email');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
};

testOTP();