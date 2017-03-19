/**
 * @file 成绩单 - 表格组件
 * @desc 用来展示各个学年成绩的详细信息
 */
const Table = require('antd/lib/table');
const Tooltip = require('antd/lib/tooltip');
const React = require('react');

class tableChart extends React.Component {
    constructor() {
        super();
        this.defaultProps = {
            credit: [],
            gpa: [],
            grade: [],
            subject: []
        };
    }
    render() {
        const dataSource = this.props.hasOwnProperty('subject') ? this.props.subject.map((v, i) => {
            return {
                key: i,
                credit: this.props.credit[i],
                gpa: this.props.gpa[i],
                grade: this.props.grade[i],
                subject: this.props.subject[i],
                chart: {
                    gpa: this.props.gpa[i],
                    grade: this.props.grade[i]
                },
                restudy: ((4.0 - parseFloat(this.props.gpa[i]) - parseFloat(this.props.grade[i] / 100) + 1) * this.props.credit[i]).toFixed(2)
            };
        }) : [];
        const columns = [{
            title: '科目',
            dataIndex: 'subject',
            key: 'subject'
        }, {
            title: '学分',
            dataIndex: 'credit',
            key: 'credit',
            sorter: (a, b) => {
                return a.credit - b.credit;
            }
        }, {
            title: '成绩',
            dataIndex: 'grade',
            key: 'grade',
            sorter: (a, b) => {
                return a.grade - b.grade;
            }
        }, {
            title: '绩点',
            dataIndex: 'gpa',
            sorter: (a, b) => {
                return a.gpa - b.gpa;
            }
        }, {
            title: '重修指数',
            dataIndex: 'restudy',
            sorter: (a, b) => {
                return a.restudy - b.restudy;
            }
        }, {
            title: '展示',
            dataIndex: 'chart',
            width: 300,
            render: (param) => {
                let gradeLineConfig = {
                    style: {
                        height: '5px',
                        width: `${param.grade * 2}px`
                    },
                    className: 'table-line-grade'
                };
                let gpaLineConfig = {
                    style: {
                        height: '5px',
                        width: `${param.gpa / 4 * 200}px`
                    },
                    className: 'table-line-gpa'
                };
                let tip = `绩点:${param.gpa} 成绩:${param.grade}`;
                return (
                    <Tooltip title={tip}>
                        <div {...gradeLineConfig}></div>
                        <div {...gpaLineConfig}></div>
                    </Tooltip>
                );
            }
        }];
        const tableConfig = {
            dataSource,
            columns,
            pagination: false
        };

        return (
            <Table {...tableConfig}/>
        );
    }
}

module.exports = tableChart;