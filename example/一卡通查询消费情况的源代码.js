jQuery(function (f) {
  var a = document.getElementsByName('selDateTime')[0]
  var e = a.selectedIndex
  a.options[e].selected = true
  var c = a.options[e].value
  var b = document.getElementsByName('selType')[0]
  var g = b.selectedIndex
  b.options[g].selected = true
  var d = b.options[g].value
  subfun('http://ecard.uestc.edu.cn/web/guest/personal?p_p_id=transDtl_WAR_ecardportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-4&p_p_col_count=1&_transDtl_WAR_ecardportlet_action=dtlmoreview', c, d, '_transDtl_WAR_ecardportlet_countriesList')
  a.onchange = function () { var j = this.value
    var i = document.getElementsByName('selType')[0]
    var h = i.selectedIndex
    i.options[h].selected = true; var k = b.options[h].value
    subfun('http://ecard.uestc.edu.cn/web/guest/personal?p_p_id=transDtl_WAR_ecardportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-4&p_p_col_count=1&_transDtl_WAR_ecardportlet_action=dtlmoreview', j, k, '_transDtl_WAR_ecardportlet_countriesList') }; b.onchange = function () { var h = this.value
    var j = document.getElementsByName('selDateTime')[0]
    var i = j.selectedIndex
    j.options[i].selected = true; var k = a.options[i].value
    subfun('http://ecard.uestc.edu.cn/web/guest/personal?p_p_id=transDtl_WAR_ecardportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-4&p_p_col_count=1&_transDtl_WAR_ecardportlet_action=dtlmoreview', k, h, '_transDtl_WAR_ecardportlet_countriesList') } }); function subfun (a, d, b, c) { $.ajax({ type: 'POST', dataType: 'text', url: a, data: { _transDtl_WAR_ecardportlet_qdate: d, _transDtl_WAR_ecardportlet_qtype: b }, success: function (e) { if (e.length > 0) { c = 'aazone\\.' + c; $('#' + c).html(e) } contentpage(d, b) }, error: function (e) {} }) } function contentpage (e, c) { var b = $('#_transDtl_WAR_ecardportlet_paginator')
  var a = $('#_transDtl_WAR_ecardportlet_pageIndex').val()
  var d = $('#_transDtl_WAR_ecardportlet_pageCount').val()
  options = { containerClass: 'pagination', currentPage: a, numberOfPages: 10, totalPages: d, pageUrl: function (f, g) { return null }, onPageClicked: function (i, f, g, h) { subpages('http://ecard.uestc.edu.cn/web/guest/personal?p_p_id=transDtl_WAR_ecardportlet&p_p_lifecycle=0&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-4&p_p_col_count=1&_transDtl_WAR_ecardportlet_action=dtlmoreview', h, '_transDtl_WAR_ecardportlet_countriesList', e, c) }, onPageChanged: null }; b.bootstrapPaginator(options) } function subpages (e, c, b, d, a) { $.ajax({ type: 'POST', dataType: 'text', url: e, data: { _transDtl_WAR_ecardportlet_cur: c, _transDtl_WAR_ecardportlet_delta: '10', _transDtl_WAR_ecardportlet_qdate: d, _transDtl_WAR_ecardportlet_qtype: a }, success: function (f) { if (f.length > 0) { b = 'aazone\\.' + b; $('#' + b).html(f); contentpage(d, a) } }, error: function (f) {} }) }
