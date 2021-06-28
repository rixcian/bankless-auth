import express from "express";

import users from "./users";


const API_VERSION = process.env.API_VERSION;

const router = express.Router();

router.get(`/`, (req, res) => {
  res.json({
    api_map: {
      [`/api/${API_VERSION}/`]: "Index",
      [`/api/${API_VERSION}/swagger`]: "Documentation",
      [`/api/${API_VERSION}/users/register/email`]: "User Registration with Email"
    }
  });
});

router.use('/users', users);

export default router;
