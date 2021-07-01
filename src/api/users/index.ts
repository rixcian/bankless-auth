import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import {RequestContext} from "@mikro-orm/core";

import logger from "../../logger";
import {isCredentialsValid} from "./validators";
import {User, UserPassport, UserRole} from "../../db/entities/User";
import {hashMessage, recoverAddress} from "../../utils";


import passportMiddleware from "../passport";

passportMiddleware(passport);
const router = express.Router();

router.post('/register/email', async (req, res) => {
  const {username, email, password} = req.body;

  // Validation
  if (!isCredentialsValid({username, email, password}))
    return res.status(400).json({
      data: null,
      error: {
        name: "Credentials are not valid",
        description: "One of the credential properties is not valid"
      }
    });

  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { email: email });

  if (!user) {

    try {
      // Generate salt & hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Creates a new user
      let newUser = new User(username, email, hashedPassword, UserRole.USER, null);

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



router.post('/login/email', async (req, res) => {
  const {email, password} = req.body;

  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { email });

  if (!user)
    return res.status(401).send({
      data: null,
      error: {
        name: "Bad Credentials",
        description: null
      }
    });

  const samePasswords: boolean = await user.comparePasswords(password);

  if (!samePasswords)
    return res.status(403).send({
      data: null,
      error: {
        name: "Bad Credentials",
        description: null
      }
    });

  const token = jwt.sign(user.toJSON(), process.env.SECRET, {
    expiresIn: 604800 // 1 week
  });

  return res.status(200).send({
    data: `JWT ${token}`,
    error: null
  });
});


router.post('/login/web3', async (req, res) => {
  const {signedMessage} = req.body;

  // Validation
  const MESSAGE = "Podpisem této zprávy souhlasím s přihlášením na webové stránky https://bankless.cz";

  // Convert string to HEX
  const hash = hashMessage(MESSAGE);

  // Extract address from signedMessage
  const signerAddress = recoverAddress(signedMessage, hash);

  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { web3Address: signerAddress });

  if (!user) {

    try {
      // Creates a new user
      let newUser = new User(null, null, null, UserRole.USER, signerAddress);

      // Save user into DB
      await em.persistAndFlush(newUser);

      return res.status(202).json({
        data: "User was successfully created. Now, you have to set 'username'",
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
  } else {
    const token = jwt.sign(user.toJSON(), process.env.SECRET, {
      expiresIn: 604800 // 1 week
    });

    return res.status(200).json({
      data: `JWT ${token}`,
      error: null
    });
  }

  return res.status(400).json({
    data: null,
    error: {
      name: "User already exists",
      description: "User with this email address already exists"
    }
  });

});


router.get('/private', passport.authenticate('jwt', { session: false }), async (req, res) => {

  return res.send(req.user);

});


router.put('/username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userPassport = <UserPassport>req.user;

  if (userPassport.username)
    return res.status(400).send({
      data: null,
      error: {
        name: "Username already set",
        description: "You already set username for your account"
      }
    });

  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { id: userPassport.id });

  user.username = req.body.username;

  try {
    // Save user into DB
    await em.persistAndFlush(user);

    const token = jwt.sign(user.toJSON(), process.env.SECRET, {
      expiresIn: 604800 // 1 week
    });

    return res.status(204).send({
      data: `JWT ${token}`,
      error: null
    });
  } catch (e) {
    logger.error("Error with setting username: ", e);

    return res.status(500).json({
      data: null,
      error: {
        name: "Internal Server Error",
        description: e
      }
    });
  }
});



router.put('/web3address', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const userPassport = <UserPassport>req.user;

  if (userPassport.web3Address)
    return res.status(400).send({
      data: null,
      error: {
        name: "Web3 address already set",
        description: "You already set web3 address for your account"
      }
    });

  const em = RequestContext.getEntityManager();
  const user = await em.findOne(User, { id: userPassport.id });

  user.web3Address = req.body.web3Address;

  try {
    // Save user into DB
    await em.persistAndFlush(user);

    const token = jwt.sign(user.toJSON(), process.env.SECRET, {
      expiresIn: 604800 // 1 week
    });

    return res.status(204).send({
      data: `JWT ${token}`,
      error: null
    });
  } catch (e) {
    logger.error("Error with setting username: ", e);

    return res.status(500).json({
      data: null,
      error: {
        name: "Internal Server Error",
        description: e
      }
    });
  }
});

export default router;