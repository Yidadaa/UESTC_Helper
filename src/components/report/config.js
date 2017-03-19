/**
 * @file 各种配置项
 */
const chartConfig = (data) => {
    return { // 三个小图标的配置项
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
            data: data
        }]
    };
};

const lineChartConfig = data => {
    return { // 成绩趋势图的配置
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
            yAxisIndex: 0,
            smooth: true
        }, {
            name: '平均分',
            type: 'line',
            hoverAnimation: false,
            data: data.eachYear.aver,
            yAxisIndex: 1,
            smooth: true
        }]
    };
};
module.exports = {
    chartConfig,
    lineChartConfig
};