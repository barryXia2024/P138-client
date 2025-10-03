
// /**
//  * 设置 Cookie
//  * @param name 键名
//  * @param value 键值
//  * @param maxAge 秒（默认1小时）
//  * @param path 路径（默认 '/'）
//  */
// export function setCookie(name: string, value: string, maxAge: number = 3600, path: string = "/") {
//     document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}`;
//   }
  
//   /**
//    * 读取 Cookie
//    * @param name 键名
//    * @returns 值 或 null
//    */
//   export function getCookie(name: string): string | null {
//     const cookies = document.cookie.split("; ");
//     const cookie = cookies.find(row => row.startsWith(name + "="));
//     return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
//   }
  
//   /**
//    * 清除 Cookie
//    * @param name 键名
//    * @param path 路径（默认 '/'）
//    */
//   export function clearCookie(name: string, path: string = "/") {
//     document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
//   }
  