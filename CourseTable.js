function fillTable(table, weeks, units, tableIndex) {
    for (var i = 0; i < weeks; i++) {
        for (var j = 0; j < units - 1; j++) {
            var index = units * i + j;
            var preTd = jQuery("#TD" + index + "_" + tableIndex);
            var nextTd = jQuery("#TD" + (index + 1) + "_" + tableIndex);
            while (table.marshalContents[index] != null && table.marshalContents[index + 1] != null && table.marshalContents[index] == table.marshalContents[index + 1]) {
                nextTd.remove();
                var spanNumber = new Number(preTd.prop("rowSpan"));
                spanNumber++;
                preTd.prop("rowSpan", spanNumber);
                j++;
                if (j >= units - 1) {
                    break;
                }
                index = index + 1;
                nextTd = jQuery("#TD" + (index + 1) + "_" + tableIndex);
            }
        }
    }

    for (var k = 0; k < table.unitCounts; k++) {
        var td = document.getElementById("TD" + k + "_" + tableIndex);
        if (td != null && table.marshalContents[k] != null) {
            td.innerHTML = table.marshalContents[k];
            td.style.backgroundColor = "#94aef3";
            td.className = "infoTitle";

            // 查找冲突 table.activities是什么，可以查看TaskActivity.js和courseTableContent_script.ftl
            var activitiesInCell = table.activities[k];
            if (detectCollisionInCell(activitiesInCell)) {
                td.style.backgroundColor = "pink";
            }
            td.className = "infoTitle";
            td.title = table.marshalContents[k].replace(/<br>/g, ";");
        }
    }
}
function detectCollisionInCell(activitiesInCell) {
    if (activitiesInCell.length <= 1) {
        return false;
    }
    //单元格的课程集合[courseId(seqNo)->true]
    var cellCourseIds = new Object();
    var mergedValidWeeks = activitiesInCell[0].vaildWeeks.split("");
    //登记第一个课程
    //cellCourseIds[ activitiesInCell[0].courseName]=true;
    // update by liguoqing 相同课程代码的不算冲突
    cellCourseIds[activitiesInCell[0].courseId] = true;
    for (var z = 1; z < activitiesInCell.length; z++) {
        var detectCollision = false;
        var tValidWeeks = activitiesInCell[z].vaildWeeks.split("");
        if (mergedValidWeeks.length != tValidWeeks.length) {
            alert('mergedValidWeeks.length != tValidWeeks.length');
            return;
        }
        for (var x = 0; x < mergedValidWeeks.length; x++) {	//53代表53周
            var m = new Number(mergedValidWeeks[x]);
            var t = new Number(tValidWeeks[x]);
            if (m + t <= 1) {
                mergedValidWeeks[x] = m + t;
            } else {
                //如果已经是登记过的，则不算冲突
                if (!cellCourseIds[activitiesInCell[z].courseId]) {
                    return true;	//发现冲突
                }
            }
        }
        //登记该课程
        cellCourseIds[activitiesInCell[z].courseName] = true;
    }
    return false;
}



/*==================================================第二段=========================================== */

addExport();

function addExport() {
    var obj = jQuery(".toolbar-items").children().attr("title");
    if (obj != "导出") {
        bar.addItem("导出", "exportData()");
    }
}

function exportData() {
    var outputDiv = $("<div>");
    var excelTable = $("<table>");
    excelTable.css("text-align", "center");
    excelTable.attr("align", "center");
    excelTable.html($("#manualArrangeCourseTable").html());
    excelTable.find("span[id^='lesson_']").remove();
    excelTable.attr("border", "1px");
    excelTable.find("br").each(function () {
        $(this).replaceWith("　　　　　"); //利用自动换行
    });
    excelTable.find("*").removeAttr("title");
    excelTable.find("*").removeAttr("width");
    excelTable.find("*").removeAttr("height");
    excelTable.find("*").removeAttr("class");
    excelTable.find("td").attr("width", "100px");
    excelTable.find("td").attr("height", "100px");
    excelTable.find("td").css("text-align", "center");
    excelTable.appendTo(outputDiv);
    $("input[name*='courseTableHTML']").val(outputDiv.html());
    bg.form.submit("roomExportForm");
}

