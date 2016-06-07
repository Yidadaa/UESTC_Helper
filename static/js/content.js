function $(name) {
    return document.querySelector(name);
}
function getSource() {

}
function renderGradePart(data) {
    /**
     * 渲染“成绩”模块
     */
    data = {
        sum: {
            gpa: 3.3,
            aver: 80,
            study: 45
        },
        eachYear:
        {
            year: ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'],
            aver: [77, 87, 80, 67, 74, 87, 78, 76],
            gpa: [3.3, 3.5, 3.0, 2.8, 3.5, 3.6, 3.3, 3.5]
        },
        detail: [{
            year: "大一上",
            subject: ['篮球', '优秀个人', '大学物理', '学术英语'],
            grade: [95, , 90, 79, 81],
            gpa: [4, 4, 3.4, 3.6]
        }]
    }

    var setChart = function (name, title, data) {
        var chart = echarts.init($(name + ' #chart'), 'macarons');
        chart.setOption(data);
        var value = $(name + ' #value');
        value.innerText = data.series[0].data[0].value;
        var titleNode = $(name + ' #title');
        titleNode.innerText = title;
    }
    //下面开始设置综合的三大块
    var option1 = {
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
                data: [
                    {
                        value: data.sum.gpa,
                        itemStyle: {
                            normal: {
                                color: '#5ab1ef'
                            }
                        }
                    },
                    {
                        value: 4 - data.sum.gpa,
                    }
                ]
            }
        ]
    };
    var option2 = {
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
                data: [
                    { value: data.sum.aver },
                    { value: 100 - data.sum.aver }
                ]
            }
        ]
    };
    var option3 = {
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
                data: [
                    {
                        value: data.sum.gpa,
                        itemStyle: {
                            normal: {
                                color: '#d87a80'
                            }
                        }
                    },
                    {
                        value: 4 - data.sum.gpa,
                    }
                ]
            }
        ]
    };
    setChart('#gpa-sum', 'GPA', option1);
    setChart('#aver-grade', '平均分', option2);
    setChart('#study-grade', '总学分', option3);

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


}
renderGradePart();