function addEventHandler (className, eventType, handler) {

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

accordionControler = function (ele) {

    var id = ele.target.attributes.class.nodeValue == "title-tab rwd-desktop" ? ele.target.attributes.for.nodeValue + "_con" : ele.target.attributes.for.nodeValue.split("_")[0];
    document.forms["accordion"][id].checked = true;

}

addEventHandler("title-tab", "click", accordionControler);



