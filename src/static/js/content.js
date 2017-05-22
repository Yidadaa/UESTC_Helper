'use strict';

chrome.storage.local.get('on', function (data) {
    if (data['on'] == '1') {
        renderNewPage(); //开始渲染
    } else {
        $('#container').style.visibility = 'visible';
    }
});
/**
 * 获取子元素在父元素的的索引
 */
function indexOf(node) {
    var parent = node.parentNode;

    for (var i in parent.children) {
        if (parent.children[i] == node) {
            return i;
        }
    }
    return null;
}
/**
 * 解析table中的数据
 */
function parseTableData(table) {
    var data = {
        tableHead: [],
        tableContent: []
    };
    var head = table.querySelector('.gridhead tr');
    for (var i in head.children) {
        if (head.children[i].innerText) {
            data.tableHead.push(head.children[i].innerText);
        }
    }
    var content = table.querySelectorAll('tbody tr');
    for (var i in content) {
        var lineContent = [];
        for (var k in content[i].children) {
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
/**
 * 清除现有页面并加载新页面
 */
function renderNewPage(theData) {
    var html = $('html');
    var length = html.childElementCount;
    for (var i = 0; i <= length; i++) {
        html.removeChild(html.childNodes[0]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('/content.html'), true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var login_page_src = xhr.responseText;
            $('html').innerHTML = login_page_src;
            renderNav();
            renderGrade();
            renderCourse(); //渲染课程表
        }
    };
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<渲染导航栏>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
function renderNav() {
    var ul = $('#nav ul');
    ul.onclick = function (e) {
        if (e.target.nodeName == 'UL') {
            return null;
        }
        var blocks = ['grade-block', 'class-block', 'exam-block', 'other-block'];
        for (var i in ul.children) {
            var li = ul.children[i];
            if (li.className == 'nav-li-active') {
                li.classList.toggle('nav-li-active');
            }
        }
        e.target.className = 'nav-li-active';
        window.scrollTo(0, $('#' + blocks[indexOf(e.target)]).offsetTop - 50);
    };
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<渲染成绩模块>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
function renderGrade() {
    var initTimes = 0; //用于控制请求的发出次数，超出后则停止发出请求
    try {
        getGradeSource();
    } catch (e) {
        if (initTimes++ < 4) {
            setTimeout(getGradeSource(), 1000);
        }; //请求三次
        console.log("重试次数：" + initTimes);
    }
    /**
     * 异步加载原始数据
     */
    function getGradeSource() {
        ajax({
            method: 'GET',
            url: 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR',
            async: true,
            handler: function handler(response) {
                var div = document.createElement('div');
                div.innerHTML = response;
                var data = {
                    intro: parseTableData(div.querySelector('table')),
                    detail: parseTableData(div.querySelectorAll('table')[1])
                }; //获取源数据
                data = sumDataFormater(data); //格式化源数据
                renderGradePart(data); //渲染成绩模块
                renderRestudyPart(data); //渲染重修建议
            }
        });
    }

    /**
     * 渲染成绩模块
     * @param data：成绩数据
     */
    function renderGradePart(data) {
        if (!data) {
            console.log('解析数据出错！');
            return null;
        }
        //用于渲染综述部分的三个饼图
        var setChart = function setChart(name, title, option, flag) {
            var chart = echarts.init($(name + ' #chart'), 'macarons');
            chart.setOption(option);
            var value = $(name + ' #value');
            value.innerText = data.sum.sum[flag];
            var titleNode = $(name + ' #title');
            titleNode.innerText = title;
        };
        //下面开始设置综合的三大块
        var option1 = {
            tooltip: {
                show: true
            },
            series: [{
                type: 'pie',
                radius: ['50%', '80%'],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                hoverAnimation: false,
                data: data.sum.detail.gpa
            }]
        };
        var option2 = {
            tooltip: {
                show: true
            },
            series: [{
                type: 'pie',
                radius: ['50%', '80%'],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                hoverAnimation: false,
                data: data.sum.detail.aver
            }]
        };
        var option3 = {
            tooltip: {
                show: true
            },
            series: [{
                type: 'pie',
                radius: ['50%', '80%'],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                hoverAnimation: false,
                data: data.sum.detail.study
            }]
        };
        setChart('#gpa-sum', 'GPA', option1, 'gpa');
        setChart('#aver-grade', '平均分', option2, 'aver');
        setChart('#study-grade', '总学分', option3, 'study');

        //下面开始设置成绩趋势曲线
        var chart4 = echarts.init($('#chart-2'), 'macarons');
        var option4 = {
            title: {
                show: true,
                text: '成绩趋势图',
                right: '5',
                textStyle: {
                    color: '#000',
                    fontSize: 16
                }
            },
            legend: {
                data: ['GPA', '平均分'],
                left: '5',
                top: '5'
            },
            grid: {
                bottom: 25,
                top: 25,
                left: 0,
                right: 0,
                show: false
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: [{
                type: 'category',
                data: data.eachYear.year,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                min: 1.5,
                max: 4,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisLabel: {
                    show: false
                }
            }, {
                type: 'value',
                min: 50,
                max: 100,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisLabel: {
                    show: false
                }
            }],
            series: [{
                name: 'GPA',
                type: 'line',
                hoverAnimation: false,
                data: data.eachYear.gpa,
                yAxisIndex: 0
            }, {
                name: '平均分',
                type: 'line',
                hoverAnimation: false,
                data: data.eachYear.aver,
                yAxisIndex: 1
            }]
        };
        chart4.setOption(option4);
        chart4.hideLoading();

        //渲染选择器模块
        var selector = $('#detail-selector ul');
        var setDetailChart = function setDetailChart(index) {
            /**
             * 设置详细分数图表的配置项
             */
            if (!index) index = 0;
            var chart = echarts.init($('#detail-chart'), 'macarons');
            var curData = data.detail[index];
            var option = {
                grid: {
                    left: '30',
                    right: '30'
                },
                legend: {
                    data: ['成绩', 'GPA'],
                    left: '25',
                    top: '0'
                },
                title: {
                    text: curData.year + '学期成绩分布图',
                    right: '25',
                    top: '0',
                    textStyle: {
                        fontSize: '16',
                        color: '#000'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: curData.subject,
                    axisLabel: {
                        textStyle: {
                            fontSize: '10'
                        },
                        formatter: function formatter(value) {
                            if (value.length > 4) {
                                return value.match(/.{0,3}/) + '...';
                            } else {
                                return value;
                            }
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    max: 100,
                    min: 40
                }, {
                    type: 'value',
                    max: 4.0,
                    min: 1.0
                }],
                series: [{
                    name: '成绩',
                    type: 'bar',
                    data: curData.grade,
                    yAxisIndex: 0,
                    markLine: {
                        symbol: '',
                        lineStyle: {
                            normal: {
                                width: 2,
                                type: 'solid'
                            }
                        },
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                            yAxis: 85,
                            name: '优秀线',
                            lineStyle: {
                                normal: {
                                    color: '#72e480',
                                    opacity: 0.5,
                                    type: 'dotted'
                                }
                            }
                        }, {
                            yAxis: 60,
                            name: '及格线',
                            lineStyle: {
                                normal: {
                                    color: '#ef5a5a',
                                    opacity: 0.5,
                                    type: 'dotted'
                                }
                            }
                        }]
                    }
                }, {
                    name: 'GPA',
                    type: 'bar',
                    data: curData.gpa,
                    yAxisIndex: 1
                }]
            };
            chart.hideLoading();
            chart.setOption(option);
        };
        for (var i in data.detail) {
            var li = document.createElement('li');
            li.innerText = data.detail[i].year;
            selector.appendChild(li);
        }
        $('#detail-selector').style.width = 109 * data.detail.length + 'px'; // 选择器的宽度
        $('#detail-selector ul').onclick = function (e) {
            var ul = $('#detail-selector ul');
            for (var i in ul.children) {
                var li = ul.children[i];
                if (li.className == 'detail-li-active') {
                    li.classList.toggle('detail-li-active');
                }
            }

            e.target.className = 'detail-li-active';
            setDetailChart(indexOf(e.target));
        };
        $('#detail-selector ul').children.className = 'detail-li-active';
        setDetailChart(0);
    }
    /**
     * 将原始数据转换为可用的图表数据
     */
    function sumDataFormater(sourceData) {
        //console.log(sourceData);
        var data = {
            sum: {
                sum: {
                    gpa: 0,
                    aver: 0,
                    study: 0
                },
                detail: {
                    year: [],
                    gpa: [],
                    aver: [],
                    study: []
                }
            },
            eachYear: {
                year: [],
                aver: [],
                gpa: []
            },
            detail: []
        };
        /**
         * 归档data.sum的sum部分
         */
        var length = sourceData.intro.tableContent.length;
        data.sum.sum.gpa = sourceData.intro.tableContent[length - 2][3];
        data.sum.sum.study = sourceData.intro.tableContent[length - 2][2];
        for (var i in sourceData.detail.tableContent) {
            var point = parseFloat(sourceData.detail.tableContent[i][5]);
            var grade = sourceData.detail.tableContent[i][sourceData.detail.tableContent[i].length - 1];
            if (grade.trim() == '通过') {
                grade = 85;
            } else {
                grade = isFinite(parseFloat(grade)) ? parseFloat(grade) : 60;
            }
            data.sum.sum.aver += grade / parseFloat(data.sum.sum.study) * point;
        };
        data.sum.sum.aver = data.sum.sum.aver.toFixed(2);

        /**
         * 提取年份
         */
        var tmpYear = {};
        for (var i in sourceData.intro.tableContent) {
            var tmp = sourceData.intro.tableContent[i];
            if (tmp.length == 5) {
                tmpYear[tmp[0] + '-' + tmp[1]] = [];
            }
        }
        for (var i in sourceData.intro.tableContent) {
            var tmp = sourceData.intro.tableContent[i];
            if (tmp.length == 5) {
                tmpYear[tmp[0] + '-' + tmp[1]] = [tmp[3], tmp[4]];
            }
        }
        /**
         * 提取每学期详细分数
         */
        var tmpData = {};
        for (var i in sourceData.detail.tableContent) {
            var tmp = sourceData.detail.tableContent[i];
            tmpData[tmp[0].replace(/\s/, '-')] = []; //初始化
        }
        for (var i in sourceData.detail.tableContent) {
            var tmp = sourceData.detail.tableContent[i];
            var className = tmp[3].trim();
            var classPoint = tmp[5].trim();
            var classGrade = tmp[tmp.length - 1].trim();
            if (isNaN(parseFloat(classGrade))) {
                classGrade = classGrade == '通过' ? 85 : 45;
            }
            tmpData[tmp[0].replace(/\s/, '-')].push([className, classPoint, classGrade]);
        }

        for (var i in tmpData) {
            /**
             * 计算每学期的平均分，暂存入tmpYear
             */
            var aver = 0;
            var gpa_sum = 0;
            for (var k in tmpData[i]) {
                var tmp = tmpData[i][k];
                gpa_sum += parseFloat(tmp[1]);
            }
            for (var k in tmpData[i]) {
                var tmp = tmpData[i][k];
                aver += parseFloat(tmp[1]) / gpa_sum * parseFloat(tmp[2]);
            }
            aver = aver.toFixed(2);
            tmpYear[i].push(aver);
        }
        /**
         * 将数字转换为汉字，并将年份排序
         */
        var strReplace = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];
        var chYear = [];
        for (var i in tmpYear) {
            chYear.push(i);
            chYear = chYear.sort();
        }

        for (var i in chYear) {
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
            var tmp = {
                year: '',
                subject: [],
                grade: [],
                gpa: [],
                credit: []
            };
            for (var k in tmpData[chYear[i]]) {
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
}

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<渲染重修建议列表>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
function renderRestudyPart(data) {
    /**
     * @param data：成绩数据
     * @description 处理建议重修模块的数据，算法是用GPA与满绩的差值乘以该门课的学分，
     *              分值越大越值得重修
     */
    if (!data) {
        console.log('data有问题！');
        return null;
    }

    var res = []; //用于存放结果数据
    data = data.detail;
    data.forEach(function (array) {
        for (var i in array.credit) {
            var studyInfo = {
                value: 0,
                name: array.subject[i] //课程名称
            };
            studyInfo.value = ((4 - parseFloat(array.gpa[i])) * parseFloat(array.credit[i])).toFixed(2);
            if (studyInfo.value > 0) {
                res.push(studyInfo); //剔除为0值
            }
        }
    });
    res.sort(function (a, b) {
        return parseFloat(a.value) < parseFloat(b.value) ? 1 : -1;
    }); //将res降序排序
    res = res.slice(0, 10); //截取前十个
    var restudyChart = echarts.init($('#restudy-chart'), 'macarons');
    var restudyOptions = {
        grid: {
            left: '30',
            right: '30',
            bottom: '10',
            top: '10'
        },
        tooltip: {
            trigger: 'yxis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [{
            type: 'value',
            position: 'top',
            show: false
        }],
        yAxis: [{
            type: 'category',
            inverse: true,
            data: function () {
                var data = [];
                res.forEach(function (i) {
                    data.push(i.name);
                });
                return data; //获取科目名称
            }(),
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            }
        }],
        series: [{
            name: '重修指数',
            type: 'bar',
            barMaxWidth: 30,
            barMinHeight: 30,
            data: function () {
                var data = [];
                res.forEach(function (i) {
                    data.push(i.value);
                });
                return data; //获取重修指数
            }(),
            itemStyle: {
                normal: {
                    color: 'rgb(239, 90, 90)'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'insideLeft',
                    formatter: ' {b}',
                    textStyle: {
                        fontSize: 14
                    }
                }
            }
        }]
    };
    restudyChart.setOption(restudyOptions);
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<渲染课表>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

function timeTable() {
    this.data = {};
    this.requestTmp = 0;
    this.init();
}
timeTable.prototype = {
    init: function init() {
        /**
         * 获取初始数据
         */
        var func = this;
        this.data.originalTable = document.querySelector('#course-table').innerHTML; //保存课程表的初始状态
        var timeStamp = new Date().getTime(); //获取时间戳
        var url = 'http://eams.uestc.edu.cn/eams/courseTableForStd.action?_=' + timeStamp;
        ajax({
            method: 'GET',
            url: url,
            handler: function handler(res) {
                if (res) {
                    func.step1(res);
                }
            }
        });
    },
    step1: function step1(sourceText) {
        /**
         * 继续获取下一步数据
         */
        var func = this;
        var tmp = sourceText.match(/jQuery.*searchTable/)[0].split('.');
        this.data.tagId = tmp[0].match(/semester.*Semester/)[0];
        this.data.ids = sourceText.match(/ids.*\)/)[0].match(/\d+/)[0];
        this.data.value = tmp[1].match(/value\:\"(\d*)/)[1];
        var url = 'http://eams.uestc.edu.cn/eams/dataQuery.action?tagId=' + this.data.tagId + '&dataType=semesterCalendar&value=' + this.data.value + '&empty=false';
        ajax({
            method: 'GET',
            url: url,
            handler: function handler(res) {
                func.step2(res);
            }
        });
    },
    step2: function step2(sourceData) {
        /**
         * 为获取课程表数据做准备
         */
        var tmp = eval('(' + sourceData + ')').semesters;
        var semester = {};
        for (var i in tmp) {
            var v = tmp[i];
            var year = v[0].schoolYear.split('-')[0];
            semester[year] = {};
            v.forEach(function (value, index) {
                semester[year][index.toString()] = value.id;
            });
            // debugger;
        }
        this.data.semesters = semester;
        this.renderDropdown();
        this.renderExamPart();
    },
    getSourceTable: function getSourceTable(semester) {
        /**
         * 封装ajax方法，用来获取课程表的源数据
         */
        var url = 'http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=' + semester + '&ids=' + this.data.ids;
        var func = this;
        // debugger;
        ajax({
            method: 'GET',
            url: url,
            handler: function (res) {
                var tmp = JSON.stringify(res).match(/activity = new TaskActivity.*activity/g)[0].split('activity =');
                var data = [];
                tmp.forEach(function (value) {
                    if (value.length) {
                        var info = value.match(/TaskActivity\((.*)\)/)[1].replace(/\,/g, '').split('\\\"'); //获取每个课程的详细信息
                        var tmpTime = value.match(/index =.*?\;/g); //获取每节课的排课时间
                        var time = [];
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
                this.data.course = data;
                func.renderCourseTable();
            }.bind(func)
        });
    },
    timeStringParser: function timeStringParser(str) {
        /**
         * 解析排课的字符串，转化为人类可读的文字
         * str是长度为53的源字符串
         */
        //if (str.length != 53) return null;
        var res = [];
        var matchFullWeek = new RegExp(/1{2,}/g); //匹配连续周
        var matchSingleWeek = new RegExp(/(10){2,}/g); //匹配奇偶周
        var matchStr = function matchStr(pattern, str) {
            //获取str中匹配pattern的所有字串
            var tmpRes = [];
            var tmp = null;
            var tmpStr = str;
            var getZeroStr = function getZeroStr(num) {
                /**
                 * 获取num个0
                 */
                var zeros = '';
                while (num-- > 0) {
                    zeros += '0';
                }
                return zeros;
            };
            while (true) {
                tmp = pattern.exec(tmpStr);
                if (tmp) {
                    tmpRes.push(tmp);
                    tmpStr = tmpStr.replace(tmp[0], getZeroStr(tmp[0].length)); //将匹配到的字串位置清零
                } else {
                    break;
                }
            }
            return [tmpRes, tmpStr];
        };
        var fullWeek = matchStr(matchFullWeek, str);
        var singleWeek = matchStr(matchSingleWeek, fullWeek[1]);
        fullWeek[0].forEach(function (v) {
            var startWeek = v.index;
            var endWeek = v.index + v[0].length - 1;
            res.push(startWeek + '-' + endWeek + '周'); //处理连续周
        });
        singleWeek[0].forEach(function (v) {
            var startWeek = v.index;
            var endWeek = v.index + v[0].length - 1;
            var attr = startWeek % 2 ? '单' : '双';
            res.push(startWeek + '-' + endWeek + attr + '周'); //处理奇偶周
        });
        res.push(function () {
            var tmp = singleWeek[1].split('').map(function (v, i) {
                return v == '1' ? i : 0; //得到单周的索引
            }).filter(function (v) {
                return v != 0; //剔除无效值
            }).join('/');
            return tmp.length ? tmp + '周' : null; //加壳处理
        }()); //处理单周

        return res.filter(function (v) {
            return isFinite(parseInt(v)); //剔除无效值
        });
    },
    renderCourseTable: function renderCourseTable() {
        var getCourseBox = function getCourseBox(x, y) {
            /**
             * x => 星期几
             * y => 第几节课
             */
            x = parseInt(x);
            y = parseInt(y);
            return $('#course-table').children[0].children[x].children[y];
        };
        $('#course-table').innerHTML = this.data.originalTable;
        this.data.course.forEach(function (v) {
            var day = parseInt(v.time[0][0]) + 1;
            var time = v.time[0][1];
            parseInt(time) % 2 ? null : time = parseInt(time) / 2 + 1;
            var node = getCourseBox(day, time);
            if (node.dataset.hasCourse != '1') {
                var virtualNode = createNode('div', 'course-box');
                var courseName = v.courseName.length > 10 ? v.courseName.substr(0, 9) + '...' : v.courseName;
                virtualNode.innerHTML = '\
                    <div class="title" title="' + v.courseName + '">' + courseName + '\
                    </div>\
                    <div class="info">\
                        <span>' + v.teacher + '</span><span>' + v.courseId + '</span>\
                    </div>\
                    <div class="detail-info">\
                    </div>';
                node.appendChild(virtualNode);
                node.dataset.hasCourse = '1';
            }
            var infoNode = createNode('div', 'detail-info-line');
            var room = v.room.length > 12 ? v.room.substr(0, 11) + '...' : v.room;
            room = room.replace('-', '');
            infoNode.innerHTML = '\
                    <div class="detail-room" title="' + v.room + '">' + room + '</div>\
                    <div class="detail-date">' + v.date.join('，') + '</div>';
            node.querySelector('.detail-info').appendChild(infoNode);
        });
    },
    renderDropdown: function renderDropdown() {
        /**
         * 渲染下拉列表，写的稀烂，懒得改了
         */
        var func = this;
        var node = $('#course-dropdown').querySelector('ul');
        var startYear = null;
        var curYear = new Date().getFullYear();
        var curStudyYear = new Date().getMonth() >= 7 ? 1 : 2;
        var ids = [];
        var keyMap = ['大一', '大二', '大三', '大四'];

        chrome.storage.local.get('studyYear', function (data) {
            startYear = data['studyYear'];
            startYear = parseInt(startYear);
            for (var i = startYear; i < curYear; i++) {
                ids.push({
                    name: keyMap[i - startYear] + '上',
                    id: func.data.semesters[i][0]
                });
                if (i == curYear && curStudyYear == 2) continue; //第二学期没有排课
                ids.push({
                    name: keyMap[i - startYear] + '下',
                    id: func.data.semesters[i][1]
                });
            }
            for (var i in ids) {
                var num = i;
                i = ids[i];
                var li = createNode('li');
                li.innerHTML = i.name;
                li.dataset.id = i.id;
                li.dataset.order = num;
                node.appendChild(li);
            }
            node.onclick = function (e) {
                if (this.dataset.open == '1') {
                    if (e.target.dataset.id) {
                        var len = e.target.clientHeight;
                        this.style.top = '-' + e.target.dataset.order * parseInt(len) + 'px';
                        func.getSourceTable(e.target.dataset.id);
                        this.parentNode.classList.remove('dropdown-show');
                        this.dataset.open = '0';
                    }
                } else {
                    this.parentNode.classList.add('dropdown-show');
                    this.dataset.open = '1';
                }
            };
            node.lastChild.click();
            node.lastChild.click(); //模拟点击最后一个，默认显示最新的课程表
        });
    },
    renderExamPart: function renderExamPart() {
        var func = this;
        var curYear = new Date().getFullYear();
        //curYear = 2015;
        var curStudyYear = new Date().getMonth() >= 7 ? 1 : 2;
        //curStudyYear = 2;
        var id = func.data.semesters[curYear][curStudyYear];
        if (id == undefined) {
            id = func.data.semesters[curYear][1];
        }
        var getData = function getData(examType, lastData) {
            var data = lastData;
            if (examType < 5) {
                //要取回所有的数据，其实examType是查询的考试类型1,2,3,4代表了期末|期中|补考|缓考
                // console.log(id);
                ajax({
                    method: 'GET',
                    url: 'http://eams.uestc.edu.cn/eams/stdExamTable!examTable.action?examType.id=' + examType + '&semester.id=' + id,
                    handler: function handler(res) {
                        var node = createNode('div');
                        node.innerHTML = res;
                        data.push(node.querySelector('table').children[0]);

                        getData(++examType, data);
                    }
                });
            } else {
                render(parseData(data));
            }
        };
        var parseData = function parseData(data) {
            var res = [];
            data.forEach(function (v, index) {
                var nodes = v.children;
                if (nodes.length == 1) return null;
                for (var i = 1; i < nodes.length - 1; i++) {
                    var node = nodes[i];
                    if (node.children.length == 8) {
                        var tmp = node.children;
                        res.push({
                            name: tmp[1].innerHTML,
                            date: tmp[2].innerHTML,
                            detail: tmp[3].innerHTML,
                            address: tmp[4].innerHTML,
                            num: tmp[5].innerHTML,
                            status: tmp[6].innerHTML,
                            type: index + 1
                        });
                    }
                }
            });
            return res;
        };
        var render = function render(examdata) {
            var finalData = examdata.sort(function (a, b) {
                return new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1;
            }); //将数据按照时间排序
            var typeMap = {
                '1': '期末考试',
                '2': '期中考试',
                '3': '补考',
                '4': '缓考'
            };
            if (finalData.length) {
                finalData.forEach(function (v) {
                    var node = createNode('tr');
                    node.innerHTML = '<td><span class="exam-date">' + v.date + '</span></td>\
                        <td class="exam-line">\
                            <div class="exam-box">\
                                <div class="exam-name">' + v.name + '<span class="exam-type-' + v.type + '">' + typeMap[v.type] + '</span></div>\
                                <div class="exam-detail">' + v.detail.replace(/\(.*\)/, '') + '</div>\
                                <div class="exam-address">' + v.address.replace('-', '') + ' - ' + v.num + '号</div>\
                            </div>\
                        </td>';
                    $('#exam-table').appendChild(node);
                });
            } else {
                var node = createNode('p', 'blank-tips');
                node.innerHTML = '- 说出来你可能不信，最近居然没有考试 -';
                $('#exam-block').appendChild(node);
            }
        };
        getData(1, []);
    }
};

function renderCourse() {
    setTimeout(function () {
        new timeTable(); //立即发出请求会出错
    }, 1000);
}