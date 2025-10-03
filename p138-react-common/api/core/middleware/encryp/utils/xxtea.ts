
// xxtea.ts：纯 TS 实现，无需安装 npm 包
export function toBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function toString(bytes: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
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

function fromUint32Array(words: number[], includeLength: boolean): Uint8Array {
  let length = words.length * 4;
  if (includeLength) {
    length = words[words.length - 1];
    words = words.slice(0, -1);
  }
  const bytes = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    bytes[i * 4] = words[i] & 0xff;
    bytes[i * 4 + 1] = (words[i] >>> 8) & 0xff;
    bytes[i * 4 + 2] = (words[i] >>> 16) & 0xff;
    bytes[i * 4 + 3] = (words[i] >>> 24) & 0xff;
  }
  return bytes.slice(0, length);
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

function decryptUint32Array(v: number[], k: number[]): number[] {
  if (v.length < 2) return v;
  const n = v.length;
  const delta = 0x9e3779b9;
  let rounds = Math.floor(6 + 52 / n);
  let sum = rounds * delta;
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

function base64Encode(u8: Uint8Array): string {
  if (typeof btoa !== 'undefined') {
    let binary = '';
    for (let i = 0; i < u8.length; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    return btoa(binary);
  } else {
    return Buffer.from(u8).toString('base64');
  }
}

function base64Decode(base64: string): Uint8Array {
  if (typeof atob !== 'undefined') {
    const binary = atob(base64);
    const u8 = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      u8[i] = binary.charCodeAt(i);
    }
    return u8;
  } else {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }
}
export function encrypt(data: string, key: string): string {
  const v = toUint32Array(toBytes(data), true);
  const k = toUint32Array(toBytes(key), false);
  const encrypted = encryptUint32Array(v, k);
  return base64Encode(fromUint32Array(encrypted, false));
}

export function decrypt(base64Str: string, key: string): string {
  const v = toUint32Array(base64Decode(base64Str), false);
  const k = toUint32Array(toBytes(key), false);
  const decrypted = decryptUint32Array(v, k);
  const bytes = fromUint32Array(decrypted, true);
  return toString(bytes);
}
