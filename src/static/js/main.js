function $(name) {
    return document.querySelector(name);
}
var xhr = new XMLHttpRequest();
$('button').addEventListener("click", function () {
    window.open('http://portal.uestc.edu.cn/');
});

function switchBtn(opt) {
    var node = $('#control-btn');
    switch (opt) {
        case 'on':
            {
                node.classList.add('switch-on');
                node.dataset.on = '1';
                break;
            }
        case 'off':
            {
                node.classList.remove('switch-on');
                node.dataset.on = '0';
                break;
            }
        case 'toggle':
            {
                node.classList.toggle('switch-on');
                node.dataset.on = 1 - parseInt(node.dataset.on);
            }
    }
}

function setStauts(status) {
    chrome.storage.local.set({
        'on': status
    });
}

chrome.storage.local.get('on', function (data) {
    if (data['on'] == undefined) {
        setStauts(1);
    } else if (data['on'] == 1) {
        switchBtn('on');
    } else if (data['on'] == 0) {
        switchBtn('off');
    }
});

$('#control-btn').onclick = function() {
    switchBtn('toggle');
    setStauts(parseInt(this.dataset.on));
}