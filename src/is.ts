/**
 * 这个文件暴露类型判断的方法
 */

/**
 * Array.isArray
 */
export const array = Array.isArray
/**
 * 判断 s 是否为数字或布尔值，或他的原始类型是否为数字或布尔值
 * @param s 
 * @returns 布尔值
 */
export function primitive(s: any): s is string | number {
  return (
    typeof s === "string" ||
    typeof s === "number" ||
    s instanceof String ||
    s instanceof Number
  )
}

// END
