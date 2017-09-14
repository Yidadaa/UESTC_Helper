$('body').ready(function () {
    $.getJSON('./update.json', function (data) {
        var content = '#####更新日志(ver. ' + data.data[0].version + ')：\n';
        content += data.data[0].content;
        $('#update-news').html(markdown.toHTML(content));
        var allContent = data.data.map(function (v) {
            var header = '####更新日志(ver. ' + v.version + ')：\n';
            return header + v.content;
        }).join('\n');
        $('#all-news').html(markdown.toHTML(allContent));
        $('#more-news').magnificPopup({
            type: 'inline',
            preload: false,
            callbacks: {
                open: function () {
                    $('#all-news').css('display', 'block');
                }
            }
        });
    });
});