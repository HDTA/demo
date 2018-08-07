$(function () {

    draw();
    init();

    $('#canvas').click(function () {
        play(event);

    });

});

function init() {
    for (var y = 0; y < LINE; y++) {
        chess[y] = new Array(LINE);
        for (var x = 0; x < LINE; x++) {
            chess[y][x] = 0;
        }
    }
}

/*
context 画布 size 棋盘格子大小 space 棋盘与画布边缘间距
dx 第1个格子和画布的间距  radius 棋子的半径  
chess 棋局 ： 0 没有棋子  1 黑棋 2 白棋
count 计数器  count>=5 赢了
 */
var canvas;
var LINE = 15;
var context;
var size = 36;
var space = 10;
var dx = size / 2 + space;
var radius = size/2-1;

var chess = new Array(LINE);
var isBlack = true;
var step = LINE * LINE;//总数
var winner = '';

/*
画棋盘
 */
function draw() {
    var canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.fillStyle = "#ffe879";
    context.fillRect(0, 0, 560, 560);
    context.strokeStyle = "#000000";
    context.lineWidth = 2;

    for (var i = 0; i < 15; i++) {
        context.moveTo(dx, size * i + dx);
        context.lineTo((LINE - 1) * size + dx, size * i + dx);
        context.stroke();

        context.moveTo(size * i + dx, dx);
        context.lineTo(size * i + dx, (LINE - 1) * size + dx);
        context.stroke();
    }

}

/*
画棋子
 */
