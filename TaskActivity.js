var delimiter = "<br>"
var weekCycle = [];
weekCycle[1] = ""; // "%u8FDE";
weekCycle[2] = "%u5355";
weekCycle[3] = "%u53CC";
var result = new String("");
var weeksPerYear = 53;
// 输出教学活动信息
function activityInfo() {
    return "teacherId:" + this.teacherId + "\n" +
        "teacherName:" + this.teacherName + "\n" +
        "courseId:" + this.courseId + "\n" +
        "courseName:" + this.courseName + "\n" +
        "roomId:" + this.roomId + "\n" +
        "roomName:" + this.roomName + "\n" +
        "vaildWeeks:" + this.vaildWeeks;
}
/**
 * 判断是否相同的活动 same acitivity [teacherId,courseId,roomId,vaildWeeks]
 */
function isSameActivity(other) {
    return this.canMergeWith(other) && (this.vaildWeeks == other.vaildWeeks);
}
/**
 * 合并相同的教学活动 same [teacherId,courseId,roomId,remark] can merge
 */
function canMergeWith(other) {
    return (
        this.teacherId == other.teacherId &&
        this.courseId == other.courseId &&
        this.roomId == other.roomId &&
        this.courseName == other.courseName
    );
}
// utility for repeat char
function repeatChar(str, length) {
    if (length <= 1) {
        return str;
    }
    var rs = "";
    for (var k = 0; k < length; k++) {
        rs += str;
    }
    return rs;
}

/**
 * 添加缩略表示 add a abbreviation to exists result; Do not use it directly. a
 * white space will delimate the weeks For example:odd1-18 even3-20
 */
function addAbbreviate(cycle, begin, end) {
    if (result !== "") {
        result += " ";
    }
    if (begin == end) { // only one week
        result += begin;
    } else {
        result += unescape(weekCycle[cycle]) + begin + "-" + end;
    }
    return result;
}
// 缩略单周,例如"10101010"
function mashalOdd(result, weekOccupy, from, start) {
    var cycle = 0;
    if ((start - from + 2) % 2 === 0) {
        cycle = 3;
    } else {
        cycle = 2;
    }
    var i = start + 2;
    for (; i < weekOccupy.length; i += 2) {
        if (weekOccupy.charAt(i) == '1') {
            if (weekOccupy.charAt(i + 1) == '1') {
                addAbbreviate(cycle, start - from + 2, i - 2 - from + 2);
                return i;
            }
        } else {
            if (i - 2 == start) {
                cycle = 1;
            }
            addAbbreviate(cycle, start - from + 2, i - 2 - from + 2);
            return i + 1;
        }
    }
    return i;
}

// 缩略连续周
function mashalContinue(result, weekOccupy, from, start) {
    var cycle = 1;
    var i = start + 2;
    for (; i < weekOccupy.length; i += 2) {
        if (weekOccupy.charAt(i) == '1') {
            if (weekOccupy.charAt(i + 1) != '1') {
                addAbbreviate(cycle, start - from + 2, i - from + 2);
                return i + 2;
            }
        } else {
            addAbbreviate(cycle, start - from + 2, i - 1 - from + 2);
            return i + 1;
        }
    }
    return i;
}
/**
 * 对教学周占用串进行缩略表示 marsh a string contain only '0' or '1' which named
 * "vaildWeeks" with length 53
 * 00000000001111111111111111100101010101010101010100000 |
 * |--------------------------------------| (from) (startWeek) (endWeek)
 * from is start position with minimal value 1,in login it's calendar week
 * start startWeek is what's start position you want to mashal baseed on
 * start,it also has minimal value 1 endWeek is what's end position you want
 * to mashal baseed on start,it also has minimal value 1
 */
