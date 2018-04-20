tabConfig = function (xhr) {

    var selectorDesktop = document.createElement("div"),
        selectorMobile = document.createElement("div"),
        wrapper = document.getElementById("accordion"),
        data = JSON.parse(xhr.responseText);


    wrapper.appendChild(selectorDesktop);
    wrapper.appendChild(selectorMobile);

    for (var i = 0; i < data.tabList.length; i++) {

        // selector label for the desktop view

        var menuItem = data.tabList[i],
            tabLabel = menuItem.text,
            id = "ac-" + i,
            classNames = menuItem.selected ? "title-tab rwd-desktop loaded" : "title-tab rwd-desktop ";

        selectorDesktop.appendChild(createInput(id, "accordion-1", "radio", menuItem.selected))
        selectorDesktop.appendChild(createLabel(i, id, classNames, tabLabel))



        // selector label for the mobile view
        var div = document.createElement("div");
        id = "ac-" + i + "_2";
        classNames = menuItem.selected ? "title-tab rwd-mobile loaded" : "title-tab rwd-mobile ";

        div.appendChild(createInput(id, "accordion-2", "radio", menuItem.selected))
        div.appendChild(createLabel(i, id, classNames, tabLabel));
        var article = document.createElement("article");

        article.innerHTML = tabLabel;
        div.appendChild(article);

        selectorMobile.appendChild(div);

        if (menuItem.selected) {
            loadContentData(i); // by default loading the about US tab content on load
        }
    }


};

accordionControler = function (ele) {

    ele = ele.target;

    var id = hasClass(ele, "rwd-desktop") ? ele.attributes.for.value + "_2" : ele.attributes.for.nodeValue.split("_")[0];

    document.forms["accordion"][id].checked = true;

    var element = document.getElementById(id).nextSibling;

    loadUnloadedTabContent(ele, element, "loaded");

};

loadUnloadedTabContent = function (eleDesktop, eleMobile, className) {
    if (!hasClass(eleDesktop, className)) {
        addClass(eleMobile, className);
        addClass(eleDesktop, className);
        loadContentData(eleDesktop.getAttribute("key"));
    }
};

loadData = function (url, callback) {
    var xhr;

    if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
        var versions = ["Microsoft.XmlHttp"]

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {}
        } // end for
    }

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status !== 200) {
            return;
        }

        // all is well
        if (xhr.readyState === 4) {
            callback(xhr);
        }
    }

    xhr.open('GET', url, true);
    xhr.send('');
};

createInput = function (id, name, type, checked) {

    var input = document.createElement("input");
    input.name = name;
    input.id = id;
    input.type = type;

    if (checked) {
        input.checked = true;
    }

    return input;
};

createLabel = function (id, forId, className, text) {
    var label = document.createElement("label");
    label.setAttribute("for", forId);
    label.className = className;
    label.innerHTML = text;
    label.setAttribute("key", id);

    return label;
};

loadContentData = function (id) {

    var container = document.getElementById("ac-" + id + "_2").nextElementSibling.nextElementSibling;

    container.innerHTML = "loading ..";

    loadData("./data/Tab" + (parseInt(id) + 1) + ".JSON", function (xhr) {

        var articleText = JSON.parse(xhr.responseText);

        container.innerHTML = articleText.body;

    });


};

addEvent = function (className) {
    addEventHandler(className, "click", accordionControler);
};

addEventHandler = function (className, eventType, handler) {

    if (document.body.addEventListener) {
        document.body.addEventListener(eventType, handlerContainer, false);
    } else {
        document.body.attachEvent("on" + eventType, handlerContainer); //for IE
    }

    function handlerContainer(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.className.match(className)) {
            handler(e); //your handler
        }
    }

};

hasClass = function (el, className) {
    if (el.classList)
        return el.classList.contains(className)
    else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
};

addClass = function (el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
};



loadData("./data/accordinConfig.JSON", tabConfig) // creating the tab dynamicly

addEvent("title-tab"); // adding the event for showing the active tab