/**
 * EmailJS integration (server side).
 *
 * Uses the EmailJS REST API instead of the browser SDK so that emails are
 * triggered by real database events and every attempt is stored in MongoDB
 * (see models/EmailLog.js).
 *
 * Required in .env:
 *   EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY
 *   EMAILJS_TEMPLATE_BOOKING, EMAILJS_TEMPLATE_WELCOME, ...
 *
 * NOTE: in the EmailJS dashboard go to Account -> Security and tick
 * "Allow EmailJS API for non-browser applications", otherwise the API
 * rejects requests coming from Node with a 403 "API calls are disabled".
 */

const EmailLog = require('../models/EmailLog');

const API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

const config = () => ({
  serviceId: process.env.EMAILJS_SERVICE_ID || '',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  privateKey: process.env.EMAILJS_PRIVATE_KEY || '',
  from: process.env.EMAILJS_FROM_NAME || 'Amour Hotel',
  templates: {
    welcome: process.env.EMAILJS_TEMPLATE_WELCOME || '',
    booking_created: process.env.EMAILJS_TEMPLATE_BOOKING || '',
    booking_confirmed: process.env.EMAILJS_TEMPLATE_BOOKING || '',
    booking_cancelled: process.env.EMAILJS_TEMPLATE_CANCELLED || process.env.EMAILJS_TEMPLATE_BOOKING || '',
    payment_receipt: process.env.EMAILJS_TEMPLATE_PAYMENT || process.env.EMAILJS_TEMPLATE_BOOKING || ''
  }
});

const isEnabled = () => {
  const c = config();
  return Boolean(c.serviceId && c.publicKey && c.privateKey);
};

const money = n => `$${Number(n || 0).toFixed(2)}`;
const day = d => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

/**
 * Low-level send. Always resolves - email problems must never break a booking.
 * Writes one EmailLog document per attempt.
 */
async function send({ type, to, toName, subject, templateParams = {}, user, booking, payment }) {
  const c = config();
  const log = {
    type, to, toName: toName || '', subject: subject || '',
    user, booking, payment, templateParams, provider: 'emailjs'
  };

  if (!isEnabled() || !c.templates[type]) {
    log.status = 'skipped';
    log.error = !isEnabled()
      ? 'EmailJS credentials missing in .env'
      : `No template id configured for "${type}"`;
    return safeLog(log);
  }
  if (!to) {
    log.status = 'skipped';
    log.error = 'No recipient address';
    return safeLog(log);
  }

  const payload = {
    service_id: c.serviceId,
    template_id: c.templates[type],
    user_id: c.publicKey,
    accessToken: c.privateKey,
    template_params: {
      to_email: to,
      to_name: toName || '',
      from_name: c.from,
      subject: subject || '',
      reply_to: process.env.EMAILJS_REPLY_TO || to,
      ...templateParams
    }
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`EmailJS ${res.status}: ${text || res.statusText}`);
    log.status = 'sent';
    log.sentAt = new Date();
    log.providerResponse = text.slice(0, 500);
  } catch (err) {
    log.status = 'failed';
    log.error = String(err.message).slice(0, 500);
    console.warn(`[emailjs] ${type} -> ${to} failed:`, log.error);
  }
  return safeLog(log);
}

async function safeLog(doc) {
  try {
    return await EmailLog.create(doc);
  } catch (e) {
    console.warn('[emailjs] could not write EmailLog:', e.message);
    return null;
  }
}

/* ---------- event helpers: called from the controllers ---------- */

const sendWelcome = user => send({
  type: 'welcome',
  to: user.email,
  toName: user.name,
  subject: 'Welcome to Amour Hotel',
  user: user._id,
  templateParams: { user_name: user.name, login_url: `${process.env.FRONTEND_URL || ''}/login.html` }
});

const bookingParams = (booking, room) => ({
  user_name: booking.fullName,
  booking_reference: booking.bookingReference,
  room_name: room?.name || '',
  room_number: room?.roomNumber || '',
  room_type: room?.roomType || '',
  check_in: day(booking.checkIn),
  check_out: day(booking.checkOut),
  nights: booking.nights,
  guests: booking.guests,
  total: money(booking.totalAmount),
  status: booking.status,
  payment_status: booking.paymentStatus,
  special_request: booking.specialRequest || '-'
});

const sendBookingCreated = (booking, room) => send({
  type: 'booking_created',
  to: booking.email,
  toName: booking.fullName,
  subject: `Booking ${booking.bookingReference} received`,
  user: booking.user,
  booking: booking._id,
  templateParams: bookingParams(booking, room)
});

const sendBookingConfirmed = (booking, room) => send({
  type: 'booking_confirmed',
  to: booking.email,
  toName: booking.fullName,
  subject: `Booking ${booking.bookingReference} confirmed`,
  user: booking.user,
  booking: booking._id,
  templateParams: bookingParams(booking, room)
});

const sendBookingCancelled = (booking, room) => send({
  type: 'booking_cancelled',
  to: booking.email,
  toName: booking.fullName,
  subject: `Booking ${booking.bookingReference} cancelled`,
  user: booking.user,
  booking: booking._id,
  templateParams: {
    ...bookingParams(booking, room),
    cancellation_reason: booking.cancellationReason || 'Cancelled by user',
    cancelled_at: day(booking.cancelledAt)
  }
});

const sendPaymentReceipt = (payment, booking, room) => send({
  type: 'payment_receipt',
  to: booking.email,
  toName: booking.fullName,
  subject: `Payment received for ${booking.bookingReference}`,
  user: booking.user,
  booking: booking._id,
  payment: payment._id,
  templateParams: {
    ...bookingParams(booking, room),
    transaction_id: payment.transactionId,
    amount_paid: money(payment.amount),
    payment_method: payment.method,
    paid_on: day(payment.createdAt || new Date())
  }
});

module.exports = {
  isEnabled, send, sendWelcome,
  sendBookingCreated, sendBookingConfirmed, sendBookingCancelled, sendPaymentReceipt
};