function marshal(weekOccupy, from, startWeek, endWeek) {
    result = "";
    if (null == weekOccupy) {
        return "";
    }
    var initLength = weekOccupy.length;

    if (from > 1) {
        var before = weekOccupy.substring(0, from - 1);
        if (before.indexOf('1') != -1) {
            weekOccupy = weekOccupy + before;
        }
    }
    var tmpOccupy = repeatChar("0", from + startWeek - 2);
    tmpOccupy += weekOccupy.substring(from + startWeek - 2, from + endWeek - 1);
    tmpOccupy += repeatChar("0", initLength - weekOccupy.length);
    weekOccupy = tmpOccupy;

    if (endWeek > weekOccupy.length) {
        endWeek = weekOccupy.length;
    }
    if (weekOccupy.indexOf('1') == -1) {
        return "";
    }
    weekOccupy += "000";
    var start = 0;
    while ('1' != weekOccupy.charAt(start)) {
        start++;
    }
    var i = start + 1;
    while (i < weekOccupy.length) {
        var post = weekOccupy.charAt(start + 1);
        if (post == '0') {
            start = mashalOdd(result, weekOccupy, from, start);
        }
        if (post == '1') {
            start = mashalContinue(result, weekOccupy, from, start);
        }
        while (start < weekOccupy.length && '1' != weekOccupy.charAt(start)) {
            start++;
        }
        i = start;
    }
    return result;
}
/**
 * mashal style is or --------------------------- -------------------- |
 * odd3-18 even19-24,room | | odd3-18 | --------------------------
 * --------------------
 */
function marshalValidWeeks(from, startWeek, endWeek) {
    // alert(this.vaildWeeks);
    if (this.roomName !== "") {
        return marshal(this.vaildWeeks, from, startWeek, endWeek) + "," + this.roomName;
    } else {
        return marshal(this.vaildWeeks, from, startWeek, endWeek);
    }
}

function or(first, second) {
    var newStr = "";
    for (var i = 0; i < first.length; i++) {
        if (first.charAt(i) == '1' || second.charAt(i) == '1') {
            newStr += "1";
        } else {
            newStr += "0";
        }
    }
    // alert(first+":first\n"+second+":second\n"+newStr+":result");
    return newStr;
}

// merger activity in every unit.
function mergeAll() {
    for (var i = 0; i < this.unitCounts; i++) {
        if (this.activities[i].length > 1) {
            for (var j = 1; j < this.activities[i].length; j++) {
                this.activities[i][0].vaildWeeks = or(this.activities[i][0].vaildWeeks, this.activities[i][j].vaildWeeks);
                this.activities[i][j] = null;
            }
        }
    }
}
// merger activity in every unit by course.
function mergeByCourse() {
    for (var i = 0; i < this.unitCounts; i++) {
        if (this.activities[i].length > 1) {
            // O(n^2)
            for (var j = 0; j < this.activities[i].length; j++) {
                if (null != this.activities[i][j]) {
                    for (var k = j + 1; j < this.activities[i].length; k++) {
                        if (null != this.activities[i][k]) {
                            if (this.activities[i][j].courseName == this.activities[i][k].courseName) {
                                this.activities[i][j].vaildWeeks = or(this.activities[i][j].vaildWeeks, this.activities[i][k].vaildWeeks);
                                this.activities[i][k] = null;
                            }
                        }
                    }
                }
            }
        }
    }
}

