function $(name) {
    return document.querySelector(name);
}

function createNode(type, className, id) {
    var node = document.createElement(type);
    if (className) {
        node.className = className;
    }
    if (id) {
        node.id = id;
    }

    return node;
}

function Toast(message) {
    var node = createNode('div');
    node.style.position = 'fixed';
    node.style.width = '100%';
    node.style.bottom = '20px';
    node.innerHTML = '<div style="font-size:14px; color: #fff;\
            background-color:rgba(0, 0, 0, 0.7); width: 50%; margin: auto;\
            border-radius: 5px; text-align: center; padding: 10px 5px 10px 5px;\
            -webkit-transition: all 2s ease 0.01s; -moz-transition: all 2s ease 0.01s;\
            transition: all 2s ease 0.01s; opacity: 0">' + message + '</div>'
    setTimeout(function () {
        node.querySelector('div').style.opacity = '1';
    }, 100);
    setTimeout(function () {
        node.querySelector('div').style.opacity = '0';
    }, 3000);
    $('body').appendChild(node);
}

function ajax(option) {
    /**只支持chrome,edge,ff等现代浏览器
     * option: {
     *     method: String <-post or get
     *     url:    String <-your url here
     *     data:      Obj <-your data here
     *     async: Boolean <-async or not
     *     handler:   Obj <-async fun here, eg: b.init.bind(b)
     * }
     */
    var xhr = new XMLHttpRequest();
    var data = null;
    if (!option.async) option.async = true;
    xhr.open(option.method, option.url, option.async);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                option.handler(xhr.responseText);
            } else if (xhr.status == 500) {
                throw Error('Internal Server Error!');
            }
        }
    }
    if (option.method.toUpperCase() == 'GET') {
        xhr.send(data);
    } else if (option.method.toUpperCase() == 'POST') {
        data = new FormData();
        data.append('data', JSON.stringify(option.data));
        xhr.send(data);
    }
}