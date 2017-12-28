/**
 * @file 数据处理方法
 */
let func = {};

func.parseBasicData = (sourceText) => {
  /**
   * 获取基础数据
   */
  let pHtml = sourceText.match(/jQuery.*searchTable/);
  if (!pHtml) return {};
  let tmp = pHtml && pHtml[0].split('.');
  let res = {};
  res.tagId = tmp[0].match(/semester.*Semester/)[0];
  res.ids = sourceText.match(/ids.*\)/)[0].match(/\d+/)[0];
  res.value = tmp[1].match(/value\:\"(\d*)/)[1];

  return res;
};

func.parseSemesterData = (sourceText) => {
  /**
   * 获取学期数据
   */
  const tmp = eval('(' + sourceText + ')').semesters;
  let semester = {};
  for (let i in tmp) {
    let v = tmp[i];
    let year = v[0].schoolYear.split('-')[0];
    semester[year] = {};
    v.forEach((v, i) => {
      semester[year][i] = v.id;
    });
  }

  return semester;
};

func.timeStringParser = (str) => {
  /**
   * 解析排课的字符串，转化为人类可读的文字
   * str是长度为53的源字符串
   */
  //if (str.length != 53) return null;
  let res = [];
  let matchFullWeek = new RegExp(/1{2,}/g); //匹配连续周
  let matchSingleWeek = new RegExp(/(10){2,}/g); //匹配奇偶周
  const getZeroStr = (num) => { // 获取num个0的字符串
    return new Array(num).fill(0).join('');
  };
  const  matchStr = (pattern, str) => {
    //获取str中匹配pattern的所有字串
    let tmpRes = [];
    let tmp = null;
    let tmpStr = str;
    let cond = true;
    while (cond) {
      tmp = pattern.exec(tmpStr);
      if (tmp) {
        tmpRes.push(tmp);
        tmpStr = tmpStr.replace(tmp[0], getZeroStr(tmp[0].length)); //将匹配到的字串位置清零
      } else {
        cond = false;
      }
    }
    return [tmpRes, tmpStr];
  };
  let fullWeek = matchStr(matchFullWeek, str);
  let singleWeek = matchStr(matchSingleWeek, fullWeek[1]);
  fullWeek[0].forEach(function (v) {
    let startWeek = v.index;
    let endWeek = v.index + v[0].length - 1;
    res.push(startWeek + '-' + endWeek + '周'); //处理连续周
  });
  singleWeek[0].forEach(function (v) {
    let startWeek = v.index;
    let endWeek = v.index + v[0].length - 1;
    let attr = startWeek % 2 ? '单' : '双';
    res.push(startWeek + '-' + endWeek + attr + '周'); //处理奇偶周
  });
  res.push(function () {
    let tmp = singleWeek[1].split('').map(function (v, i) {
      return v == '1' ? i : 0; //得到单周的索引
    }).filter(function (v) {
      return v != 0; //剔除无效值
    }).join('/');
    return tmp.length ? tmp + '周' : null; //加壳处理
  }()); //处理单周

  return res.filter(function (v) {
    return isFinite(parseInt(v)); //剔除无效值
  });
};

func.parseCourseData = (sourceText) => {
  /**
   * 解析课程数据
   */
  const pHtml = JSON.stringify(sourceText).match(/activity = new TaskActivity.*activity/g);
  if (!pHtml) return [];
  let tmp = pHtml && pHtml[0].split('activity =');
  let data = [];
  tmp.forEach(function (value) {
    if (value.length) {
      let info = value.match(/TaskActivity\((.*)\)/)[1].replace(/\,/g, '').split('\\\"'); //获取每个课程的详细信息
      let tmpTime = value.match(/index =.*?\;/g); //获取每节课的排课时间
      let time = [];
      tmpTime.forEach(function (v) {
        time.push(v.match(/\d+/g));
      });
      data.push({
        info: info,
        time: time
      });
    }
  });
  data = data.map(function (v) {
    return {
      courseName: v.info[7].split('(')[0],
      courseId: v.info[7].split('(')[1].replace(')', ''),
      teacher: v.info[3],
      room: v.info[11],
      time: v.time,
      date: func.timeStringParser(v.info[13])
    };
  });

  return data;
};

func.parseExamData = (sourceText) => {
  /**
   * 从网页中解析考试信息
   * @param sourceText 原始网页
   * @return 包含n门课考试信息的数组
   */
  const node = document.createElement('div');
  node.innerHTML = sourceText;
  const tableData = node.querySelector('table').children[0];
  const nodes = tableData.children;
  if (nodes.length === 1) return [];
  const examData = Array.from(nodes).map((node, index) => {
    if (node.children.length == 8 && index > 0) {
      // 解析到的第一组数据是表头，没用
        const tmp = node.children;
        return {
            name: tmp[1].innerHTML,
            date: tmp[2].innerHTML,
            detail: tmp[3].innerHTML.replace(/\(.*\)/, ''),
            address: tmp[4].innerHTML,
            num: tmp[5].innerHTML,
            status: tmp[6].innerHTML
        };
    }
  }).filter(v => !!v);
  return examData;
}

module.exports = func;