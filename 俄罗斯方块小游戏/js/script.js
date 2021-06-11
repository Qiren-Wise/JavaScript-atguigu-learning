//控制分数
var score = 0;
//创建一个常量控制步长
const STEP = 20;
//定义常量分割容器
const ROW_COUNT = 18,COL_COUNT = 10;
//创建每个模型的数据源
const MODELS = [
    //第一个样式模型(L型)
    {
        0:{
            row:2,
            col:0
        },
        1:{
            row:2,
            col:1
        },
        2:{
            row:2,
            col:2
        },
        3:{
            row:1,
            col:2
        }
    },
    //第二个样式模型(凸型)
    {
        0:{
            row:1,
            col:1
        },
        1:{
            row:0,
            col:0
        },
        2:{
            row:1,
            col:0
        },
        3:{
            row:2,
            col:0
        }
    },
    //第三个样式模型(田型)
    {
        0:{
            row:1,
            col:1
        },
        1:{
            row:2,
            col:1
        },
        2:{
            row:1,
            col:2
        },
        3:{
            row:2,
            col:2
        }
    },
    //第四个样式模型(一型)
    {
        0:{
            row:0,
            col:0
        },
        1:{
            row:0,
            col:1
        },
        2:{
            row:0,
            col:2
        },
        3:{
            row:0,
            col:3
        }
    },
    //第四个样式模型(Z型)
    {
        0:{
            row:1,
            col:1
        },
        1:{
            row:1,
            col:2
        },
        2:{
            row:2,
            col:2
        },
        3:{
            row:2,
            col:3
        }
    },
];

//创建变量，存放当前使用的模型
var currentModel = {};

//创建变量标记16宫格的位置
var currentX = 0,currentY = 0;
//记录所有块元素的位置
//k=行_列 : v=块元素
var fixedBlocks = {};
//创建定时器
var myInterval = null;

//入口方法
function init(){
    //createModel();
    onKeyDown();
}

//根据模型的数据创建对应的块元素
function createModel(){
    //判断游戏是否接受
    if (isGameOver()){
        gameOver();
        return;
    }
    //确定当前使用哪一个模型，随机数生成
    currentModel = MODELS[Math.round(Math.random()*4)];
    //重新初始化16宫格的位置
    currentX = 0;
    currentY = 0;
    //生成对应数量的块元素
    for (var key in currentModel){
        var divEle = document.createElement("div");
        divEle.className = "activity_model";
        document.querySelector("#container").appendChild(divEle);
    }
    //定位块元素的位置
    locationBlock();
    //让当前模型自动下落
    autoDown();
}

//根据数据源定位块元素的位置
function locationBlock(){
    //判断块元素的越界行为
    checkBound();
    //1.拿到所有的块元素
    var eles = document.querySelectorAll(".activity_model");
    for (var i = 0;i<eles.length;i++){
        //单个块元素
        var activityModelEle = eles[i];
        //2.找到每个块元素对应的数据
        var blockModel = currentModel[i];
        //3.根据每个块元素对应的数据来指定块元素的位置
        //每个块元素的位置由两个条件决定：1、16宫格所在的位置。 2、块元素在16宫格中的位置
        activityModelEle.style.left = (currentX + blockModel.col) * STEP + "px";
        activityModelEle.style.top = (currentY + blockModel.row) * STEP + "px";
    }
}

//监听用户键盘事件
function onKeyDown(){
    document.onkeydown = function(evnet){
        switch(event.keyCode){
            case 38:
                console.log("上");
                rotate();
                break;
            case 39:
                console.log("右");
                move(1,0);
                break;
            case 40:
                console.log("下");
                move(0,1);
                break;
            case 37:
                console.log("左");
                move(-1,0);
                break;
        }
    }
}

//控制块元素移动
function move(x,y){
    if (isMeet(currentX + x,currentY+y,currentModel)){
        //底部的触碰发生在移动16宫格的时候，并且这次移动是因为Y轴的变化引起的
        if (y!=0){
            //模型之间底部发生触碰
            fixedBottomModel();
        }
        return;
    }
    //16宫格在动
    currentX += x;
    currentY += y;
    //根据16宫格来重新定位块元素
    locationBlock();
}

//控制模型的旋转
function rotate(){
    //克隆一下currentModel，这里利用JSON方法完全复制一个currentModel
    var json_obj = JSON.stringify(currentModel);
    var cloneCurrentModel = JSON.parse(json_obj);
    //算法
    //旋转后的行 == 旋转前的列
    //旋转后的列 == 3-旋转前的行
    
    //遍历我们当前的 模型数据源
    for (var key in cloneCurrentModel){
        //块元素数据源
        var blockModel = cloneCurrentModel[key];
        //实现算法
        var temp = blockModel.row;
        blockModel.row = blockModel.col;
        blockModel.col = 3-temp;   
    }
    //如果旋转之后会发生触碰，那么就不需要进行旋转了
    if (isMeet(currentX,currentY,cloneCurrentModel)){
        return;
    }
    //接受这次旋转
    currentModel = cloneCurrentModel;
    locationBlock();
}

