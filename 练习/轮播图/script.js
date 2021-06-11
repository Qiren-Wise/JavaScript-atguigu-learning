window.onload = function(){
    let imgList = document.querySelector("#imgList");
    let imgArr = document.querySelectorAll("img");
    imgList.style.width = 620*imgArr.length + "px";

    //设置导航按钮居中
    //获取navDIv
    let navDiv = document.querySelector("#navDiv");
    let outer = document.querySelector("#outer");
    navDiv.style.left = (outer.offsetWidth - navDiv.offsetWidth) / 2 + "px";

    //获取所有a标签
    let allA = document.querySelectorAll("a");
    //设置a标签索引
    index = 0;
    //设置默认选中的颜色
    allA[index].style.backgroundColor = "rgb(112, 170, 218)";
    for (let i = 0;i<allA.length;i++){
        //为每一个超链接都添加一个编号
        allA[i].num = i;
        allA[i].onclick = function(){
            //清空定时器
            clearInterval(timer);
            index = this.num;

            //设置标签变色
            setA();
            move(imgList,"left", -620*index ,70,function(){
                //由于前面关闭了定时器，这边要再开启
                autoChange();
            });
        }
    }
    //开启自动切换图片
    autoChange();

    //设置索引切换样式
    function setA(){
        /*我们采用一种偷梁换柱的方法，因为最后一张图片等于第一张图片，
        所以将最后一张图片突然变成第一张图片，由于改变太快，肉眼是察觉不到的。
        */
        if (index >= imgArr.length - 1){
            index = 0;
            imgList.style.left = "0px";
        }
        //将所有a标签恢复默认颜色
        for (let i = 0;i<allA.length;i++){
            allA[i].style.backgroundColor = "";
        }
        allA[index].style.backgroundColor = "rgb(112, 170, 218)";
    }

    var timer;
    //自动切换图片函数
    function autoChange(){
        timer = setInterval(function(){
            //索引自增
            index++;
            index %= imgArr.length;
            move(imgList,"left", -620*index ,70,function(){
                //利用回调函数修改底部索引
                setA();
            });
        },3000);
    }
    
};   