console.clear();
renderNewPage(); //渲染成绩模块

/**
 * 获取子元素的索引
 */
function getIndex(node) {
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
function getTableData(table) {
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
            //renderCourseList();
        }
    }
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
        window.scrollTo(0, $('#' + blocks[getIndex(e.target)]).offsetTop - 50);
    }
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<渲染成绩模块>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
function renderGrade() {
    var initTimes = 0; //用于控制请求的发出次数，超出后则停止发出请求
    getGradeSource();
    /**
     * 异步加载原始数据
     */
    function getGradeSource() {
        ajax({
            method: 'GET',
            url: 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR',
            async: true,
            handler: function (response) {
                var div = document.createElement('div');
                div.innerHTML = response;
                try {
                    var data = {
                        intro: getTableData(div.querySelector('table')),
                        detail: getTableData(div.querySelectorAll('table')[1])
                    }; //获取源数据
                } catch (e) {
                    if (initTimes++ < 4) getGradeSource(); //请求三次
                    console.log("重试次数：" + initTimes);
                }
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
        console.log(data);
        if (!data) {
            console.log('解析数据出错！');
            return null;
        }
        //用于渲染综述部分的三个饼图
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
        }
        chart4.setOption(option4);
        chart4.hideLoading();

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
                xAxis: [{
                    type: 'category',
                    data: curData.subject,
                    axisLabel: {
                        textStyle: {
                            fontSize: '10'
                        },
                        formatter: function (value) {
                            if (value.length > 4) {
                                return value.match(/.{0,4}/) + '...';
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
                }, {
                    name: 'GPA',
                    type: 'bar',
                    data: curData.gpa,
                    yAxisIndex: 1,
                }]
            }
            chart.hideLoading();
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
        var length = sourceData.intro.tableContent.length;
        data.sum.sum.gpa = sourceData.intro.tableContent[length - 2][3];
        data.sum.sum.study = sourceData.intro.tableContent[length - 2][2];
        for (var i in sourceData.detail.tableContent) {
            data.sum.sum.aver += parseFloat(sourceData.detail.tableContent[i][5]) / parseFloat(data.sum.sum.study) * parseFloat(sourceData.detail.tableContent[i][sourceData.detail.tableContent[i].length - 1]);
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
            tmpData[tmp[0].replace(/\s/, '-')].push([tmp[3], tmp[5], tmp[tmp.length - 1]]);
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
                    return parseFloat((((x > 85 ? x = 85 : x) - 60) * 0.1).toFixed(1)) + parseFloat(1.5);
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
            bottom: '10'
        },
        title: {
            text: '重修排行榜',
            x: 'center',
            textStyle: {
                fontSize: '20',
                color: '#000'
            }
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
            data: (function () {
                var data = [];
                res.forEach(function (i) {
                    data.push(i.name);
                })
                return data; //获取科目名称
            })(),
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
            data: (function () {
                var data = [];
                res.forEach(function (i) {
                    data.push(i.value);
                })
                return data; //获取重修指数
            })(),
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
    this.init();
}
timeTable.prototype = {
    init: function () {
        /**
         * 获取初始数据
         */
        var func = this;
        var timeStamp = new Date().getTime(); //获取时间戳
        var url = 'http://eams.uestc.edu.cn/eams/courseTableForStd.action?_=' + timeStamp;
        ajax({
            method: 'GET',
            url: url,
            handler: function (res) {
                if (res) {
                    func.step1(res);
                }
            }
        });
    },
    step1: function (sourceText) {
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
            handler: function (res) {
                func.step2(res);
            }
        });
    },
    step2: function (sourceData) {
        /**
         * 为获取课程表数据做准备
         */
        var tmp = eval('(' + sourceData + ')').semesters;
        this.getSourceTable(84);
    },
    getSourceTable: function (semester) {
        /**
         * 封装ajax方法，用来获取课程表的源数据
         */
        var url = 'http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=' + semester + '&ids=' + this.data.ids;
        ajax({
            method: 'GET',
            url: url,
            handler: function (res) {
                var tmp = JSON.stringify(res).match(/activity = new TaskActivity.*activity/g)[0].split('activity =');
                var data = [];
                tmp.forEach(function (value) {
                    if (value.length) {
                        var info = value.match(/TaskActivity\((.*)\)/)[1].replace(/\,/g,'').split('\\\"');//获取每个课程的详细信息
                        var tmpTime = value.match(/index =.*?\;/g);//获取每节课的排课时间
                        var time = [];
                        tmpTime.forEach(function(v){
                            time.push(v.match(/\d/g));
                        });
                        data.push({info, time});
                    }
                });
                debugger;
            }
        });
    }
}

var tmp = new timeTable(); //渲染课表