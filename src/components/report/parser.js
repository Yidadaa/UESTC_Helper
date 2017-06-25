/**
 * 成绩解析模块
 */
function parseTableData(table) {
  /**
   * @desc table解析函数
   * @param {HTMLTableElement} table对象
   * @returns {Object} tableHeader,tableContent表头和表内内容
   */
  let data = {
    tableHead: [],
    tableContent: []
  };
  let head = table.querySelector('.gridhead tr');
  for (let i in head.children) {
    if (head.children[i].innerText) {
      data.tableHead.push(head.children[i].innerText);
    }
  }
  let content = table.querySelectorAll('tbody tr');
  for (let i in content) {
    let lineContent = [];
    for (let k in content[i].children) {
      if (content[i].children[k].innerText) {
        lineContent.push(content[i].children[k].innerText);
      } else if (k == 2 || k == 7) {
        lineContent.push('');
      }
    }
    if (lineContent.length) {
      data.tableContent.push(lineContent);
    }
  }

  return data;
}

function sumDataFormater(sourceData) {
  /**
   * @desc 文件格式化函数
   * @return 格式化后的数据，数据内容如下
   */
  let data = {
    sum: {
      sum: {
        gpa: 0,
        aver: 0,
        study: 0
      },
      detail: { // 汇总后的每年的数据
        year: [],
        gpa: [],
        aver: [],
        study: []
      }
    },
    eachYear: { // 每年的数据
      year: [],
      aver: [],
      gpa: []
    },
    detail: [] //按学期分组的数据
  };
  const gradeDict = {
    '通过': 85
  };
  /**
   * 归档data.sum的sum部分
   */
  let length = sourceData.intro.tableContent.length;
  data.sum.sum.gpa = sourceData.intro.tableContent[length - 2][3];
  data.sum.sum.study = sourceData.intro.tableContent[length - 2][2];
  for (let i in sourceData.detail.tableContent) {
    let point = parseFloat(sourceData.detail.tableContent[i][5]);
    let grade = sourceData.detail.tableContent[i][sourceData.detail.tableContent[i].length - 1];
    if (isNaN(parseInt(grade.trim()))) {
      grade = gradeDict[grade.trim()];
    } else {
      grade = isFinite(parseFloat(grade)) ? parseFloat(grade) : 60;
    }
    data.sum.sum.aver += grade / parseFloat(data.sum.sum.study) * point;
  }
  data.sum.sum.aver = data.sum.sum.aver.toFixed(2);

  /**
   * 提取年份
   */
  let tmpYear = {};
  for (let i in sourceData.intro.tableContent) {
    let tmp = sourceData.intro.tableContent[i];
    if (tmp.length == 5) {
      tmpYear[tmp[0] + '-' + tmp[1]] = [];
    }
  }
  for (let i in sourceData.intro.tableContent) {
    let tmp = sourceData.intro.tableContent[i];
    if (tmp.length == 5) {
      tmpYear[tmp[0] + '-' + tmp[1]] = [tmp[3], tmp[4]];
    }
  }
  /**
   * 提取每学期详细分数
   */
  let tmpData = {};
  for (let i in sourceData.detail.tableContent) {
    let tmp = sourceData.detail.tableContent[i];
    tmpData[tmp[0].replace(/\s/, '-')] = []; //初始化
  }
  for (let i in sourceData.detail.tableContent) {
    let tmp = sourceData.detail.tableContent[i];
    let className = tmp[3].trim();
    let classPoint = tmp[5].trim();
    let classGrade = tmp[tmp.length - 1].trim();
    if (isNaN(parseFloat(classGrade))) {
      classGrade = classGrade == '通过' ? 85 : 45;
    }
    tmpData[tmp[0].replace(/\s/, '-')].push([className, classPoint, classGrade]);
  }

  for (let i in tmpData) {
    /**
     * 计算每学期的平均分，暂存入tmpYear
     */
    let aver = 0;
    let gpa_sum = 0;
    for (let k in tmpData[i]) {
      let tmp = tmpData[i][k];
      gpa_sum += parseFloat(tmp[1]);
    }
    for (let k in tmpData[i]) {
      let tmp = tmpData[i][k];
      aver += parseFloat(tmp[1]) / gpa_sum * parseFloat(tmp[2]);
    }
    aver = aver.toFixed(2);
    tmpYear[i].push(aver);
  }
  /**
   * 将数字转换为汉字，并将年份排序
   */
  let strReplace = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];
  let chYear = [];
  for (let i in tmpYear) {
    chYear.push(i);
    chYear = chYear.sort();
  }

  for (let i in chYear) {
    /**
     * 归档data.sum的detail部分
     */
    data.sum.detail.year.push(strReplace[i]);
    data.sum.detail.study.push({
      value: tmpYear[chYear[i]][0],
      name: strReplace[i]
    });
    data.sum.detail.gpa.push({
      value: tmpYear[chYear[i]][1],
      name: strReplace[i]
    });
    data.sum.detail.aver.push({
      value: tmpYear[chYear[i]][2],
      name: strReplace[i]
    });
    /**
     * 归档data.eachYear
     */
    data.eachYear.year.push(strReplace[i]);
    data.eachYear.aver.push(tmpYear[chYear[i]][2]);
    data.eachYear.gpa.push(tmpYear[chYear[i]][1]);
    /**
     * 归档data.detail
     */
    let tmp = {
      year: '',
      subject: [],
      grade: [],
      gpa: [],
      credit: []
    };
    for (let k in tmpData[chYear[i]]) {
      tmp.year = strReplace[i];
      tmp.grade.push(tmpData[chYear[i]][k][2]);
      tmp.credit.push(tmpData[chYear[i]][k][1]);
      tmp.subject.push(tmpData[chYear[i]][k][0]);
      tmp.gpa = tmp.grade.map(function (x) {
        return parseFloat((((x > 85 ? x = 85 : x < 45 ? 45 : x) - 60) * 0.1).toFixed(1)) + parseFloat(1.5);
      });
    }
    data.detail.push(tmp);
  }

  return data;
}

module.exports = (html) => {
  let div = document.createElement('div');
  div.innerHTML = html;
  let data = {
    intro: parseTableData(div.querySelector('table')),
    detail: parseTableData(div.querySelectorAll('table')[1])
  };
  data = sumDataFormater(data); //格式化源数据

  return data;
};