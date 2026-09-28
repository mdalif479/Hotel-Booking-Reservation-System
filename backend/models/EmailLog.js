const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['welcome', 'booking_created', 'booking_confirmed', 'booking_cancelled', 'payment_receipt'],
    required: true
  },
  to: { type: String, required: true },
  toName: { type: String, default: '' },
  subject: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  templateParams: { type: Object, default: {} },
  status: { type: String, enum: ['sent', 'failed', 'skipped'], default: 'sent' },
  provider: { type: String, default: 'emailjs' },
  providerResponse: { type: String, default: '' },
  error: { type: String, default: '' },
  attempts: { type: Number, default: 1 },
  sentAt: Date
}, { timestamps: true });

emailLogSchema.index({ to: 1, type: 1, createdAt: -1 });
emailLogSchema.index({ booking: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
