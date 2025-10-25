/**
 * 检查字符串是否包含 median_TEPS，并提取其后的数值。
 * * @param {string} logString - 待检测的日志字符串。
 * @returns {number|null} - 提取到的数值（Number 类型），如果未找到则返回 null。
 */
export function extractMedianTepsValue(logString) {
  // 正则表达式解释:
  // 1. (median_TEPS): 字面匹配关键词
  // 2. [:\s]*: 匹配零个或多个冒号(:)或空白字符(\s)
  // 3. ([\d\.\+\-Ee]+): 捕获组，匹配数字部分
  //    - \d: 任何数字 (0-9)
  //    - \.: 小数点
  //    - \+\-: 正负号
  //    - Ee: 科学计数法的 E 或 e
  //    - +: 匹配前述字符一次或多次

  const regex = /median_TEPS[:\s]*([\d\.\+\-Ee]+)/i; // i 忽略大小写

  const match = logString.match(regex);

  if (match && match.length > 1) {
      // match[1] 是正则表达式中第一个捕获组 (即数字字符串)
      const numString = match[1];

      // 使用 parseFloat() 将捕获到的字符串转换为数字，它能正确处理科学计数法
      const resultNumber = parseFloat(numString) / 1e9;

      // 返回数字结果
      return resultNumber;
  }

  // 如果没有匹配或匹配失败，返回 null
  return null;
}
