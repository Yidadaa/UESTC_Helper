function $(name) {
    if (name) return document.querySelector(name);
}
function $$(name) {
    return document.querySelectorAll(name);
}
function clearAll() {
    /**
     * 清除现有页面
     */
    var html = $('html');
    var length = html.childElementCount;
    for (var i = 0; i <= length; i++) {
        html.removeChild(html.childNodes[0]);
    }
}
function newPage(theData) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('/content.html'), true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var login_page_src = xhr.responseText;
            $('html').innerHTML = login_page_src;
            var source = getGradeSource();
            //var data = {intro: getData($('table')),detail: getData($$('table')[1])}
            data = sumDataFormater(data);

            renderNav();
            renderGradePart(data);
        }
    }
}
function getIndex(node) {
    var parent = node.parentNode;

    for (var i in parent.children) {
        if (parent.children[i] == node) {
            return i;
        }
    }

    return null;
}
function getGradeSource() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR', true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.status == 4) {
            var div = document.createElement('div');
            div.innerHTML = xhr.responseText;
            return div;
        }
    }
}
/**
 * 处理导航栏
 */
function renderNav() {
    var ul = $('#nav ul');
    ul.onclick = function (e) {
        if (e.target.nodeName == 'UL') { return null; }
        var blocks = ['grade-block', 'class-block', 'exam-block', 'other-block'];
        for (var i in ul.children) {
            var li = ul.children[i];
            if (li.className == 'nav-li-active') {
                li.classList.toggle('nav-li-active');
            }
        }
        e.target.className = 'nav-li-active';
        window.scrollTo(0, $('#' + blocks[getIndex(e.target)]).offsetTop - 50);
    }
}
/**
 * 渲染成绩模块
 * @param data：成绩数据
 */
