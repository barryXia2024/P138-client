/**
 * 表单管理Hook
 * 
 * 用于处理表单状态、验证和提交，支持自定义验证逻辑
 */

import {useCallback, useState} from 'react';

/**
 * 表单选项接口
 */
export interface FormOptions<T extends Record<string, any>> {
  /** 表单初始值 */
  initialValues: T;
  /** 表单验证函数 */
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  /** 表单提交处理函数 */
  onSubmit?: (values: T) => void | Promise<void>;
  /** 是否在字段值变化时进行验证 */
  validateOnChange?: boolean;
  /** 是否在字段失焦时进行验证 */
  validateOnBlur?: boolean;
  /** 是否在表单提交时进行验证 */
  validateOnSubmit?: boolean;
}

/**
 * 表单状态接口
 */
export interface FormState<T extends Record<string, any>> {
  /** 表单值 */
  values: T;
  /** 表单错误信息 */
  errors: Partial<Record<keyof T, string>>;
  /** 已触碰的字段 */
  touched: Partial<Record<keyof T, boolean>>;
  /** 表单是否正在提交 */
  isSubmitting: boolean;
  /** 表单是否有效（无错误） */
  isValid: boolean;
  /** 表单是否已提交过 */
  isSubmitted: boolean;
  /** 是否有任何字段被修改过 */
  isDirty: boolean;
}

/**
 * 表单钩子的返回值接口
 */
export interface FormReturn<T extends Record<string, any>> extends FormState<T> {
  /** 更新单个字段值的处理函数 */
  handleChange: (field: keyof T) => (value: any) => void;
  /** 表单字段失焦的处理函数 */
  handleBlur: (field: keyof T) => () => void;
  /** 表单提交处理函数 */
  handleSubmit: () => Promise<void>;
  /** 重置表单 */
  resetForm: () => void;
  /** 设置整个表单值 */
  setValues: (values: T) => void;
  /** 设置单个字段值 */
  setValue: (field: keyof T, value: any) => void;
  /** 设置多个字段值 */
  setMultipleValues: (values: Partial<T>) => void;
  /** 设置表单错误 */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  /** 设置单个字段错误 */
  setError: (field: keyof T, error: string) => void;
  /** 设置字段为已触碰 */
  setTouched: (field: keyof T, isTouched?: boolean) => void;
  /** 设置多个字段为已触碰 */
  setMultipleTouched: (touched: Partial<Record<keyof T, boolean>>) => void;
  /** 验证整个表单 */
  validateForm: () => Partial<Record<keyof T, string>>;
  /** 验证单个字段 */
  validateField: (field: keyof T) => string | undefined;
}

/**
 * 表单状态和逻辑管理Hook
 * 
 * @param options 表单选项
 * @returns 表单状态和方法
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnSubmit = true,
}: FormOptions<T>): FormReturn<T> {
  // 表单状态
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // 验证表单的所有字段
  const validateForm = useCallback((): Partial<Record<keyof T, string>> => {
    if (!validate) return {};
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return validationErrors;
  }, [values, validate]);
  
  // 验证单个字段
  const validateField = useCallback((field: keyof T): string | undefined => {
    if (!validate) return undefined;
    
    const validationErrors = validate(values);
    const fieldError = validationErrors[field];
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldError,
    }));
    
    return fieldError;
  }, [values, validate]);
  
  // 更新单个字段值
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [field]: value };
      // 如果是第一次修改某个字段值，设置isDirty为true
      if (!isDirty && prev[field] !== value) {
        setIsDirty(true);
      }
      return newValues;
    });
    
    // 如果需要在值变化时验证，且该字段已被触碰过
    if (validateOnChange && touched[field] && validate) {
      validateField(field);
    }
  }, [touched, validate, validateOnChange, isDirty, validateField]);
  
  // 字段失焦处理
  const handleBlur = useCallback((field: keyof T) => () => {
    // 标记字段为已触碰
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // 如果需要在失焦时验证
    if (validateOnBlur && validate) {
      validateField(field);
    }
  }, [validate, validateOnBlur, validateField]);
  
  // 处理表单提交
  const handleSubmit = useCallback(async () => {
    // 标记所有字段为已触碰
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setTouched(allTouched);
    setIsSubmitted(true);
    
    // 如果需要在提交时验证
    if (validateOnSubmit && validate) {
      const formErrors = validateForm();
      
      // 如果有错误，不提交
      if (Object.keys(formErrors).length > 0) {
        return;
      }
    }
    
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, validateOnSubmit, onSubmit, validateForm]);
  
  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsSubmitted(false);
    setIsDirty(false);
  }, [initialValues]);
  
  // 设置单个字段值
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => {
      if (!isDirty && prev[field] !== value) {
        setIsDirty(true);
      }
      return { ...prev, [field]: value };
    });
  }, [isDirty]);
  
  // 设置多个字段值
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => {
      const updatedValues = { ...prev, ...newValues };
      // 检查是否有任何值变化
      if (!isDirty) {
        for (const key in newValues) {
          if (prev[key] !== newValues[key]) {
            setIsDirty(true);
            break;
          }
        }
      }
      return updatedValues;
    });
  }, [isDirty]);
  
  // 设置单个字段错误
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  // 设置字段为已触碰
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);
  
  // 设置多个字段为已触碰
  const setMultipleTouched = useCallback((touchedFields: Partial<Record<keyof T, boolean>>) => {
    setTouched(prev => ({ ...prev, ...touchedFields }));
  }, []);
  
  // 表单是否有效
  const isValid = Object.keys(errors).length === 0;
  
  // 返回表单状态和方法
  return {
    // 状态
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isSubmitted,
    isDirty,
    
    // 处理函数
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    
    // 设置值和状态
    setValues,
    setValue,
    setMultipleValues,
    setErrors,
    setError,
    setTouched: setFieldTouched,
    setMultipleTouched,
    
    // 验证
    validateForm,
    validateField,
  };
} 