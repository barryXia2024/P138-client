// xxteaEncryptor.ts

  
  function padKey(input: Uint8Array): Uint8Array {
    const padded = new Uint8Array(16);
    padded.set(input.slice(0, 16));
    return padded;
  }
  
  function toUint32Array(bytes: Uint8Array, includeLength: boolean): number[] {
    const length = bytes.length;
    const n = Math.ceil(length / 4);
    const result = new Uint32Array(includeLength ? n + 1 : n);
    for (let i = 0; i < length; ++i) {
      result[i >> 2] |= bytes[i] << ((i % 4) * 8);
    }
    if (includeLength) result[n] = length;
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
  
  function encryptUint32Array(v: number[], k: number[]): number[] {
    if (v.length < 2) return v;
    const n = v.length;
    const delta = 0x9e3779b9;
    let sum = 0;
    let z = v[n - 1];
  
    const q = Math.floor(6 + 52 / n);
    for (let i = 0; i < q; i++) {
      sum = (sum + delta) >>> 0;
      const e = (sum >>> 2) & 3;
      for (let p = 0; p < n; p++) {
        const y = v[(p + 1) % n];
        const mx =
          (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
          ((sum ^ y) + (k[(p & 3) ^ e] ^ z));
        v[p] = (v[p] + mx) >>> 0;
        z = v[p];
      }
    }
    return v;
  }
  
  function base64FromUint8Array(u8: Uint8Array): string {
    if (typeof btoa !== 'undefined') {
      let binary = '';
      for (let i = 0; i < u8.length; i++) {
        binary += String.fromCharCode(u8[i]);
      }
      return btoa(binary);
    } else {
      // Node.js fallback
      return Buffer.from(u8).toString('base64');
    }
  }
  export function encryptXXTEAString(input: string, keyStr: string): string {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(input);
    const key = padKey(textEncoder.encode(keyStr));
    const v = toUint32Array(data, true);
    const k = toUint32Array(key, false);
    const encrypted = encryptUint32Array(v, k);
    const encryptedBytes = toUint8Array(encrypted);
    return base64FromUint8Array(encryptedBytes);
  }