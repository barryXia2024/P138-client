import {decrypt, encrypt} from '../core/middleware/encryp/utils';
import {storageAdapter} from '../platforms/storage';

const SECRET_KEY = 'your-secure-key'; // 建议动态设置并缓存

export const encryptedStorage = {
  async getItem(key: string): Promise<string | null> {
    const encrypted = await storageAdapter.getItem(key);
    if (!encrypted) return null;
    const decrypted = decrypt(encrypted, SECRET_KEY);
    return decrypted || null;
  },

  async setItem(key: string, value: string): Promise<void> {
    const encrypted = encrypt(value, SECRET_KEY);
    await storageAdapter.setItem(key, encrypted);
  },

  async removeItem(key: string): Promise<void> {
    await storageAdapter.removeItem(key);
  },
};
