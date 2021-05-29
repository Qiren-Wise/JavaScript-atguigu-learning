function getStyle(obj,str){
    //利用或运算的优势，style等于网页中有的那个方法。
    style = obj.currentStyle || window.getComputedStyle(obj,null);
    return style[str];
}

function move(obj,attr,target,speed,callback){
    clearInterval(obj.timer);
    //获取元素当前的位置
    var current = parseInt(getStyle(obj,attr));
    //判断速度的正负值，如果0像800移动，speed为正，如果800向0移动，speed为负
    if (current > target){
        speed = -speed;
    }
    
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
            callback && callback();
            
        }
        
    },20);
}