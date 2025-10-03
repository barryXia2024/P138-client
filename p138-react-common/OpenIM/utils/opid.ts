let _seq = 0;
/** 统一操作 ID（trace） */
export function opid(prefix = "op") {
  return `${prefix}_${Date.now()}_${_seq++}`;
}
