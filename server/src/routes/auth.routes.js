const router = require('express').Router();
const multer = require('multer');
const { authLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { registerSchema, loginSchema } = require('../validators/auth.validators');
const ctrl = require('../controllers/auth.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.post('/register', authLimiter, validate(registerSchema), ctrl.register);
router.post('/login', authLimiter, validate(loginSchema), ctrl.login);
router.get('/me', requireAuth, ctrl.me);
router.post('/avatar', requireAuth, upload.single('avatar'), ctrl.uploadAvatar);
router.get('/avatar/:userId', ctrl.getAvatar);

module.exports = router;
