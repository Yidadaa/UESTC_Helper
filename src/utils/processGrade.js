export default function (text) {
  // 将成绩数据处理成标准数据，算法来自于电子科技大学成绩单
  text = text.trim && text.trim();
  let dict = {
    '优秀': 95, '良好': 85, '中等': 75, '及格': 65, '不及格': 55, // 中文五分制
    '通过': 85, '不通过': 0, // 二级制
  }
  // 下面是英文五级制，包括A+, A, A-这几种形式的
  const enGradeMap = {
    'A': 90, 'B': 85, 'C': 75, 'D': 65, 'E': 55
  }
  for (let enKey in enGradeMap) {
    const enGrade = enGradeMap[enKey]
    dict[enKey + '+'] = enGrade + 2; // 英文五分制的level+/-分别浮动两分
    dict[enKey] = enGrade
    dict[enKey + '-'] = enGrade - 2
  }
  if (isFinite(parseFloat(text))) {
    // 是浮点数的话，直接返回
    return parseFloat(text)
  } else {
    // 否则按照规则进行转义
    return dict[text]
  }
}