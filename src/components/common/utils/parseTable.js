const parseTableData = (table) => {
  /**
   * @desc table解析函数
   * @param {HTMLTableElement} table对象
   * @returns {Object} tableHeader,tableContent表头和表内内容
   */
  let data = {
    tableHead: [],
    tableContent: []
  };
  let head = table.querySelector('.gridhead tr');
  for (let i in head.children) {
    if (head.children[i].innerText) {
      data.tableHead.push(head.children[i].innerText);
    }
  }
  let content = table.querySelectorAll('tbody tr');
  for (let i in content) {
    let lineContent = [];
    for (let k in content[i].children) {
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
};

export default {
  parseTableData
};