import {
  JWT_CONFIG,
  CLIENT_CONFIG
} from "../../config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongo from "mongodb";
import {
  emailOptions,
  sendEMail
} from '../../utils/email-handler';
import app from "../../app";

export default class UserModel {
  async findUser(req, res) {
    let db =req.app.locals.db;
    const user = await db.collection("users").findOne({
      emailId: req.body.emailId
    });
    if (!user) {
      res.status(404).send({
        message: "Email address or password is wrong."
      });
    } else {
      const isMatched = await bcrypt.compare(req.body.password, user.password);
      if (isMatched) {
        const token = jwt.sign({
            id: user._id
          },
          JWT_CONFIG.secret, {
            expiresIn: 86400 // expires in 24 hours
          }
        );
        res.status(200).send({
          token: token
        });
      } else {
        // Passwords don't match
        res.status(404).send({
          message: "Email address or password is wrong."
        });
      }
    }
  }

  async add(req, res) {
    let db =req.app.locals.db;
    let isUserExists = await this.checkUserExistence(db,req.body.emailId);
    if (isUserExists) {
      res.status(409).send({
        message: "User already exists"
      });
    } else {
      
      let response = await db.collection("users").insert(req.body); 
      if (response) {
        res.status(201).send({
          message: "User created successfully"
        });
      } else {
        res.status(500).send({
          message: "Unable to create user"
        });
      }
    }
  }

  async checkUserExistence(db, emailId) {
    const user = await db.collection("users").findOne({
      emailId: emailId
    });
    return user;
  }

  async getUserInfo(req, res) {
    let db =req.app.locals.db;
    const user = await db.collection("users").findOne({
      emailId: req.body.emailId
    });
    if (!user) {
      res.status(404).send({
        message: "User not found"
      });
    } else {
      res.status(200).send(user);
    }
  }

  async getUsers(req, res) {
    let db =req.app.locals.db;
    let users = [];
    const user = await db.collection("users").find({}).project({_id:1,firstName:1,lastName:1}).toArray();
    users = user.map((user)=>{return {"id":user._id,"name":user.firstName+" "+user.lastName}});

    if (!users) {
      res.status(404).send({
        message: "User not found"
      });
    } else {
      res.status(200).send(users);
    }
  }

  async forgotPassword(req, res) {
    let db =req.app.locals.db;
    const {
      emailId
    } = req.body;
    const user = await db.collection("users").findOne({
      emailId: req.body.emailId
    });
    if (!user) {
      res.status(404).send({
        message: "User not found"
      });
    } else {
      const token = jwt.sign({
          id: user._id
        },
        JWT_CONFIG.secret, {
          expiresIn: 3600 // expires in 1 hour
        }
      );
      if (token) {
        const resetPasswordLink = CLIENT_CONFIG.BASE_URL + '/reset-password/' + token;
        emailOptions.to = emailId
        emailOptions.subject = 'Event Manager Account Reset Password Link'
        emailOptions.html = 'Please click below link to reset your password. It will be expired in 1 hour.' +
          '<br/><p>Click <a href=' + resetPasswordLink + '>here</a> to reset your password.</p>'
        sendEMail(emailOptions, (err, response) => {
          if (response === 200) {
            res.status(200).json({
              'message': 'Link to reset password has been sent successfully.'
            })
          } else {
            res.status(500).send({
              'message': err
            })
          }
        });
      } else {
        res.status(500).send({
          message: 'Unable to generate token'
        })
      }
    }
  }

  async resetPassword(req, res) {
    let db =req.app.locals.db;
    const {
      password
    } = req.body;
    const response = await db.collection("users").findOneAndUpdate({_id:mongo.ObjectId(req.userId)}, { $set:{
      password: password
    }});
    if (response) {
      res.status(200).send({
        message: "Password has been reset successfully"
      });
    } else {
      res.status(500).send({
        message: "Unable to reset password"
      });
    }
  }

  async findUsersByName(req, res) {
    let db =req.app.locals.db;
    const users = await db.collection("users").find({
      "name": {
        "$regex": req.body.keyword,
        "$options": "i"
      }
    });
    if (!users) {
      res.status(404).send({
        message: "No user found"
      });
    } else {
      res.status(200).send(users);
    }
  }
}