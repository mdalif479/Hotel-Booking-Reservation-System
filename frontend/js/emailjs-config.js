// Emails are now sent from the backend (backend/services/emailService.js) and
// logged to MongoDB, so nothing needs to be filled in here.
// Set clientFallback:true and fill the keys ONLY if you want the browser to send
// a confirmation as well - this will produce duplicate emails.
window.EMAILJS_CONFIG = { clientFallback: false, publicKey: '', serviceId: '', templateId: '' };
