export const isNaNofString = (value: string,includeEmptyString:string[]=['']) => {
  if (value === 'NaN') {
    return true;
  }
  if (value === 'null') {
    return true;
  }
  if (value === 'undefined') {
    return true;
  }
  if (value === 'null') {
    return true;
  }
  if (value === null) {
    return true;
  }
  if (value === undefined) {
    return true;
  }
  if(includeEmptyString.includes(value)){
    return true;
  }

  return false;
};

export const isDev = process.env.EXPO_PUBLIC_APP_ENV === 'development';