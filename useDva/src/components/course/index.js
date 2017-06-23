const React = require('react');
const func = require('./handle');
const CourseTable = require('./components/CourseTable.jsx');

require('./style.less');
require('./fonts/style.css');

class myReact extends React.Component {
  constructor() {
    super();
    this.state = {
      commonData: {},
      getCourseData: () => {},
      course: []
    };
  }
  componentDidMount() {
    const me = this;
    func().then(res => {
      me.setState({
        commonData: res.commonData,
        getCourseData: res.getCourseData
      });
      res.getCourseData(143, res.commonData.basicData.ids).then(res => {
        me.setState({
          course: res
        });
      });
    });
  }
  render() {
    return (
      <div>
        <div className="course-header">
          <div className="course-title">三年级下学期课程表</div>
        </div>
        <CourseTable course={this.state.course}></CourseTable>
      </div>
    );
  }
}

module.exports = myReact;