function drawChess(color, x, y) {
    if (color === 1) {
        context.fillStyle = "#000";
    } else if (color === 2) {
        context.fillStyle = "#fff";
    } else if (color === -1) {
        context.fillStyle = "#0f0";
    } else if (color === -2) {
        context.fillStyle = "#f00";
    }

    context.beginPath();
    context.arc(size * x + dx, size * y + dx, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

}

/*
鼠标单击画棋子
 */
function play(evt) {
    var e = evt || event;
    if(isBlack){


        var x = e.pageX - pageXOffset - dx;
        var y = e.pageY - pageYOffset - dx;
        x = parseInt(x / size);
        y = parseInt(y / size);
        if (chess[y][x] === 0 && x >= 0 && y >= 0 && x < LINE && y < LINE && winner === '') {
            chess[y][x] = 1;
            drawChess(1, x, y);
            isWin(1, x, y);
            isBlack = false;
        } else {
            if (winner === '') {
                alert("不能下这里！");
                isBlack = true;
            } else {
                if (confirm("开启一局新游戏？")) {
                    location.reload();
                }
            }
        }

    }

    if(!isBlack){
        AIPlay();
    }

    if(--step === 0){
        winner = winner="和局";
        alert(winner);
        if (confirm("开启一局新游戏？")) {
            location.reload();
        }
    }

}

function isWin(color, x, y) {

    lrCount(color, x, y);
    tbCount(color, x, y);
    ltCount(color, x, y);
    rtCount(color, x, y);
}

/*
水平计数
 */
function lrCount(color, x, y) {
    var count = 0;
    var value = [];
    for (var i = x; i >= 0; i--) {
        if (chess[y][i] === color) {
            value.push(i);
            value.push(y);
            count++;
        } else {
            i = -1;
        }
    }

    for (var j = x; j < LINE; j++) {
        if (chess[y][j] === color) {
            value.push(j);
            value.push(y);
            count++;
        } else {
            j = LINE;
        }
    }

    success(color, value, --count);

}

/*
垂直计数
 */
function tbCount(color, x, y) {
    var count = 0;
    var value = [];
    for (var i = y; i >= 0; i--) {
        if (chess[i][x] === color) {
            value.push(x);
            value.push(i);
            count++;
        } else {
            i = -1;
        }
    }

    for (var j = y; j < LINE; j++) {
        if (chess[j][x] === color) {
            value.push(x);
            value.push(j);
            count++;
        } else {
            j = LINE;
        }
    }

    success(color, value, --count);

}

/*
左上-右下 计数
 */
function ltCount(color, x, y) {
    var count = 0;
    var value = [];
    for (var i = x, j = y; i >= 0 && j >= 0; i--, j--) {
        if (chess[j][i] === color) {
            value.push(i);
            value.push(j);
            count++;
        } else {
            i = -1;
            j = -1;
        }
    }

    for (var m = x, n = y; m < LINE && n < LINE; m++, n++) {
        if (chess[n][m] === color) {
            value.push(m);
            value.push(n);
            count++;
        } else {
            m = LINE;
            n = LINE;
        }
    }

    success(color, value, --count);

}

/*
右上-左下 计数
 */
function rtCount(color, x, y) {
    var count = 0;
    var value = [];
    for (var i = x, j = y; i < LINE && j >= 0; i++, j--) {
        if (chess[j][i] === color) {
            value.push(i);
            value.push(j);
            count++;
        } else {
            i = LINE;
            j = -1;
        }
    }

    for (var m = x, n = y; m >= 0 && n < LINE; m--, n++) {
        if (chess[n][m] === color) {
            value.push(m);
            value.push(n);
            count++;
        } else {
            m = -1;
            n = LINE;
        }
    }

    success(color, value, --count);

}

function success(color, value, count) {
    if (count >= 5) {
        var v = -1;
        winner = "黑棋胜利!";
        if (color === 2) {
            v = -2;
            winner = "白棋胜利!";
        }

        for (var i = 0; i < value.length; i += 2) {
            drawChess(v, value[i], value[i + 1]);
        }

        alert(winner);
        if (confirm("开启一局新游戏？")) {
            location.reload();
        }
    }


}

/*
鼠标单击画棋子
 */
function AIPlay() {

    var value = getPosition(chess);
    var x = value[0];
    var y = value[1];
    if (chess[y][x] === 0 && x >= 0 && y >= 0 && x < LINE && y < LINE && winner === '') {
        chess[y][x] = 2;
        drawChess(2, x, y);
        isWin(2, x, y);
        isBlack = true;
    } else {
        if (winner === '') {
            isBlack = false;
            alert("不能下这里！")
        } else {
            if (confirm("开启一局新游戏？")) {
                location.reload();
            }
        }

    }
}

function getPosition(chessData) {

    var score = 0;
    var result = new Array(2);
    for(var y=0;y<LINE;y++){
        for(var x=0;x<LINE;x++){
            if(chessData[y][x] === 0){
                var value = analyze(x,y,2,chessData) + analyze(x,y,1,chessData);
                if(value>score){
                    result[0] = x;
                    result[1] = y;
                    score = value;
                }
            }
        }
    }

    return result;
}

function analyze(x,y,color,chessData) {

    var value = new Array(LINE);
    for(var j=0;j<LINE;j++){
        value[j] = new Array(LINE);
        for(var i=0;i<LINE;i++){
            value[j][i] = chessData[j][i];
        }
    }

    value[y][x] = color;
    var result = 0;

    /*
    主场优势
     */
    if(color===2){
        result += 100;
    }

    result += leftRight(x,y,color,value);
    result += topBottom(x,y,color,value);
    result += leftTop(x,y,color,value);
    result += rightTop(x,y,color,value);
    return result;

}

function leftRight(x, y, color,value) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var live = 0;
    var count = 0;

    for(var i=x;i>=0;i--){
        if(value[y][i] === color){
            count++;
        }else if(value[y][i] === 0){
            live++;
            i=-1;
        }else {
            death++;
            i=-1;
        }
    }

    for(var j=x;j<LINE;j++){
        if(value[y][j] === color){
            count++;
        }else if(value[y][j] === 0){
            live++;
            j=LINE;
        }else {
            death++;
            j=LINE;
        }
    }

    return model(--count, death);

}

function topBottom(x, y, color,value) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var live = 0;
    var count = 0;

    for(var i=y;i>=0;i--){
        if(value[i][x] === color){
            count++;
        }else if(value[i][x] === 0){
            live++;
            i=-1;
        }else {
            death++;
            i=-1;
        }
    }

    for(var j=y;j<LINE;j++){
        if(value[j][x] === color){
            count++;
        }else if(value[j][x] === 0){
            live++;
            j=LINE;
        }else {
            death++;
            j=LINE;
        }
    }

    return model(--count, death);

}

function leftTop(x, y, color,value) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var live = 0;
    var count = 0;

    for(var i=y,j=x;i>=0 && j>=0;i--,j--){
        if(value[i][j] === color){
            count++;
        }else if(value[i][j] === 0){
            live++;
            i=-1;
            j=-1;
        }else {
            death++;
            i=-1;
            j=-1;
        }
    }

    for(var m=y,n=x;m<LINE && n<LINE;m++,n++){
        if(value[m][n] === color){
            count++;
        }else if(value[m][n] === 0){
            live++;
            m=LINE;
            n=LINE;
        }else {
            death++;
            m=LINE;
            n=LINE;
        }
    }

    return model(--count, death);

}

