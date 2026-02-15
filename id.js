import { randomBytes } from 'crypto';

export default function generateId(len = 22) {
      const bytes = randomBytes(len);
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let out = '';
      for (let i = 0; i < len; i++) {
        out += chars[bytes[i] % chars.length];
      }
      return out;
}
