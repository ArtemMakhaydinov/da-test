import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { getUserById } from '../services/user.service';
import logger from './logger.confg';
import { JwtPayload } from 'jsonwebtoken';
import { getJwtRefreshById } from '../services/jwt-refresh.service';
import { getEnv } from '../utils/get-env.util';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getEnv('JWT_SECRET'),
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: JwtPayload, done) => {
    try {
      console.log('jwt payload', payload);
      const user = await getUserById(Number(payload.sub));
      const jwtRefresh = await getJwtRefreshById(Number(payload.jwtRefreshId));
      const expiresAt = payload.exp ?? 0;
      return done(null, user, { expiresAt, jwtRefresh });
    } catch (error) {
      logger.error('JWT Strategy error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: payload.userId,
      });
      return done(error, false);
    }
  }),
);

export default passport;
