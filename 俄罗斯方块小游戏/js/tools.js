function getStyle(obj,str){
    //利用或运算的优势，style等于网页中有的那个方法。
    style = obj.currentStyle || window.getComputedStyle(obj,null);
    return style[str];
}


function new_move(obj,attr,target,speed,callback){
    clearInterval(obj.timer);
    //获取元素当前的位置
    var current = parseInt(getStyle(obj,attr));
    //如果你当前位置大于你目标位置，speed为负，如果你当前位置小于目标位置，speed为正
    if (current > target){
        speed = -speed;
    }
    
    //开启定时器
    obj.timer = setInterval(function(){ 
        var oldLeft = parseInt(getStyle(obj,attr));
        var newLeft = oldLeft + speed;
        //利用speed正负判断方向
        //向右移动时，需要判断newLeft是否大于target
        //向左移动时，需要判断newLeft是否小于target
        if ((speed < 0 && newLeft < target) || (speed > 0 && newLeft > target)){
            newLeft = target;
        }

        obj.style[attr] = newLeft + "px";

        if (newLeft === target){
            //达到目标线，停止定时器
            clearInterval(obj.timer)
            //调用回调函数
            callback && callback();
        }
    },20);
}

function addClass(obj,str){
    if (!hasClass(obj,str)){
        obj.className += " " + str;
    }
}

function hasClass(obj,str){
    //需要检测单词边界
    var reg = new RegExp("\\b" + str + "\\b","g");
    //利用三目运算符简化代码，正则检测到了就返回true，没检测到返回false
    return reg.test(obj.className) ? true : false;
}

function removeClass(obj,str){
    if (obj.className = ""){
        var reg = new RegExp("\\b" + str + "\\b","g");
    }else{
        var reg = new RegExp(" \\b" + str + "\\b","g");
    }
    
    obj.className = obj.className.replace(reg,"");
}

function toggleClass(obj,str){
    if (hasClass(obj,str)){
        removeClass(obj,str);
    }
    else{
        addClass(obj,str);
    }
}