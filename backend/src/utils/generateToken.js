import jwt from 'jsonwebtoken';

export function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '7d' });
  return token;
}
