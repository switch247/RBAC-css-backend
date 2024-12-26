import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class AuthService {
    // constructor(prisma) {
    //     this.prisma = prisma;
    // }
  static validatePassword(password) {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  static async verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }


    // static async register(data) {
    //     // Implement user registration here
    // }
    
    // static async login(data) {
    //     // Implement user login here
    //     const { email, password } = data;
    //     const user = await prisma.user.findUnique({ where: { email } });
      
    //     if (!user) {
    //       return res.status(404).json({ message: 'User not found' });
    //     }
      
    //     if (user.isLocked) {
    //       return res
    //         .status(403)
    //         .json({
    //           message: 'Account is locked due to multiple failed login attempts.',
    //         });
    //     }
      
    //     const isPasswordValid = await AuthService.compare(password, user.password);
      
    //     if (!isPasswordValid) {
    //       await prisma.user.update({
    //         where: { id: user.id },
    //         data: { failedAttempts: user.failedAttempts + 1 },
    //       });
      
    //       if (user.failedAttempts + 1 >= 5) {
    //         await prisma.user.update({
    //           where: { id: user.id },
    //           data: { isLocked: true },
    //         });
    //         return res.status(403).json({ message: 'Account is now locked.' });
    //       }
      
    //       return res.status(400).json({ message: 'Invalid credentials' });
    //     }
      
    //     await prisma.user.update({
    //       where: { id: user.id },
    //       data: { failedAttempts: 0 },
    //     });
      
    //     const token = this.generateToken(user);
      
    //     return token;
    // }


}

export default AuthService;