function isTimeConflictWith(otherTable) {
    for (var i = 0; i < this.unitCounts; i++) {
        if (this.activities[i].length !== 0 && otherTable.activities[i].length !== 0) {
            for (var m = 0; m < this.activities[i].length; m++) {
                for (var n = 0; n < otherTable.activities[i].length; n++) {
                    for (var k = 0; k < this.activities[i][m].vaildWeeks.length; k++) {
                        if (this.activities[i][m].vaildWeeks.charAt(k) == '1' &&
                            otherTable.activities[i][n].vaildWeeks.charAt(k) == '1') {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

/**
 * aggreagate activity of same course. first merge the activity of same
 * (teacher,course,room). then output mashal vaildWeek string . if course is
 * null. the course name will be ommited in last string. style is
 * -------------------------------- | teacher1Name course1Name | |
 * (odd1-2,room1Name) | | (even2-4,room2Name) | | teacher2Name course1Name | |
 * (odd3-6,room1Name) | | (even5-8,room2Name) |
 * ----------------------------------
 * 
 * @param index
 *            time unit index
 * @param from
 *            start position in year occupy week
 * @param startWeek
 *            bengin position from [from]
 * @param endWeek
 *            end position from [from]
 */
function marshalByTeacherCourse(index, from, startWeek, endWeek) {
    var validStart = from + startWeek - 2;
    if (this.activities[index].length === 0) {
        return "";
    }
    if (this.activities[index].length == 1) {
        var cname = this.activities[index][0].courseName;
        var tname = this.activities[index][0].teacherName;
        return tname + " " + cname + delimiter + "(" + this.activities[index][0].adjustClone(this.endAtSat, validStart, false).marshal(from, startWeek, endWeek) + ")";
    } else {
        var marshalString = "";
        var tempActivities = new Array();
        tempActivities[0] = this.activities[index][0].adjustClone(this.endAtSat, validStart, true);
        // merge this.activities to tempActivities by same courseName and
        // roomId .start with 1.
        for (var i = 1; i < this.activities[index].length; i++) {
            var merged = false;
            for (var j = 0; j < tempActivities.length; j++) {
                if (this.activities[index][i].canMergeWith(tempActivities[j])) {
                    // alert(tempActivities[j]+"\n"
                    // +this.activities[index][i]);
                    merged = true;
                    var secondWeeks = this.activities[index][i].vaildWeeks;
                    if (this.activities[index][i].needLeftShift(this.endAtSat, validStart)) {
                        secondWeeks = this.activities[index][i].vaildWeeks.substring(1, 53) + "0";
                    }
                    tempActivities[j].vaildWeeks = or(tempActivities[j].vaildWeeks, secondWeeks);
                }
            }
            if (!merged) {
                tempActivities[tempActivities.length] = this.activities[index][i].adjustClone(this.endAtSat, validStart, false);
            }
        }

        // marshal tempActivities
        for (var m = 0; m < tempActivities.length; m++) {
            if (tempActivities[m] === null) {
                continue;
            }
            var courseName = tempActivities[m].courseName;
            var teacherName = tempActivities[m].teacherName;
            // add teacherName and courseName
            if (courseName !== null) {
                marshalString += delimiter + teacherName + " " + courseName; /* alert(courseName); */
            }
            marshalString += delimiter + "(" + tempActivities[m].marshal(from, startWeek, endWeek) + ")";
            for (var n = m + 1; n < tempActivities.length; n++) {
                // marshal same courseName activity
                if (tempActivities[n] !== null && courseName == tempActivities[n].courseName && teacherName == tempActivities[n].teacherName) {
                    marshalString += delimiter + "(" + tempActivities[n].marshal(from, startWeek, endWeek) + ")";
                    tempActivities[n] = null;
                }
            }
        }

        if (marshalString.indexOf(delimiter) === 0) {
            return marshalString.substring(delimiter.length);
        } else {
            return marshalString;
        }
    }
}

// return true,if this.activities[first] and this.activities[second] has
// same activities .
function isSameActivities(first, second) {
    if (this.activities[first].length != this.activities[second].length) {
        return false;
    }
    if (this.activities[first].length == 1) {
        return this.activities[first][0].isSame(this.activities[second][0]);
    }
    for (var i = 0; i < this.activities[first].length; i++) {
        var find = false;
        for (var j = 0; j < this.activities[second].length; j++) {
            if (this.activities[first][i].isSame(this.activities[second][j])) {
                find = true;
                break;
            }
        }
        if (find === false) {
            return false;
        }
    }
    return true;
}
/**
 * 检查是否需要进行左移动
 */
function needLeftShift(endAtSat, start) {
    return (!endAtSat && this.vaildWeeks.substring(0, start).indexOf("1") != -1 && this.vaildWeeks.substring(start).indexOf("1") == -1)
}
/**
 * 根据年份是否以周六结束,调整占用周. 如果在起始周之前有占用周,只有没有则表示可以进行调节.
 */
function leftShift() {
    this.vaildWeeks = this.vaildWeeks.substring(1, 53) + "0";
    // alert("leftShift:"+this.vaildWeeks);
}
/**
 * 根据该年份是否结束于星期六，调整教学州的占用串。 如果没有调整则返回原来的activity.否则返回调整后的新的activity。
 * 
 * @activity 要调整的教学活动
 * @endAtStat 该活动的年份是否结束于星期六
 * @start 从何为止检查有效的教学周
 * @mustClone 是否必须克隆
 */
function adjustClone(endAtSat, start, mustClone) {
    if (mustClone) {
        var newActivity = this.clone();
        if (newActivity.needLeftShift(endAtSat, start)) {
            newActivity.leftShift();
        }
        return newActivity;
    } else {
        if (this.needLeftShift(endAtSat, start)) {
            var activity = this.clone();
            activity.leftShift(start);
            return activity;
        } else {
            return this;
        }
    }
}
// new taskAcitvity
function TaskActivity(teacherId, teacherName, courseId, courseName, roomId, roomName, vaildWeeks, taskId, remark) {
    this.teacherId = teacherId;
    this.teacherName = teacherName;
    this.courseId = courseId;
    this.courseName = courseName;
    this.roomId = roomId;
    this.roomName = roomName;
    this.vaildWeeks = vaildWeeks; // 53个01组成的字符串，代表了一年的53周
    this.taskId = taskId;
    this.marshal = marshalValidWeeks;
    this.addAbbreviate = addAbbreviate;
    this.clone = cloneTaskActivity;
    this.canMergeWith = canMergeWith;
    this.isSame = isSameActivity;
    this.toString = activityInfo;
    this.adjustClone = adjustClone;
    this.leftShift = leftShift;
    this.needLeftShift = needLeftShift;
    this.remark = remark;
}

// clone a activity
function cloneTaskActivity() {
    return new TaskActivity(this.teacherId, this.teacherName, this.courseId, this.courseName, this.roomId, this.roomName, this.vaildWeeks, this.taskId, this.remark);
}
// 
function marshalTable(from, startWeek, endWeek) {
    for (var k = 0; k < this.unitCounts; k++) {
        if (this.activities[k].length > 0) {
            this.marshalContents[k] = this.marshal(k, from, startWeek, endWeek);
        }
    }
}


function marshalTableForAdminclass(from, startWeek, endWeek) {
    for (var k = 0; k < this.unitCounts; k++) {
        if (this.activities[k].length > 0) {
            this.marshalContents[k] = this.marshalForAdminclass(k, from, startWeek, endWeek);
        }
    }
}

function marshalForAdminclass(index, from, startWeek, endWeek) {
    var validStart = from + startWeek - 2;
    if (this.activities[index].length === 0) {
        return "";
    }
    if (this.activities[index].length == 1) {
        var cname = this.activities[index][0].courseName;
        var tname = this.activities[index][0].teacherName;
        var roomOccupancy = "(" + this.activities[index][0].adjustClone(this.endAtSat, validStart, false).marshal(from, startWeek, endWeek) + ")";
        return tname + " " + cname + roomOccupancy;
    } else {
        var marshalString = "";
        var tempActivities = new Array();
        tempActivities[0] = this.activities[index][0].adjustClone(this.endAtSat, validStart, true);
        // merge this.activities to tempActivities by same courseName and
        // roomId .start with 1.
        for (var i = 1; i < this.activities[index].length; i++) {
            var merged = false;
            for (var j = 0; j < tempActivities.length; j++) {
                if (this.activities[index][i].canMergeWith(tempActivities[j])) {
                    // alert(tempActivities[j]+"\n"
                    // +this.activities[index][i]);
                    merged = true;
                    var secondWeeks = this.activities[index][i].vaildWeeks;
                    if (this.activities[index][i].needLeftShift(this.endAtSat, validStart)) {
                        secondWeeks = this.activities[index][i].vaildWeeks.substring(1, 53) + "0";
                    }
                    tempActivities[j].vaildWeeks = or(tempActivities[j].vaildWeeks, secondWeeks);
                }
            }
            if (!merged) {
                tempActivities[tempActivities.length] = this.activities[index][i].adjustClone(this.endAtSat, validStart, false);
            }
        }

        // marshal tempActivities
        for (var m = 0; m < tempActivities.length; m++) {
            if (tempActivities[m] === null) {
                continue;
            }
            var courseName = tempActivities[m].courseName;
            var teacherName = tempActivities[m].teacherName;
            // add teacherName and courseName
            var tipStr = "";
            if (courseName !== null) {
                tipStr = courseName + "(" + tempActivities[m].marshal(from, startWeek, endWeek) + ")";
            }
            if (marshalString.indexOf(tipStr) == -1) {
                marshalString += delimiter + tipStr;
            }
        }

        if (marshalString.indexOf(delimiter) === 0) {
            return marshalString.substring(delimiter.length);
        } else {
            return marshalString;
        }
    }
}

function fillTable(tableId, weeks, units) {
    var courseTable = document.getElementById(tableId);
    if (courseTable == null) {
        return;
    }
    for (var i = 0; i < weeks; i++) {
        for (var j = 0; j < units - 1; j++) {
            var index = units * i + j;
            var preTd = document.getElementById("TD" + index);
            var nextTd = document.getElementById("TD" + (index + 1));
            while (this.marshalContents[index] != null && this.marshalContents[index + 1] != null && this.marshalContents[index] == this.marshalContents[index + 1]) {
                preTd.parentNode.removeChild(nextTd);
                var spanNumber = new Number(preTd.colSpan);
                spanNumber++;
                preTd.colSpan = spanNumber;
                j++;
                if (j >= units - 1) {
                    break;
                }
                index = index + 1;
                nextTd = document.getElementById("TD" + (index + 1));
            }
        }
    }

    for (var k = 0; k < this.unitCounts; k++) {
        var td = document.getElementById("TD" + k);
        if (td != null && this.marshalContents[k] != null) {
            td.innerHTML = this.marshalContents[k];
            td.style.backgroundColor = "#94aef3";
            td.className = "infoTitle";
        }
    }

}

/***************************************************************************
 * course table dispaly occupy of teacher,room and andminClass. It also
 * represent data model of any course arrangement. For example student's
 * course table,single course's table,teacher's course table,and
 * adminClass's course table,even major's .
 **************************************************************************/
function CourseTable(year, unitCounts) {
    this.unitCounts = unitCounts;
    this.activities = [unitCounts];
    this.year = year;
    var date = new Date();
    // 日期中的月份为该月份的数字减一
    date.setFullYear(year, 11, 31);
    this.endAtSat = false;
    if (6 == date.getDay()) {
        this.endAtSat = true;
    }

    this.marshalContents = new Array(unitCounts);
    for (var k = 0; k < unitCounts; k++) {
        this.activities[k] = [];
    }

    this.mergeAll = mergeAll;
    this.marshal = marshalByTeacherCourse;
    // return true,if this.activities[first] and this.activities[second] has
    // same vaildWeeks and roomId pair set.
    this.isSame = isSameActivities;
    this.isTimeConflictWith = isTimeConflictWith;
    this.marshalTable = marshalTable;
    this.marshalTableForAdminclass = marshalTableForAdminclass;
    this.fill = fillTable;
    this.marshalForAdminclass = marshalForAdminclass;
}

/***************************************************************************
 * 添加一个小节中的教学活动组成一个活动集. * *
 **************************************************************************/
// add acitity to cluster.and weekInex from 0 to weeks-1
function addActivityToCluster(teacherId, teacherName, roomId, roomName, weekIndex) {
    // alert("addActivityToCluster:"+weekIndex)
    if (null == this.weeksMap[teacherId + roomId]) {
        this.weeksMap[teacherId + roomId] = new Array(this.weeks);
        this.activityMap[teacherId + roomId] = new TaskActivity(teacherId, teacherName, this.courseId, this.courseName, roomId, roomName, "");
    }
    this.weeksMap[teacherId + roomId][weekIndex] = "1";
}
/**
 * 合并课程表中相同的单元格
 */
function mergeCellOfCourseTable(weeks, units) {
    for (var i = 0; i < weeks; i++) {
        for (var j = 0; j < units - 1; j++) {
            var index = units * i + j;
            var preTd = document.getElementById("TD" + index);
            var nextTd = document.getElementById("TD" + (index + 1));
            while (preTd.innerHTML !== "" && nextTd.innerHTML !== "" && preTd.innerHTML == nextTd.innerHTML) {
                preTd.parentNode.removeChild(nextTd);
                var spanNumber = new Number(preTd.colSpan);
                spanNumber++;
                preTd.colSpan = spanNumber;
                j++;
                if (j >= units - 1) {
                    break;
                }
                index = index + 1;
                nextTd = document.getElementById("TD" + (index + 1));
            }
        }
    }
}
/*
 * construct a valid Weeks from this.weeksMap by key teacherRoomId this
 * startweek is the position of this.weeksMap[teacherRoomId] in return
 * validWeekStr also it has mininal value 1;
 */
function constructValidWeeks(startWeek, teacherRoomId) {
    // alert("enter constructValidWeeks")
    // as many as possible weeks with in a year
    var firstWeeks = new Array(weeksPerYear);
    var secondWeeks = null;
    var weeksThisYear = "";
    for (var i = 0; i < weeksPerYear - 1; i++) {
        firstWeeks[i] = "0";
    }
    for (var weekIndex = 0; weekIndex < this.weeksMap[teacherRoomId].length; weekIndex++) {
        var occupy = "0";
        if (this.weeksMap[teacherRoomId][weekIndex] === undefined) occupy == "0";
        else occupy = "1";
        // 计算占用周的位置
        var weekIndexNum = new Number(weekIndex);
        weekIndexNum += startWeek - 1;

        if (weekIndexNum < weeksPerYear) {
            firstWeeks[weekIndexNum] = occupy;
        } else {
            if (null == secondWeeks) {
                // 生成下一年的占用情况
                secondWeeks = new Array();
                for (var i = 0; i < weeksPerYear - 1; i++) {
                    secondWeeks[i] = "0";
                }
            }
            secondWeeks[(weekIndexNum + (this.endAtSat ? 0 : 1)) % weeksPerYear] = occupy;
        }
    }
    for (i = 0; i < weeksPerYear; i++) {
        weeksThisYear += (firstWeeks[i] == null) ? "0" : firstWeeks[i];
    }
    // alert(weeksThisYear)
    var weekState = new Array();

    if (weeksThisYear.indexOf("1") != -1) {
        weekState[weekState.length] = weeksThisYear;
    }
    var weeksNextYear = "";
    if (null != secondWeeks) {
        for (i = 0; i < weeksPerYear; i++) {
            weeksNextYear += (secondWeeks[i] === undefined) ? "0" : secondWeeks[i];
        }
        if (weeksNextYear.indexOf("1") != -1) {
            weekState[weekState.length] = weeksNextYear;
        }
        // alert(weeksNextYear);
    }
    // alert(weekState)
    return weekState;
}
/**
 * 构造教学活动
 * 
 */
function constructActivities(startWeek) {
    // alert("enter constructActivities")
    var activities = new Array();
    for (var teacherRoomId in this.activityMap) {
        var weekState = this.constructValidWeeks(startWeek, teacherRoomId);
        this.activityMap[teacherRoomId].vaildWeeks = weekState[0];
        this.activityMap[teacherRoomId].remark = this.remark;
        activities[activities.length] = this.activityMap[teacherRoomId];
        if (weekState.length == 2) {
            var cloned = this.activityMap[teacherRoomId].clone();
            cloned.vaildWeeks = weekState[1];
            activities[activities.length] = cloned;
            // alert(cloned)
        }
        // alert(this.activityMap[teacherRoomId]);
    }
    return activities;
}

/**
 * all activities in each unit consists a ActivityCluster
 */
function ActivityCluster(year, courseId, courseName, weeks, remark) {
    this.year = year;
    var date = new Date();
    date.setFullYear(year, 11, 31);
    this.endAtSat = false;
    if (6 == date.getDay()) {
        this.endAtSat = true;
    }
    this.courseId = courseId;
    this.courseName = courseName;
    this.weeks = weeks;
    this.remark = remark;
    this.weeksMap = {};
    this.activityMap = {};
    this.add = addActivityToCluster;
    this.constructValidWeeks = constructValidWeeks;
    this.genActivities = constructActivities;
}