function renderGradePart(data) {
    if (!data) {
        data = {
            sum: {
                sum: {
                    gpa: 3.4,
                    aver: 45,
                    study: 65
                },
                detail: {
                    year: [],
                    gpa: [{ value: 3, name: "2014" }, { value: 4, name: '20141' }, { value: 3.4, name: '2014-2015-2' }],
                    aver: [{ value: 76, name: "2014" }, { value: 84, name: '20141' }, { value: 73.4, name: '2014-2015-2' }],
                    study: [{ value: 23, name: "2014" }, { value: 14, name: '20141' }, { value: 34, name: '2014-2015-2' }],
                }
            },
            eachYear:
            {
                year: ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'],
                aver: ['77', 87, 80, 67, 74, 87, 78, 76],
                gpa: [3.3, 3.5, 3.0, 2.8, 3.5, 3.6, 3.3, 3.5]
            },
            detail: [{
                year: "大一上",
                subject: ['篮球', '优秀个人', '大学物理', '学术英语', '数分', '大学语文'],
                grade: [95, 90, 79, 81, 60, 69],
                gpa: [4, 4, 3.4, 3.6, 1.5, 2.4]
            }, {
                    year: "大一下",
                    subject: ['篮球', '优秀个人', '大学物理', '学术英语', '数分', '大学语文'],
                    grade: [85, 80, 69, 86, 64, 69],
                    gpa: [4, 4, 3.4, 3.6, 1.7, 2.4]
                }, {
                    year: "大二上",
                    subject: ['篮球', '优秀个人', '大学物理', '学术英语', '数分', '大学语文'],
                    grade: [95, 90, 79, 81, 60, 69],
                    gpa: [4, 4, 3.4, 3.6, 1.7, 2.4]
                }, {
                    year: "大二下",
                    subject: ['篮球', '优秀个人', '大学物理', '学术英语', '数分', '大学语文'],
                    grade: [95, 90, 79, 81, 60, 69],
                    gpa: [4, 4, 3.4, 3.6, 1.7, 2.4]
                }, {
                    year: "大三上",
                    subject: ['篮球', '优秀个人', '大学物理', '学术英语', '数分', '大学语文'],
                    grade: [95, 90, 79, 81, 60, 69],
                    gpa: [4, 4, 3.4, 3.6, 1.7, 2.4]
                }, {
                    year: "大三下",
                    subject: ['篮球', '优秀个人', '大学物理', '学术英语', '数分', '大学语文'],
                    grade: [95, 90, 79, 81, 60, 69],
                    gpa: [4, 4, 3.4, 3.6, 1.7, 2.4]
                }]
        }
    }

    var setChart = function (name, title, option, flag) {
        var chart = echarts.init($(name + ' #chart'), 'macarons');
        chart.setOption(option);
        var value = $(name + ' #value');
        value.innerText = data.sum.sum[flag];
        var titleNode = $(name + ' #title');
        titleNode.innerText = title;
    }
    //下面开始设置综合的三大块
    var option1 = {
        tooltip: {
            show: true
        },
        series: [
            {
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
            }
        ]
    };
    var option2 = {
        tooltip: {
            show: true
        },
        series: [
            {
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
            }
        ]
    };
    var option3 = {
        tooltip: {
            show: true
        },
        series: [
            {
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
            }
        ]
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
            axisPointer: { type: 'shadow' }
        },
        xAxis: [
            {
                type: 'category',
                data: data.eachYear.year,
                splitLine: { show: false },
                axisTick: { show: false },
                axisLine: {
                    lineStyle: { color: '#aaa' }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 1.5,
                max: 4,
                splitLine: { show: false },
                axisTick: { show: false },
                axisLine: {
                    show: false,
                    lineStyle: { color: '#aaa' }
                },
                axisLabel: {
                    show: false
                }
            },
            {
                type: 'value',
                min: 50,
                max: 100,
                splitLine: { show: false },
                axisTick: { show: false },
                splitArea: { show: false },
                axisLine: {
                    show: false,
                    lineStyle: { color: '#aaa' }
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        series: [
            {
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
            }
        ]
    }
    chart4.setOption(option4);

    //渲染选择器模块
    var selector = $('#detail-selector ul');
    var setDetailChart = function (index) {
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
            xAxis: [
                {
                    type: 'category',
                    data: curData.subject
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max: 100,
                    min: 50
                }, {
                    type: 'value',
                    max: 4.0,
                    min: 1.5
                }
            ],
            series: [
                {
                    name: '成绩',
                    type: 'bar',
                    data: curData.grade,
                    yAxisIndex: 0
                }, {
                    name: 'GPA',
                    type: 'bar',
                    data: curData.gpa,
                    yAxisIndex: 1
                }
            ]
        }

        chart.setOption(option);
    }
    for (var i in data.detail) {
        var li = document.createElement('li');
        li.innerText = data.detail[i].year;
        selector.appendChild(li);
    }
    $('#detail-selector').style.width = 108 * data.detail.length + 'px';
    $('#detail-selector ul').onclick = function (e) {
        var ul = $('#detail-selector ul');
        for (var i in ul.children) {
            var li = ul.children[i];
            if (li.className == 'detail-li-active') {
                li.classList.toggle('detail-li-active');
            }
        }

        e.target.className = 'detail-li-active';
        setDetailChart(getIndex(e.target));
    }
    $('#detail-selector ul').children[0].className = 'detail-li-active';
    setDetailChart(0);
}
/**
 * 获取解析table中的数据
 */
function getData(table) {
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
function sumDataFormater(sourceData) {
    /**
     * 将原始数据转换为可用的图表数据
     */
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
                study: [],
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
    data.sum.sum.gpa = sourceData.intro.tableContent[4][3];
    data.sum.sum.study = sourceData.intro.tableContent[4][2];
    for (var i in sourceData.detail.tableContent) {
        data.sum.sum.aver += parseFloat(sourceData.detail.tableContent[i][5]) / parseFloat(data.sum.sum.study) * parseFloat(sourceData.detail.tableContent[i][8]);
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
        tmpData[tmp[0].replace(/\s/, '-')] = [];//初始化
    }
    for (var i in sourceData.detail.tableContent) {
        var tmp = sourceData.detail.tableContent[i];
        tmpData[tmp[0].replace(/\s/, '-')].push([tmp[3], tmp[5], tmp[8]]);
    }

    for (var i in tmpData) {
        /**
         * 计算每学期的平均分，暂存入tmpYear
         */
        var aver = 0;
        for (var k in tmpData[i]) {
            var tmp = tmpData[i][k];
            aver += parseFloat(tmp[1]) / parseFloat(tmpYear[i][0]) * parseFloat(tmp[2]);
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
        data.sum.detail.study.push({ value: tmpYear[chYear[i]][0], name: strReplace[i] });
        data.sum.detail.gpa.push({ value: tmpYear[chYear[i]][1], name: strReplace[i] });
        data.sum.detail.aver.push({ value: tmpYear[chYear[i]][2], name: strReplace[i] });
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
            gpa: []
        };
        for (var k in tmpData[chYear[i]]) {
            tmp.year = strReplace[i];
            tmp.grade.push(tmpData[chYear[i]][k][2]);
            tmp.gpa.push(tmpData[chYear[i]][k][1]);
            tmp.subject.push(tmpData[chYear[i]][k][0]);
        }
        data.detail.push(tmp);
    }

    return data;
}

clearAll();
newPage();