function rightTop(x, y, color,value) {
    var death = 0; //0表示两边都没堵住,且可以成5，1表示一边堵住了，可以成5,2表示是死棋，不予考虑
    var live = 0;
    var count = 0;

    for(var i=y,j=x;i>=0 && j<LINE;i--,j++){
        if(value[i][j] === color){
            count++;
        }else if(value[i][j] === 0){
            live++;
            i=-1;
            j=LINE;
        }else {
            death++;
            i=-1;
            j=LINE;
        }
    }

    for(var m=y,n=x;m<LINE && n>=0;m++,n--){
        if(value[m][n] === color){
            count++;
        }else if(value[m][n] === 0){
            live++;
            m=LINE;
            n=-1;
        }else {
            death++;
            m=LINE;
            n=-1;
        }
    }

    return model(--count, death);

}
/**五子棋AI
 *思路：对棋盘上的每一个空格进行估分，电脑优先在分值高的点落子
 * 棋型：
 * 〖五连〗只有五枚同色棋子在一条阳线或阴线上相邻成一排
 * 〖成五〗含有五枚同色棋子所形成的连，包括五连和长连。
 * 〖活四〗有两个点可以成五的四。
 * 〖冲四〗只有一个点可以成五的四。
 * 〖死四〗不能成五的四。
 * 〖三〗在一条阳线或阴线上连续相邻的5个点上只有三枚同色棋子的棋型。
 * 〖活三〗再走一着可以形成活四的三。
 * 〖连活三〗即：连的活三（同色棋子在一条阳线或阴线上相邻成一排的活三）。简称“连三”。
 * 〖跳活三〗中间隔有一个空点的活三。简称“跳三”。
 * 〖眠三〗再走一着可以形成冲四的三。
 * 〖死三〗不能成五的三。
 * 〖二〗在一条阳线或阴线上连续相邻的5个点上只有两枚同色棋子的棋型。
 * 〖活二〗再走一着可以形成活三的二。
 * 〖连活二〗即：连的活二（同色棋子在一条阳线或阴线上相邻成一排的活二）。简称“连二”。
 * 〖跳活二〗中间隔有一个空点的活二。简称“跳二”。
 * 〖大跳活二〗中间隔有两个空点的活二。简称“大跳二”。
 * 〖眠二〗再走一着可以形成眠三的二。
 * 〖死二〗不能成五的二。
 * 〖先手〗对方必须应答的着法，相对于先手而言，冲四称为“绝对先手”。
 * 〖三三〗一子落下同时形成两个活三。也称“双三”。
 * 〖四四〗一子落下同时形成两个冲四。也称“双四”。
 * 〖四三〗一子落下同时形成一个冲四和一个活三。
 * 分值表
 * 成5:100000分
 * 活4：10000分
 * 活3+冲4:5000分
 * 眠3+活2：2000分
 * 眠2+眠1:1分
 * 死棋即不能成5的是0分
 *
 */
function model(count, death) {
    var LEVEL_ONE = 0;//单子
    var LEVEL_TWO = 1;//眠2，眠1
    var LEVEL_THREE = 1500;//眠3，活2
    var LEVEL_FOUR = 4000;//冲4，活3,跳活三
    var LEVEL_FIVE = 10000;//活4,连活三,四四,四三
    var LEVEL_SIX = 100000;//成5

    if(count===1){
        switch (death){
            case 0:
                return LEVEL_ONE;
            case 1:
                return LEVEL_TWO;
            case 2:
                return LEVEL_ONE;
        }
    }else if(count===2){
        switch (death){
            case 0:
                return LEVEL_THREE;
            case 1:
                return LEVEL_TWO;
            case 2:
                return LEVEL_ONE;
        }
    }else if(count===3){
        switch (death){
            case 0:
                return LEVEL_FOUR;
            case 1:
                return LEVEL_THREE;
            case 2:
                return LEVEL_ONE;
        }
    }else if(count===4){
        switch (death){
            case 0:
                return LEVEL_FIVE;
            case 1:
                return LEVEL_FOUR;
            case 2:
                return LEVEL_ONE;
        }
    }else if(count>=5){
        return LEVEL_SIX;
    }else {
        return LEVEL_ONE;
    }

}