import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './env.js';
const generateToken = (payload,expiresIn) => {
  return jwt.sign(payload,JWT_SECRET,{expiresIn});
}

export default generateToken