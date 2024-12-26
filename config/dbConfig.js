const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    omit: {
      user: {
        password: true
      },
      
    }
  });
}

prisma = global.prisma;

module.exports = prisma;