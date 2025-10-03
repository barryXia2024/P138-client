/**
 * 表单验证工具函数
 * 
 * 提供常用的数据验证功能
 */

/**
 * 验证手机号码
 * @param value 要验证的值
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidPhone = (value: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(value);
};

/**
 * 验证电子邮箱
 * @param value 要验证的值
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

/**
 * 验证URL
 * @param value 要验证的值
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证身份证号码
 * @param value 要验证的值
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidIdCard = (value: string): boolean => {
  // 支持15位和18位身份证号
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idCardRegex.test(value)) {
    return false;
  }
  
  // 18位身份证需要验证最后一位校验码
  if (value.length === 18) {
    const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const idCardY = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let idCardWiSum = 0;
    
    for (let i = 0; i < 17; i++) {
      idCardWiSum += parseInt(value.substring(i, i + 1)) * idCardWi[i];
    }
    
    const idCardMod = idCardWiSum % 11;
    const idCardLast = value.substring(17);
    
    return idCardLast.toUpperCase() === idCardY[idCardMod];
  }
  
  return true;
};

/**
 * 验证密码强度
 * @param value 要验证的值
 * @param options 验证选项
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidPassword = (value: string, options?: {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}): boolean => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = false,
  } = options || {};
  
  if (value.length < minLength) {
    return false;
  }
  
  if (requireUppercase && !/[A-Z]/.test(value)) {
    return false;
  }
  
  if (requireLowercase && !/[a-z]/.test(value)) {
    return false;
  }
  
  if (requireNumber && !/\d/.test(value)) {
    return false;
  }
  
  if (requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    return false;
  }
  
  return true;
};

/**
 * 验证是否为空
 * @param value 要验证的值
 * @returns 验证结果，为空返回true，否则返回false
 */
export const isEmpty = (value: any): boolean => {
  if (value === undefined || value === null) {
    return true;
  }
  
  if (typeof value === 'string') {
    console.log(value.trim() === '', value);
    return value.trim() === '';
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
};

/**
 * 验证数字范围
 * @param value 要验证的值
 * @param min 最小值
 * @param max 最大值
 * @returns 验证结果，在范围内返回true，否则返回false
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 验证字符串长度
 * @param value 要验证的值
 * @param min 最小长度
 * @param max 最大长度
 * @returns 验证结果，在范围内返回true，否则返回false
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  const length = value.length;
  return length >= min && length <= max;
};

/**
 * 检查是否为有效的中文姓名
 * @param value 要验证的值
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidChineseName = (value: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,}$/;
  return nameRegex.test(value);
};

/**
 * 检查是否为有效的银行卡号
 * @param value 要验证的值
 * @returns 验证结果，通过返回true，否则返回false
 */
export const isValidBankCard = (value: string): boolean => {
  const bankCardRegex = /^\d{16,19}$/;
  if (!bankCardRegex.test(value)) {
    return false;
  }
  
  // Luhn算法校验
  const digits = value.split('').map(Number).reverse();
  let sum = 0;
  
  for (let i = 0; i < digits.length; i++) {
    if (i % 2 === 1) {
      const doubled = digits[i] * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    } else {
      sum += digits[i];
    }
  }
  
  return sum % 10 === 0;
};

/**
 * 创建必填验证器
 * @param message 错误消息
 * @returns 验证函数
 */
export const required = (message = '此字段不能为空'): ((value: any) => string | undefined) => {
  return (value: any): string | undefined => {
    if (isEmpty(value)) {
      return message;
    }
    return undefined;
  };
};

/**
 * 创建最小长度验证器
 * @param min 最小长度
 * @param message 错误消息
 * @returns 验证函数
 */
export const minLength = (min: number, message?: string): ((value: string) => string | undefined) => {
  return (value: string): string | undefined => {
    if (!value || value.length < min) {
      return message || `长度不能少于${min}个字符`;
    }
    return undefined;
  };
};

/**
 * 创建最大长度验证器
 * @param max 最大长度
 * @param message 错误消息
 * @returns 验证函数
 */
export const maxLength = (max: number, message?: string): ((value: string) => string | undefined) => {
  return (value: string): string | undefined => {
    if (value && value.length > max) {
      return message || `长度不能超过${max}个字符`;
    }
    return undefined;
  };
};

/**
 * 创建邮箱验证器
 * @param message 错误消息
 * @returns 验证函数
 */
export const email = (message = '请输入有效的电子邮箱'): ((value: string) => string | undefined) => {
  return (value: string): string | undefined => {
    if (!value) return undefined;
    
    if (!isValidEmail(value)) {
      return message;
    }
    return undefined;
  };
};

/**
 * 创建手机号验证器
 * @param message 错误消息
 * @returns 验证函数
 */
export const phone = (message = '请输入有效的手机号码'): ((value: string) => string | undefined) => {
  return (value: string): string | undefined => {
    if (!value) return undefined;
    
    if (!isValidPhone(value)) {
      return message;
    }
    return undefined;
  };
};

/**
 * 组合多个验证器
 * @param validators 验证器数组
 * @returns 组合后的验证函数
 */
export const composeValidators = (...validators: Array<(value: any) => string | undefined>) => {
  return (value: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return undefined;
  };
}; 


// 金额校验函数
export const isValidateAmount = (amount: string): boolean => {
  if (!amount || amount.trim() === '') return false;
  
  // 检查是否为有效的数字格式（支持两位小数）
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amountRegex.test(amount)) return false;
  
  // 检查金额是否大于0
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) return false;
  
  return true;
};
