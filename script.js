var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var paddleHeight=10;
var paddleWidth=200;
let paddleX = (canvas.width-paddleWidth)/2;
let x = canvas.width / 2;
let y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var passLevelKey = false;
var rightPressed = false;
var leftPressed = false;
var score =0;
var showScore = 0;
var lives =3;
var level =1;
const brickRowCount = 3;
const brickColumnCount =5;
const brickWidth =75;
const brickHeight =20;
const brickPadding =10;
const brickOffsetTop =30;
const brickOffsetLeft =30;
const bricks =[];

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
document.addEventListener("mousemove",mouseMoveHandler, false);



for(let c=0;c<brickColumnCount;c++){
    bricks[c]=[];
    for(let r=0;r<brickRowCount;r++){
        var randomN = Math.floor(Math.random()*10)+1;
        var randomA = Math.floor(Math.random()*2);
        bricks[c][r] = {x:0,y:0,status:1,color:randomN,angle:randomA}
    }
}

function mouseMoveHandler(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX>0&&relativeX<canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e){
    if(e.key==="f"){
        passLevelKey = true;
    }
    if(e.key ==="Right"||e.key ==="ArrowRight"){
        rightPressed = true;
    }else if(e.key === "left" ||e.key ==="ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key ==="f"){
        passLevelKey=false;
    }
    if(e.key ==="Right"||e.key ==="ArrowRight"){
        rightPressed = false;
    }else if(e.key === "left" ||e.key ==="ArrowLeft"){
        leftPressed = false;
    }
}

function drawScore(){
    ctx.font="16px Arial";
    ctx.fillStyle="#0095DD";
    ctx.fillText("Score: "+showScore,8,20);
}
function drawLives(){
    ctx.font = "16 Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives,canvas.width-65,20);

}
function drawLevel(){
    ctx.font = "16 Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level "+level+"   Press F to jump current level",80,20);
}
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle="#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for(let c=0;c<brickColumnCount;c++){
        for(let r=0;r<brickRowCount;r++){
            if(bricks[c][r].status===1) 
            {
            const brickX = c*(brickWidth+brickPadding) + brickOffsetLeft;
            const brickY = r*(brickHeight+brickPadding) + brickOffsetTop;
            bricks[c][r].x=brickX;
            bricks[c][r].y=brickY;
            ctx.beginPath();
            ctx.rect(brickX,brickY,brickWidth,brickHeight);
            color = bricks[c][r].color;
            if(color<3){
                ctx.fillStyle="#0095DD";
            }else if(color <6){
                ctx.fillStyle='#00ffcc';
            }else{
                ctx.fillStyle='#ffff66';
            }
            ctx.fill();
            ctx.closePath();
            }                  
        }
    }
}

function collisionDetection(){
    for(let c=0;c<brickColumnCount;c++){
        for(let r=0;r<brickRowCount;r++){
            const b = bricks[c][r];
            if(b.status===1&&x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
                if(b.angle==1){
                    dx=-dx;
                }
                dy=-dy;
                b.status=0;
                if(b.color<3){
                    showScore+=1;
                }else if(b.color<6){
                    showScore+=2;
                }else{
                    showScore+=3;
                }
                
                
                score++;


                if(score===15 || score ===30 || score ===45){
                    level++;
                    if(level>=4){
                        alert("You win!")
                        document.location.reload();
                    }else{
                    alert("Next Level!");  
                    passLevelKey=false;
                    level++;
                    for(let c=0;c<brickColumnCount;c++){
                        for(let r=0;r<brickRowCount;r++){
                        bricks[c][r].status=1;
                        } 
                    }
                    x=canvas.width/2;
                    y=canvas.height-30;
                    dx=level+1;
                    dy=-1-level;
                    paddleWidth=paddleWidth-50;
                    paddleX=(canvas.width-paddleWidth)/2;
                    }
                }
            }
        }
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    drawLevel();
    collisionDetection();
    if(passLevelKey){
        alert("Next Level!");  
        passLevelKey=false;
        level++;
        for(let c=0;c<brickColumnCount;c++){
            for(let r=0;r<brickRowCount;r++){
                bricks[c][r].status=1;
            } 
       }
        x=canvas.width/2;
        y=canvas.height-30;
        dx=level+1;
        dy=-1-level;
        paddleWidth = paddleWidth-50;
        paddleX=(canvas.width-paddleWidth)/2;
        if(level == 2){
            score = 15;
        }else if(level==3){
            score = 30;
        }else{
            alert("You win!")
            score = 45;
            document.location.reload();
        }
    }


    if(x+dx>canvas.width -ballRadius || x+dx <ballRadius){
        dx=-dx;
    }
    if(y+dy <ballRadius){
        dy = -dy;
    }
    else if(y+dy>canvas.height-ballRadius){
        if(x>paddleX&&x<paddleX+paddleWidth){
            
            if(x>paddleX + paddleWidth/2){
                dx=Math.abs(dx);
            }else{
                dx=-Math.abs(dx);
            }
            
            dy=-dy;
        }
        else{
            lives--;
            if(!lives){
                alert("Game Over");
                document.location.reload();
            }
            else{
                x=canvas.width/2;
                y=canvas.height-30;
                dx=level+2;
                dy=-level-2;
                paddleX=(canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX<canvas.width-paddleWidth){
        paddleX+=7;
    }
    else if(leftPressed && paddleX>0){
        paddleX-=7;
    }
    x +=dx;
    y +=dy;
    requestAnimationFrame(draw);
}

draw();