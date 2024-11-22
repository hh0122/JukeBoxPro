const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      // add register and login methods
      async register(email, password) {
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
          data: {email, password: hashedPassword}
        });
        return user;
      },
      async login(email, password){
        const user = await prisma.user.findUniqueOrThrow({
          where: {email},
        });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Invalid password");
        return user;
      }
    },
  },
});

module.exports = prisma;