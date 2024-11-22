const express = require("express")
const bcrypt = require("bcrypt"); 
const router = express.Router();

  //Import jwt and JWT_SECRET
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

  //create token
  function createToken(id) {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d"});
  }

  const prisma = require("../prisma");
  
//token-checking middleware
  router.use(async (req, res, next ) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.slice(7);
    if (!token) return next ();
    //find user with ID decrypted from the token and attach to the request
      try{
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUniqueOrThrow({
          where: { id },
        });
        req.user = user;
        next();
      }catch (e){
        next(e);
      }
  })


//POST /register
  router.post("/register", async(req,res,next) => {
    const {email, password} = req.body;
    try{
      const user = await prisma.user.register(email,password);
      const token = createToken(user.id);
      res.status(201).json({token});
    }catch(e) {
      next(e)
    };
  })
//POST /login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },  // This will now work as email is unique
    });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw Error("Invalid password");
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});


// checks the request for an authenticated user
function authenticate(req, res,next) {
  if(req.user){
    next();
  }else{
    next({ status : 401, message:"You must be logged in"});
  }
}

module.exports = {
  router,
  authenticate,
};