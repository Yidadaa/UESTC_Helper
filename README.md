## 插件官方网址  
插件所有功能的介绍请访问这个网址：
[电子科技大学教务系统美化插件](http://blog.simplenaive.cn/uestc_helper)  
> 本插件使用[WTFPL开源协议](https://en.wikipedia.org/wiki/WTFPL)，请诸君随意玩耍。

## 插件思路  
简单介绍一下插件的实现过程。  

### 插件中使用的库  
- [百度Echarts](http://echarts.baidu.com/)  

### 样式替换的实现  
由于最开始写这个插件时，作者刚接触前端，对 JS 的使用还并不熟悉，于是为了解决 cookie 的问题，决定直接在原网页上动刀，思路就是插件检测到用户在访问教务系统网页时，
直接遍历当前访问网页的 DOM 树，并移除所有子元素，此所谓清空原网页，然后从本地读取重新设计后的界面，加载到当前网页上，然后再对具体数据进行替换。  

插件主要改动了两个页面，一个是登录页，对应的本地模板文件是`./loginPage.html`；另一个是登录后的主页，对应文件是`./content.html`。

### 登录页的逻辑  
教务网站在2015年经历过一次改版，改版之前模拟登录只需要提交学号和密码就可以了，而改版之后还需要提交来自服务器的验证字符串，具体的可用审查元素功能在登录页上查看，
登录表单中属性为`hidden`的`input`元素即为校验码，因此在`login.js`中，先提取原网页中的表单信息，然后插入到模板网页中，以保证登录可以顺利进行。

此外，提取的信息也包括登录的出错信息和验证码信息，用于提示用户。

### 主页的逻辑  
主页各个模块的实现，流程都是一致的，前期先用 chrome 控制台的抓包工具，抓取访问目标网页时的请求，分析请求数据报文和返回报文，请求报文中如果需要附加字符串，
则需要考虑先获取这些字符串，返回报文则用于数据的解析并获取，然后便是解析数据和渲染图表了。  

以获取课表数据为例，其实信息门户各个子页面(我的成绩、我的课表等)，都是依靠`ajax`来实现加载的，在浏览器中打开 chrome 调试工具，点击 network 选项卡，
然后访问我的成绩，为了合并请求，直接点击“所有学期的成绩”，可以看到 network 工具捕获到了所有的请求，过滤其中的 xhr 请求，可以看到请求数据的`http`请求。

![chrome控制台截图](http://o8cuifl9z.bkt.clouddn.com/github/img/chrome_screenshot.png)  

可以看到真实请求地址是`http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR`，我们只需用 ajax 访问该地址，
即可获得所有学期的成绩数据。

获取到的成绩数据是嵌入到 html 中的，我们需要从中解析出纯数据来，得益于 JS 在浏览器端得天独厚的运行环境，自带了 DOM 解析功能，只需用`document.createElement`创建
一个虚拟 DOM 并将之前访问的 html 代码放入其中，便可以像正常 DOM 那样从中解析我们想要的数据了。

数据的解析过程十分繁琐，需要付之巨大的耐心。

下面给出本插件已经用到的 url 地址：

模块 | URL | 返回数据 | 类型  
---- | --- | -------- | ----
成绩模块 | `http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR` | 最终数据 | html     
课表模块 | `http://eams.uestc.edu.cn/eams/courseTableForStd.action?_=1477989054431` | 中间数据：`tagId, value` | html    
课表模块 | `http://eams.uestc.edu.cn/eams/dataQuery.action?tagId=semesterBar19026361991Semester&dataType=semesterCalendar&value=123&empty=false` | 中间数据：`semesters`(semesterId对照表) | json    
课表模块 | `http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=123&ids=134775` | 最终数据 | js    
考试模块 | `http://eams.uestc.edu.cn/eams/stdExamTable!examTable.action?examType.id=2&semester.id=123` | 最终数据 | html    

从表中可以看到，所有数据中至关重要的一个是`semester.id`对照表，它用于将年份与学期对应起来，通过用户学号也可以得到入学年份，从而得到用户的当前就读学年。

**如果你在本插件中添加了新功能，请按照格式同步更新上面这个表格。**