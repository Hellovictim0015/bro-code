// File: app/api/auth/send-otp/route.js
import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Debug: check env variables
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("Twilio Token:", process.env.TWILIO_AUTH_TOKEN ? "set" : "missing");
console.log("Twilio From:", process.env.TWILIO_PHONE_NUMBER);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.execute('DELETE FROM otp_verifications WHERE phone = ?', [phone]);
    await db.execute(
      'INSERT INTO otp_verifications (phone, otp, expires_at, verified) VALUES (?, ?, ?, ?)',
      [phone, otp, expiresAt, 0]
    );

    // ✅ Twilio SMS
    const toNumber = `+91${phone}`; // India number
    console.log("Sending OTP:", otp, "to", toNumber);

    const message = await twilioClient.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber,
    });

    console.log("Twilio Message SID:", message.sid);

    return NextResponse.json({ message: 'OTP sent successfully', phone }, { status: 200 });
  } catch (error) {
    console.error('Twilio error:', error.message || error);
    return NextResponse.json({ message: 'Failed to send OTP', error: error.message }, { status: 500 });
  }
}
