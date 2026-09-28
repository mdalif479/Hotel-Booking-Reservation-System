const EmailLog = require('../models/EmailLog');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const email = require('../services/emailService');

// GET /api/emails/status  -> is EmailJS configured?
exports.status = (req, res) => res.json({ enabled: email.isEnabled() });

// GET /api/emails  (admin) -> paginated email log from the database
exports.list = async (req, res, next) => {
  try {
    const { status, type, to, limit = 50, page = 1 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (type) q.type = type;
    if (to) q.to = new RegExp(to, 'i');
    const lim = Math.min(+limit || 50, 200);
    const [items, total] = await Promise.all([
      EmailLog.find(q).sort({ createdAt: -1 }).skip((Math.max(1, +page) - 1) * lim).limit(lim)
        .populate('user', 'name email').populate('booking', 'bookingReference'),
      EmailLog.countDocuments(q)
    ]);
    res.json({ total, page: +page, limit: lim, items });
  } catch (e) { next(e); }
};

// GET /api/emails/mine -> the signed-in guest's own email history
exports.mine = async (req, res, next) => {
  try {
    res.json(await EmailLog.find({ $or: [{ user: req.user._id }, { to: req.user.email }] })
      .sort({ createdAt: -1 }).limit(100).populate('booking', 'bookingReference'));
  } catch (e) { next(e); }
};

// POST /api/emails/:id/resend (admin) -> retry a failed/skipped send
exports.resend = async (req, res, next) => {
  try {
    const log = await EmailLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Email log not found' });
    const fresh = await email.send({
      type: log.type, to: log.to, toName: log.toName, subject: log.subject,
      templateParams: log.templateParams, user: log.user, booking: log.booking, payment: log.payment
    });
    if (fresh) { fresh.attempts = (log.attempts || 1) + 1; await fresh.save(); }
    res.json({ message: `Resend ${fresh?.status || 'attempted'}`, log: fresh });
  } catch (e) { next(e); }
};

// POST /api/emails/booking/:bookingId (admin) -> manually email a booking's guest
exports.sendForBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const room = await Room.findById(booking.room);
    const type = req.body.type || 'booking_confirmed';
    const fn = { booking_created: email.sendBookingCreated, booking_confirmed: email.sendBookingConfirmed, booking_cancelled: email.sendBookingCancelled }[type];
    if (!fn) return res.status(400).json({ message: 'Unsupported email type' });
    const log = await fn(booking, room);
    res.json({ message: `Email ${log?.status || 'attempted'}`, log });
  } catch (e) { next(e); }
};
