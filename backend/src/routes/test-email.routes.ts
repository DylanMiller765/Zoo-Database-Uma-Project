import { Router, Request, Response } from 'express';
import { sendMail } from '../services/mailService';

const router = Router();

/**
 * Test email endpoint - sends a test email to verify SMTP configuration
 * GET /api/test-email
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('[TEST EMAIL] Starting email test...');
    console.log('[TEST EMAIL] Environment variables:');
    console.log('  MAIL_SERVICE:', process.env.MAIL_SERVICE);
    console.log('  BREVO_HOST:', process.env.BREVO_HOST);
    console.log('  BREVO_PORT:', process.env.BREVO_PORT);
    console.log('  BREVO_USER:', process.env.BREVO_USER);
    console.log('  BREVO_KEY:', process.env.BREVO_KEY ? '***SET***' : 'NOT SET');
    console.log('  VERIFIED_SENDER_EMAIL:', process.env.VERIFIED_SENDER_EMAIL);

    const result = await sendMail({
      from: `"Zoo Verse 12 Test" <${process.env.VERIFIED_SENDER_EMAIL}>`,
      to: 'abdullahshittu.work@gmail.com',
      subject: 'Test Email from Zoo Verse 12',
      text: 'This is a test email to verify SMTP configuration is working.',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify your SMTP configuration is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p>If you received this email, your email system is working! 🎉</p>
      `,
    });

    console.log('[TEST EMAIL] Email sent successfully:', result);

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result?.messageId,
      response: result?.response,
    });
  } catch (error: any) {
    console.error('[TEST EMAIL] Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      stack: error.stack,
    });
  }
});

export default router;