// function CourseTable in TaskActivity.js
var table0 = new CourseTable(2015, 84);
var unitCount = 12;
var index = 0;
var activity = null;
activity = new TaskActivity("10024", "牟柳", "6794(B0000820.01)", "英语会议交流与汇报(B0000820.01)", "442", "品学楼C-204", "00000000001111111100000000000000000000000000000000000");
index = 3 * unitCount + 2;
table0.activities[index][table0.activities[index].length] = activity;
index = 3 * unitCount + 3;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("10024", "牟柳", "6794(B0000820.01)", "英语会议交流与汇报(B0000820.01)", "442", "品学楼C-204", "00000000001111111100000000000000000000000000000000000");
index = 1 * unitCount + 0;
table0.activities[index][table0.activities[index].length] = activity;
index = 1 * unitCount + 1;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9928", "姚列明", "11814(K0400520.28)", "大学物理实验 I(K0400520.28)", "1204", "物电学院实验室", "01010101010101010000000000000000000000000000000000000");
index = 2 * unitCount + 8;
table0.activities[index][table0.activities[index].length] = activity;
index = 2 * unitCount + 9;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9097", "陈峦", "16088(I1754520.01)", "Java语言程序设计(I1754520.01)", "704", "品学楼B409", "01111111111111111100000000000000000000000000000000000");
index = 1 * unitCount + 6;
table0.activities[index][table0.activities[index].length] = activity;
index = 1 * unitCount + 7;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9899,10706", "向昭银,李晓东", "6726(D0000540.01)", "复变函数与数理方程(D0000540.01)", "730", "品学楼A312", "01111111111111111000000000000000000000000000000000000");
index = 2 * unitCount + 6;
table0.activities[index][table0.activities[index].length] = activity;
index = 2 * unitCount + 7;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9899,10706", "向昭银,李晓东", "6726(D0000540.01)", "复变函数与数理方程(D0000540.01)", "730", "品学楼A312", "01111111111111111000000000000000000000000000000000000");
index = 0 * unitCount + 2;
table0.activities[index][table0.activities[index].length] = activity;
index = 0 * unitCount + 3;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9676", "何松柏", "11589(E0000255.01)", "模拟电路基础(E0000255.01)", "369", "品学楼A310", "01111111111111111100000000000000000000000000000000000");
index = 4 * unitCount + 0;
table0.activities[index][table0.activities[index].length] = activity;
index = 4 * unitCount + 1;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9676", "何松柏", "11589(E0000255.01)", "模拟电路基础(E0000255.01)", "369", "品学楼A310", "01111111111111111100000000000000000000000000000000000");
index = 1 * unitCount + 4;
table0.activities[index][table0.activities[index].length] = activity;
index = 1 * unitCount + 5;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9080", "林哲", "16157(B1425310.11)", "篮球C(B1425310.11)", "", "", "00011111111111111110000000000000000000000000000000000");
index = 2 * unitCount + 4;
table0.activities[index][table0.activities[index].length] = activity;
index = 2 * unitCount + 5;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9450", "朱学勇", "11419(E0000350.01)", "信号与系统(E0000350.01)", "376", "品学楼B407", "01111111111111111100000000000000000000000000000000000");
index = 3 * unitCount + 4;
table0.activities[index][table0.activities[index].length] = activity;
index = 3 * unitCount + 5;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9450", "朱学勇", "11419(E0000350.01)", "信号与系统(E0000350.01)", "376", "品学楼B407", "01111111111111111100000000000000000000000000000000000");
index = 0 * unitCount + 4;
table0.activities[index][table0.activities[index].length] = activity;
index = 0 * unitCount + 5;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9450", "朱学勇", "11419(E0000350.01)", "信号与系统(E0000350.01)", "1251", "立人楼B206", "01010101010101010100000000000000000000000000000000000");
index = 4 * unitCount + 2;
table0.activities[index][table0.activities[index].length] = activity;
index = 4 * unitCount + 3;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("10041", "高山", "6793(B0000720.01)", "学术英语写作(B0000720.01)", "341", "品学楼B302", "01111111110000000000000000000000000000000000000000000");
index = 3 * unitCount + 2;
table0.activities[index][table0.activities[index].length] = activity;
index = 3 * unitCount + 3;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("10041", "高山", "6793(B0000720.01)", "学术英语写作(B0000720.01)", "341", "品学楼B302", "01111111110000000000000000000000000000000000000000000");
index = 1 * unitCount + 0;
table0.activities[index][table0.activities[index].length] = activity;
index = 1 * unitCount + 1;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9937", "陈端兵", "12376(D0001030.01)", "软件技术基础（含数据结构）(D0001030.01)", "419", "品学楼A406", "01111111111111111000000000000000000000000000000000000");
index = 2 * unitCount + 2;
table0.activities[index][table0.activities[index].length] = activity;
index = 2 * unitCount + 3;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9937", "陈端兵", "12376(D0001030.01)", "软件技术基础（含数据结构）(D0001030.01)", "419", "品学楼A406", "00101010101010101000000000000000000000000000000000000");
index = 4 * unitCount + 2;
table0.activities[index][table0.activities[index].length] = activity;
index = 4 * unitCount + 3;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9213", "滕保华", "11322(D0000845.01)", "大学物理II(D0000845.01)", "424", "品学楼B308", "01111111111111111100000000000000000000000000000000000");
index = 2 * unitCount + 0;
table0.activities[index][table0.activities[index].length] = activity;
index = 2 * unitCount + 1;
table0.activities[index][table0.activities[index].length] = activity;
activity = new TaskActivity("9213", "滕保华", "11322(D0000845.01)", "大学物理II(D0000845.01)", "424", "品学楼B308", "01111111111111111100000000000000000000000000000000000");
index = 0 * unitCount + 6;
table0.activities[index][table0.activities[index].length] = activity;
index = 0 * unitCount + 7;
table0.activities[index][table0.activities[index].length] = activity;
table0.marshalTable(2, 1, 20);
fillTable(table0, 7, 12, 0);