import express from "express";
import bcrypt from "bcrypt";
import {RequestContext, wrap} from "@mikro-orm/core";

import logger from "../logger";
import {User, UserRole} from "../db/entities/User";


const router = express.Router();

router.post('/register/email', async (req, res) => {
  const {email, password} = req.body;

  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { email: email });

  // If user with that email address doesn't exists,
  // we can create a new one
  if (!user) {

    try {
      // Generate salt & hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Creates a new user
      let newUser = new User(email, hashedPassword, UserRole.USER);

      // Save user into DB
      await em.persistAndFlush(newUser);

      return res.status(201).json({
        data: "User was successfully created",
        error: null
      });
    } catch (e) {
      logger.error("Error with creating user: ", e);

      return res.status(500).json({
        data: null,
        error: {
          name: "Internal Server Error",
          description: e
        }
      });
    }
  }

  return res.status(400).json({
    data: null,
    error: {
      name: 'User already exists',
      description: 'User with this email address already exists'
    }
  });

});

export default router;