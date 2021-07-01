import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt";

import {User} from "../db/entities/User";
import {RequestContext} from "@mikro-orm/core";


const PASSPORT_SETTINGS = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.SECRET
}

const passportMiddleware = passport => passport.use(
  new JWTStrategy(PASSPORT_SETTINGS, async (jwtPayload, done) => {

    const em = RequestContext.getEntityManager();

    em.findOne(User, {web3Address: jwtPayload.web3Address, username: jwtPayload.username})
      .then(user => {
        if (!user)
          return done(null, false);

        return done(null, user);
      })
      .catch(err => {
        return done(err, false);
      })
  })
);

export default passportMiddleware;