//控制模型只能在容器中移动
function checkBound(){
    //定义模型活动的边界
    var leftBound = 0,rightBound = COL_COUNT,bottomBound = ROW_COUNT;
    //当块元素超出边界，让16宫格向后退一步
    for (var key in currentModel){
        var blockModel = currentModel[key];
        //判断左侧越界
        if (blockModel.col + currentX < leftBound) {
            currentX++;
        }
        //判断右侧越界
        if (blockModel.col + currentX >= rightBound) {
            currentX--;
        }
        //判断底部越界
        if (blockModel.row + currentY >= bottomBound){
            currentY--;
            //把模型固定在底部
            fixedBottomModel();
        }
    }
}

//把模型固定在底部
function fixedBottomModel() {
    //1.改变模型(中块元素)的样式
    //2.让模型不可以再进行移动
    var activityModelEles = document.querySelectorAll(".activity_model");
    for (var i = activityModelEles.length - 1;i >= 0;i--){
        //更改每个块元素的类名
        //由于类名被更改，我们模型移动依靠的就是修改activity_model类的定位，现在不是原类名，自然就无法移动了
        activityModelEles[i].className = "fixed_model";
        //记录块元素的位置
        var blockModel = currentModel[i];
        fixedBlocks[(currentY + blockModel.row) + "_" + (currentX + blockModel.col)] = activityModelEles[i];
    }
    //判断是否要铺满一行需要清理
    isRemoveLine();
    //3.创建新的模型
    createModel();
}

//判断模型之间的触碰问题
//X,Y表示16宫格<将要>移动到的位置
//model 表示当前数据源<将要>完成的变化
function isMeet(x,y,model){
    //所谓模型之间的触碰，在一个固定位置已经存在一个被固定的元素块时，那么活动中的模型不可以再占用该位置
    //判断触碰，就是判断活动中模型<将要移动到的位置>是否已经存在被固定的模型(块元素)了
    //如果存在返回true，表示将要移动到的位置会发送触碰，反之返回false
    for (var k in model) {
        var blockModel = model[k];
        //该位置是否已经存在块元素？
        if (fixedBlocks[(y + blockModel.row) + "_" + (x + blockModel.col)]){
            return true;
        }
    }
    return false;
}

//判断一行是否被铺满
function isRemoveLine(){
    //在一行中，每一列都有块元素，那么该行就需要被清理了
    //遍历所有行中的所有列
    //遍历所有行
    for (var i = 0;i < ROW_COUNT;i++){
        //标记符，假设当前行已经被铺满了
        var flag = 1;
        //遍历当前行中的所有列
        for (var j = 0; j < COL_COUNT; j++){
            //如果当前行中有一列没有数据，那就说明没有被铺满
            if (!fixedBlocks[i + "_" + j]){
                flag = 0;
                break;
            }
        }
        if (flag){
            //该行已经被铺满了，删除改行
            removeLine(i);
        }
    }
}

//清理被铺满的一行
function removeLine(line){
    //遍历该行中的所有列
    for (var i = 0; i < COL_COUNT; i++){
        //1.删除该行中所有的块元素
        document.querySelector("#container").removeChild(fixedBlocks[line + "_" + i]);
        //2.删除该行中所有块元素的数据源
        fixedBlocks[line + "_" + i] = null;
    }
    downLine(line);
}

//让被清理行之上的块元素下落
function downLine(line){
    score++;
    document.querySelector("#score").innerHTML = score;
    //遍历被清理行之上的所有行
    for (var i = line - 1; i >= 0; i--){
        //该行中的所有列
        for (var j = 0; j < COL_COUNT; j++){
            //不存在数据跳过一次循环
            if (!fixedBlocks[i + "_" + j]) { continue; }
            //存在数据
            //1.被清理行之上所在块元素数据源所在的行数 + 1
            fixedBlocks[(i+1) + "_" + j] = fixedBlocks[i + "_" + j];
            //2.让容器的位置下落
            new_move(fixedBlocks[(i+1) + "_" + j],"top",(i+1) * STEP,1,function(){});
            //3.清理掉之前的块元素
            fixedBlocks[i + "_" + j] = null;
        }
    }
}
//让模型自动下落
function autoDown(){
    if (myInterval){
        clearInterval(myInterval);
    }
    myInterval = setInterval(function(){
        move(0,1);
    },300);
}

//判断游戏结束
function isGameOver(){
    for (var i = 0;i < COL_COUNT; i++){
        if (fixedBlocks["0_" + i]) { return true; }
    }
    return false;
}

//结束游戏
function gameOver(){
    //1.停止计时器
    if(myInterval){
        clearInterval(myInterval);
    }
    var children = document.querySelector("#container").children;
    for (var i = 0;i<children.length;i++){
        children[i].className = "fixed_model";
    }
    //2.弹出对话框
    if (confirm("游戏结束！是否继续游戏")){
        againGame(null);
    };
}

//重新开始游戏
function againGame(obj){
    //清空数据源
    for (var key in fixedBlocks){
        fixedBlocks[key] = null;
    }
    //清空块元素
    document.querySelector("#container").innerHTML = "";
    //重置积分
    score = 0;
    document.querySelector("#score").innerHTML = score;
    if (obj && obj.innerHTML == "开始游戏"){
        obj.innerHTML = "重新开始";
    }
    document.querySelector("#timeOut").innerHTML = "暂停游戏";
    //重新创建块元素
    createModel();
}


//暂停游戏
function timeOutGame(obj){
    if (obj.innerHTML == "暂停游戏"){
        if (myInterval){
            clearInterval(myInterval);
        }
        obj.innerHTML = "继续游戏";
    }
    else{
        autoDown();
        obj.innerHTML = "暂停游戏";
    }
    
}