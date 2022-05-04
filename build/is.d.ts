/**
 * 这个文件暴露类型判断的方法
 */
/**
 * Array.isArray
 */
export declare const array: (arg: any) => arg is any[];
/**
 * 判断 s 是否为数字或布尔值，或他的原始类型是否为数字或布尔值
 * @param s
 * @returns 布尔值
 */
export declare function primitive(s: any): s is string | number;
