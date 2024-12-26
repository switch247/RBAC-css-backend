const router = express.Router();
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middlewares/isAuthenticated');

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/me', AuthMiddleware.authenticate, AuthController.me);

router.post('/change-password', isAuthenticated, AuthController.changePassword);

// MFA
router.post('/send-otp', AuthController.sendOtp);

router.post('/otp-login', AuthController.verifyOtp);

module.exports = router;