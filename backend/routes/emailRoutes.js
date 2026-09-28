const router = require('express').Router();
const c = require('../controllers/emailController');
const { protect, authorize } = require('../middleware/auth');

router.get('/status', c.status);
router.get('/mine', protect, c.mine);
router.get('/', protect, authorize('admin', 'superuser'), c.list);
router.post('/:id/resend', protect, authorize('admin', 'superuser'), c.resend);
router.post('/booking/:bookingId', protect, authorize('admin', 'superuser'), c.sendForBooking);

module.exports = router;
