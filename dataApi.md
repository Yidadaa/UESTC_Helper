##原始请求
###大一上
2014000201010:ignoreHead=1&setting.kind=std&startWeek=1&project.id=1&semester.id=43&ids=134775
###大一下
2014000201010:ignoreHead=1&setting.kind=std&startWeek=1&project.id=1&semester.id=63&ids=134775
###大二上
2014000201010:ignoreHead=1&setting.kind=std&startWeek=1&semester.id=84&ids=134775
2014000201016:ignoreHead=1&setting.kind=std&startWeek=1&semester.id=84&ids=134781
###大二下
2014000201010:ignoreHead=1&setting.kind=std&startWeek=1&project.id=1&semester.id=103&ids=134775

###eams.uestc.edu.cn/eams/dataQuery.action
2014000201010:
2014000201016:tagId=semesterBar9459456391Semester&dataType=semesterCalendar&value=84&empty=false

**response**:
```json
{yearDom:"<tr><td class='calendar-bar-td-blankBorder' index='0'>2008-2009</td><td class='calendar-bar-td-blankBorder' index='1'>2009-2010</td><td class='calendar-bar-td-blankBorder' index='2'>2010-2011</td></tr><tr><td class='calendar-bar-td-blankBorder' index='3'>2011-2012</td><td class='calendar-bar-td-blankBorder' index='4'>2012-2013</td><td class='calendar-bar-td-blankBorder' index='5'>2013-2014</td></tr><tr><td class='calendar-bar-td-blankBorder' index='6'>2014-2015</td><td class='calendar-bar-td-blankBorder' index='7'>2015-2016</td><td class='calendar-bar-td-blankBorder' index='8'>2016-2017</td></tr>",termDom:"<tr><td class='calendar-bar-td-blankBorder' val='84'><span>1</span>学期</td></tr><tr><td class='calendar-bar-td-blankBorder' val='103'><span>2</span>学期</td></tr>",semesters:{y0:[{id:21,schoolYear:"2008-2009",name:"1"},{id:22,schoolYear:"2008-2009",name:"2"}],y1:[{id:19,schoolYear:"2009-2010",name:"1"},{id:20,schoolYear:"2009-2010",name:"2"}],y2:[{id:17,schoolYear:"2010-2011",name:"1"},{id:18,schoolYear:"2010-2011",name:"2"}],y3:[{id:15,schoolYear:"2011-2012",name:"1"},{id:16,schoolYear:"2011-2012",name:"2"}],y4:[{id:13,schoolYear:"2012-2013",name:"1"},{id:14,schoolYear:"2012-2013",name:"2"}],y5:[{id:1,schoolYear:"2013-2014",name:"1"},{id:2,schoolYear:"2013-2014",name:"2"}],y6:[{id:43,schoolYear:"2014-2015",name:"1"},{id:63,schoolYear:"2014-2015",name:"2"}],y7:[{id:84,schoolYear:"2015-2016",name:"1"},{id:103,schoolYear:"2015-2016",name:"2"}],y8:[{id:123,schoolYear:"2016-2017",name:"1"}]},yearIndex:"7",termIndex:"0",semesterId:"84"}

```
可以获取到：semester.id

###http://eams.uestc.edu.cn/eams/courseTableForStd.action?_=1465456078624
可以获取到dataQuery所需的参数:tagId,value以及ids

###http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action
把上面得到的参数都post到这个地址，就能获取课程表的原始数据了
然后用正则表达式匹配出所需数据，之后就是解析并格式化数据了。
