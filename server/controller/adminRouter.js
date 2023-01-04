const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const Admin= require("../models/adminSchema")
const createError = require("http-errors");
const { registerSchema, loginSchema } = require("../helper/adminAuthSchema");

module.exports = {
  register: async (req, res, next) => {
    try {
      const validate_token = req.headers["authorization"]?.split(" ")[1];
      console.log("validate toke",validate_toke);
      if(process.env.ADMIN_VALIDATOR!==validate_token){
        res.status(401).send({status:'failed',msg:'unauthorized'})
        return
      }
      const result = await registerSchema.validateAsync(req.body);
      const doesExits = await Admin.findOne({ email: result.email });
      if (doesExits)
        throw createError.Conflict(`${result.email} already exits`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(result.password, salt);
      const user = new Admin({
        name: result.name,
        profile: req.file.originalname,
        email: result.email,
        mobile: result.mobile,
        password: hashedPassword,
      });
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      next(error);
    }
  },
//   update: (req, res, next) => {
//     Admin.findById(req.params.id, (err, usr) => {
//       if (!usr) return next(new Error("Could not load Document"));
//       else {
//         if (req.body.name) {
//           usr.name = req.body.name;
//         }
//         if (req.body.email) {
//           usr.email = req.body.email.toLowerCase();
//         }
//         if (req.body.password) {
//           usr.password = usr.generateHash(req.body.password);
//         }
//         if (req.file) {
//           usr.profile = req.file.originalname;
//         }
//         usr.save((err) => {
//           if (err) console.log("error");
//           else res.send(" update success");
//         });
//       }
//     });
//   },
  login: async (req, res, next) => {
    try {
      console.log(req.body)
      const result = await loginSchema.validateAsync(req.body);
      const user = await Admin.findOne({ email: result.email });
      if (!user) {
        throw createError(400, "invalid crentials");
      }
      const verifyPassword = await bcrypt.compare(
        result.password,
        user.password
      );

      if (!verifyPassword) {
        throw createError(400, "invalid crentials");
      }

      const token = JWT.sign({ _id: user._id }, process.env.JWT_TOKEN_SECRET);
      res.cookie("jwt_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.send({
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  getAdmin: async (req, res, next) => {
    try {
       const token = req.cookies["jwt_token"];
        console.log(token)
         const claims = JWT.verify(token, process.env.JWT_TOKEN_SECRET);
      if (!claims) {
        throw createError(401, "unauthorized");
      }

      const user = await Admin.findOne({ _id: claims._id });
      const { password, ...data } = await user.toJSON();
      res.send(data);
    } catch (error) {
      next(error);
    }
  },
  logout: (req, res, next) => {
    try {
      console.log("logout")
      res.cookie("jwt_token", { maxAge: 0 });
      // res.clearCookie('jwt')
      res.send({
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  getAllUser:async(req,res)=>{
    try {
      
      
      const user = await Admin.find({});
      if (!user) {
        throw createError(400, "invalid crentials");
      }
      
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
};
