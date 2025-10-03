// xxteaDecryptor.ts

  function padKey(input: Uint8Array): Uint8Array {
    const padded = new Uint8Array(16);
    padded.set(input.slice(0, 16));
    return padded;
  }
  
  function toUint32Array(bytes: Uint8Array): number[] {
    const length = Math.ceil(bytes.length / 4);
    const result = new Uint32Array(length);
    for (let i = 0; i < bytes.length; i++) {
      result[i >> 2] |= bytes[i] << ((i % 4) * 8);
    }
    return Array.from(result);
  }
  
  function toUint8Array(words: number[]): Uint8Array {
    const bytes = new Uint8Array(words.length * 4);
    for (let i = 0; i < words.length; i++) {
      bytes[i * 4] = words[i] & 0xff;
      bytes[i * 4 + 1] = (words[i] >>> 8) & 0xff;
      bytes[i * 4 + 2] = (words[i] >>> 16) & 0xff;
      bytes[i * 4 + 3] = (words[i] >>> 24) & 0xff;
    }
    return bytes;
  }
  
  function decryptUint32Array(v: number[], k: number[]): number[] {
    if (v.length < 2) return v;
    const n = v.length;
    const delta = 0x9e3779b9;
    const rounds = 6 + 52 / n;
    let sum = Math.floor(rounds * delta) >>> 0;
    let y = v[0];
  
    while (sum !== 0) {
      const e = (sum >>> 2) & 3;
      for (let p = n - 1; p >= 0; p--) {
        const z = v[(p - 1 + n) % n];
        const mx =
          (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
          ((sum ^ y) + (k[(p & 3) ^ e] ^ z));
        v[p] = (v[p] - mx) >>> 0;
        y = v[p];
      }
      sum = (sum - delta) >>> 0;
    }
  
    return v;
  }
  
  function base64ToUint8Array(base64: string): Uint8Array {
    if (typeof atob !== 'undefined') {
      const binary = atob(base64);
      const u8 = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        u8[i] = binary.charCodeAt(i);
      }
      return u8;
    } else {
      // Node fallback
      return Uint8Array.from(Buffer.from(base64, 'base64'));
    }
  }
  export function decryptXXTEAString(cipherB64: string, keyStr: string): string {
    const key = padKey(new TextEncoder().encode(keyStr));
    const encryptedBytes = base64ToUint8Array(cipherB64);
    const v = toUint32Array(encryptedBytes);
    const k = toUint32Array(key);
    const decrypted = decryptUint32Array(v, k);
    const length = decrypted.pop()!;
    const resultBytes = toUint8Array(decrypted);
    return new TextDecoder().decode(resultBytes.slice(0, length));
  }
  