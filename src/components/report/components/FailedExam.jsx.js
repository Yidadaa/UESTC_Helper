/**
 * @file 成绩单 - 重修
 * @desc 重修排行榜，学渣-学霸值检验
 */
const React = require('react');
const Spin = require('antd/lib/spin');

module.exports = props => {
    const sourceData = props.allCourseData;
    let isLoading = sourceData.length == 0;
    let courses = [];
    sourceData.forEach(value => {
        courses = courses.concat(value.subject.map((v, i) => {
            return {
                subject: value.subject[i],
                gpa: value.gpa[i],
                grade: value.grade[i],
                credit: value.credit[i],
                weight: ((4.0 - parseFloat(value.gpa[i]) - parseFloat(value.grade[i]) / 100 + 1) * parseFloat(value.credit[i])).toFixed(2)
                // 重修指数：(4-gpa-(100-grade)/100)×学分
            };
        }));
    });
    const courseCount = courses.length; // 总科目数
    const excitedRate = parseFloat(courses.filter(v => v.gpa == 4).length / courseCount).toFixed(4) * 100; // 计算满绩率
    const top5 = courses.sort((a, b) => {return b.weight - a.weight;}).slice(0, 5);

    return (
        <Spin spinning={isLoading} tip="加载中...">
            <div id="failed-exam">
                <div className="failed-exam-header">
                    <span className="failed-exam-title">成绩组成分析</span>
                </div>
                <div className="failed-exam-content">
                    <div className="failed-exam-sum">
                        <div className="content">
                            <div className="rate">{excitedRate}</div>
                            <div className="tip">满绩占比</div>
                            <div className="text">* 满绩占比 = GPA为4的科目 / 全部科目。</div>
                            <div className="text">* 重修指数 = (4 - 绩点 + 1 - 成绩 / 100) * 学分</div>
                        </div>
                    </div>
                    <div className="failed-exams">
                        <div className="title">重修建议排行榜</div>
                        {top5.map((v, i) => {
                            return (<div className="failed-item" key={i}>
                                <span className="index">{i + 1}</span>
                                <span className="name">{v.subject}</span>
                                <span className="count">{v.weight}</span>
                            </div>);
                        })}
                    </div>
                </div>
            </div>
        </Spin>
    );
};