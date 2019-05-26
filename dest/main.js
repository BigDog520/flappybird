;(function(){
    var Actor = window.Actor = class Actor {
        constructor(){

        }
        update () {
            
        }
        render () {
            throw new Error("必须重弄写render方法")
        }

    }
})()
;(function(){
    var Background = window.Background = class Background extends Actor {
        constructor(){
            // 调用超类
            super()
            // 随机选择 白天或 黑夜
            this.dayorNing = Math.round(Math.random())
            // 自己的图片
            this.imageName = (["bg_day","bg_night"])[this.dayorNing]
            // 自己的图片，已经被game类的R加载完毕了
            this.image = game.R[this.imageName]
            // 背景偏移量
            this.x = 0
            // 背景移动速度
            this.speed = 1
            
        }
        // 主循环帮我们每帧调用update
        update () {
            this.x -= this.speed
            if(this.x < -288){
                this.x = 0
            }
        }
        render () {
            // 渲染三张图片，目的是无缝连续滚动
            game.ctx.drawImage(this.image,this.x,0,288,520)
            game.ctx.drawImage(this.image,this.x + 288,0,288,520)
            game.ctx.drawImage(this.image,this.x + 288 * 2,0,288,520)
        }

    }
})()
;(function(){
    var Bird = window.Bird = class Bird extends Actor {
        constructor(){
            // 调用超类
            super()
            this.imageDown = game.R.pipe_down
            // 随机鸟的颜色 0 1 2
            this.color = parseInt (Math.random() *3)
            //决定小鸟颜色
            this.imageArr = [
                game.R["bird"+this.color+"_0"],
                game.R["bird"+this.color+"_1"],
                game.R["bird"+this.color+"_2"]
            ]
            // 翅膀状态
            this.wingStep = 0
            this.x = game.canvas.width * ( 1- 0.618 )
            this.y = 100
            // 表示鸟的 小帧数
            this.birdfno = 0
            // 角度
            this.d = 0
            // 能量
            this.hasEnergy = false

        }
        // 主循环帮我们每帧调用update
        update () {
            
            //每固定帧数 改变翅膀状态
            this.wink()
            

            // 小鸟掉落/上升
            if(!this.hasEnergy){
                this.y += this.birdfno * 0.6;
                if(this.y > 420-35){
                    this.y = 420-25
                    game.sm.enter(4)
                    // clearInterval(game.time)
                }
            }else{
                this.y -= (20 - this.birdfno) * 0.4
                if (this.birdfno > 20) {
                    this.hasEnergy = false
                    this.birdfno = 0
                }
                if(this.y < 10){
                    this.hasEnergy = false
                    this.birdfno = -5
                    this.y = 10
                }
                
            }
            this.d += 0.03
            this.birdfno ++

            
            //计算自己碰撞检测的值
            this.T = this.y - 10   //13是图片上面空隙
            this.R = this.x + 13 
            this.B = this.y + 14
            this.L = this.x - 13
            
        }
        render () {
            game.ctx.save()
            game.ctx.translate(this.x , this.y )
            game.ctx.rotate(this.d)
            // game.ctx.fillRect(-17,-12,31,24)
            game.ctx.drawImage(this.imageArr[this.wingStep],-24,-24)
            game.ctx.restore()
        } 

        fly () {
            this.birdfno = 0
            this.d = -0.6
            this.hasEnergy = true
        }

        wink () {
            //每固定帧数 改变翅膀状态
            game.f % 4 == 0 && this.wingStep ++
            if(this.wingStep >2){
                this.wingStep = 0
            }
        }
    }
})()
;(function () {
    var Game = window.Game = class Game {
        constructor(id) {
            //得到画布
            this.canvas = document.getElementById(id)
            //上下文
            this.ctx = this.canvas.getContext("2d")
            // 请求文件路径
            this.RtextURL = "R/R.json"
            // 图片资源对象
            this.RObj = null
            this.R = {}
            // 定义帧编号
            this.f = 0;
            // 演员清单
            this.actor = []
            // 分数
            this.score = 0
        }

        loadResouce() {
            //已加载好的图片资源
            var count = 0
            var self = this
            var xhr = new XMLHttpRequest();
            self.ctx.font = "25px 微软雅黑"
            self.ctx.textAlign = "center"
            self.ctx.fillText("正在加载图片...", self.canvas.width / 2, self.canvas.height * (1 - 0.618))
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                    self.RObj = JSON.parse(xhr.responseText)
                    // 图片总数
                    var jsonlength = 0;
                    for (var ever in self.RObj) {
                        jsonlength++;
                    }
                    var imageAmount = jsonlength
                    for (var k in self.RObj) {
                        //new图片资源
                        self.R[k] = new Image();
                        self.R[k].src = self.RObj[k]
                        // 加载图片
                        self.R[k].onload = () => {
                            // 计数器+1
                            count++
                            //清屏
                            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
                            // 图片加载中提示
                            self.ctx.textAlign = "center"
                            self.ctx.fillText("正在加载图片..." + count + "/" + imageAmount, self.canvas.width / 2, self.canvas.height * (1 - 0.618))
                            //所有图片加载完毕
                            if (count === jsonlength) {
                                // 开始游戏
                                self.start();
                            }
                        }
                    }
                }
            }
            xhr.open("get", this.RtextURL, true);
            xhr.send(null)
        }

        start() {
            var self = this
            this.score = 0
            // 实例化自己的场景管理器
            this.sm = new SceneManager()

            // 游戏主循环
            this.time = setInterval(() => {
                // 清屏
                self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)

                // 场景管理器的渲染和更新
                self.sm.update()
                self.sm.render()

                //帧编号+1
                self.f++;
                self.ctx.textAlign = "left"
                self.ctx.font = "14px Consolas"
                self.ctx.fillText("FNO：" + self.f, 10, 20)
                self.ctx.fillText("场景号：" + self.sm.sceneNumber, 10, 40)

            }, 20);
        }
    }
})()
;(function(){
    var Land = window.Land = class Land extends Actor {
        constructor(){
            // 调用超类
            super()
            this.image = game.R.land
            // 大地偏移量
            this.x = 0
            // 大地移动速度
            this.speed = 2
        }
        // 主循环帮我们每帧调用update
        update () {
            this.x -= this.speed
            if(this.x < -336){
                this.x = 0
            }
        }
        render () {
            // 渲染三张图片，目的是无缝连续滚动
            game.ctx.drawImage(this.image,this.x,520-112)
            game.ctx.drawImage(this.image,this.x + 336,520-112)
            game.ctx.drawImage(this.image,this.x + 336 * 2,520-112)
            
        }

    }
})()
;(function(){
    var Pipe = window.Pipe = class Pipe extends Actor {
        constructor(){
            // 调用超类
            super()
            this.imageDown = game.R.pipe_down
            this.imageUp = game.R.pipe_up
            // 上管的高度
            this.height1 = 50 + parseInt(Math.random() * 170)
            // 间隙
            this.interspace = 130
            // 下面的高度 (可以计算出来)
            this.height2 = 520-112 - this.interspace - this.height1
            // 管子偏移量
            this.x = game.canvas.width
            // 管子移动速度
            this.speed = 2

            // 是否已经通过了管子
            this.alreadyPass = false
        }
        // 主循环帮我们每帧调用update
        update () {
            this.x -= this.speed

            // 碰撞检测，检查自己有没有碰撞到 鸟
            if(game.bird.R > this.x && game.bird.L < this.x+52){
                if(game.bird.T<this.height1 || game.bird.B > this.height1 + this.interspace ){
                    // console.log("碰撞");
                    // clearInterval(game.time)
                    game.sm.enter(4)

                }
            }
            // 加分
            if(game.bird.R > this.x + 52 && !this.alreadyPass){
                // 顺利通过
                game.score ++
                //标记为已经通过了
                this.alreadyPass = true
            }

            // 检测管子是否出了视口
            if(this.x < -250){
                for (let i = 0; i < game.pipeArr.length; i++) {
                    if(game.pipeArr === this){
                        game.pipeArr.splice(i, 1)
                    }
                    
                }
                
            }
        }
        render () {
            game.ctx.drawImage(this.imageDown,0,320-this.height1,52,this.height1,this.x,0,52,this.height1)
            game.ctx.drawImage(this.imageUp,0,0,52,this.height2,this.x,this.height1+this.interspace,52,this.height2)
        }

    }
})()
// 场景管理器
;(function(){
    var SceneManager = window.SceneManager = class SceneManager{
        constructor(){
            //1 表示欢迎 2表示教程 3表示游戏开始  4表示GAMEOVER
            this.sceneNumber = 1
            // 场景管理器辅助实例化东西
            game.bg = new Background()
            game.bird = new Bird()
            game.land = new Land()

            // logo的Y值
            this.logoY = -48
            // button_play的Y值
            this.button_playX = game.canvas.width / 2 - 58
            this.button_playY = game.canvas.height + 48
            // 小鸟的Y
            this.birdY = 180
            // 教程的Y 
            this.tutorialY = 160
            // 添加监听
            this.bindEvent();
        }
        update () {
            switch (this.sceneNumber) {
                case 1:
                    // logo 下移
                    this.logoY += 5
                    if(this.logoY > 120){
                        this.logoY = 120
                    }
                    // button 上移
                    this.button_playY -= 9.5
                    if(this.button_playY < 230){
                        this.button_playY = 230
                    }
                    break;

                // 二号场景 
                case 2:
                    game.bg.update()
                    game.land.update()
                    // 小鸟 扑打翅膀
                    game.bird.wink()
                    // 改变透明度
                    
                    if (this.tutorialOpacityIsDown){
                        if(this.tutorialOpacity - 0.05 < 0){
                            this.tutorialOpacity = 0
                        }else{
                            this.tutorialOpacity -= 0.05
                        }
                    }else{
                        this.tutorialOpacity += 0.05
                    }
                    if( this.tutorialOpacity <= 0 || this.tutorialOpacity > 1){
                        this.tutorialOpacityIsDown = !this.tutorialOpacityIsDown
                    }
                    break;
                // 3号场景 
                case 3:
                    game.bg.update()
                    game.land.update()
                    // 管子的实例化
                    game.f % 150 == 0 && game.pipeArr.push(new Pipe())
                    game.bird.update()
                    // 渲染所有管子
                    for (let i = 0; i < game.pipeArr.length; i++) {
                        game.pipeArr[i] && game.pipeArr[i].update()
                    }
                    break;
                case 4:
                    if(game.bird.y >= 395 -12 ){
                        this.isBirdLand = true;
                    }
                    
                    this.birddown++
                    console
                    if (!this.isBirdLand) {
                        // 更新爆炸特效
                        game.bird.y += this.birddown * 2.6
                    }

                    if(game.bird.y > 350 && this.bomStep <11){
                        this.bomStep++
                    }

                    // game over 下移
                    this.gameoverY += 5
                    if(this.gameoverY > 120){
                        this.gameoverY = 120
                    }
                    // button 上移
                    this.button_playY -= 9.5
                    if(this.button_playY < 230){
                        this.button_playY = 230
                    }

                    // console.log(game.bird.y);
                    // console.log(this.isBirdLand);

                    
                    break;
                default:
                    break;
            }
            
        }
        render () {
            // 根据当前是第几个场景，来决定做什么
            switch (this.sceneNumber) {
                case 1:
                    // 画背景
                    game.bg.render()
                    // 画大地
                    game.land.render()
                    // 画logo
                    game.ctx.drawImage(game.R["logo"],game.canvas.width / 2 - 89,this.logoY)
                    // 画button
                    game.ctx.drawImage(game.R["button_play"],this.button_playX,this.button_playY)
                    // 画鸟
                    game.bird.render()
                    game.bird.x = game.canvas.width / 2 
                    game.bird.y = this.birdY + 20
                    // game.ctx.drawImage(game.R["bird0_0"],game.canvas.width / 2 - 24,this.birdY)
                    break;

                // 二号场景 
                case 2:
                     // 画背景
                    game.bg.render()
                    // 画大地
                    game.land.render()
                    // 画鸟
                    game.bird.render()
                    // 画教程
                    game.ctx.save()
                    // 透明度
                    game.ctx.globalAlpha = this.tutorialOpacity 
                    game.ctx.drawImage(game.R["tutorial"],game.canvas.width / 2 - 57,this.tutorialY)
                    game.ctx.restore()
                    break;
                // 三号场景 
                case 3:
                     // 画背景
                    game.bg.render()
                    // 画大地
                    game.land.render()
                    
                    // 画管子
                    for (var i = 0; i < game.pipeArr.length; i++) {
                            // console.log(game.pipeArr)
                            game.pipeArr[i] && game.pipeArr[i].render()
                    }
                    // 画鸟
                    game.bird.render()
                    // 打印当前分数
                    // console.log(game.score);
                    
                    var scoreString = game.score.toString()
                    for(var i = 0; i < scoreString.length ; i++){
                        game.ctx.drawImage(game.R["score_0" + scoreString.charAt(i)],game.canvas.width / 2 - scoreString.length / 2 * 16 + 16 * i,30)
                    }
                    break;  
                case 4:   
                    // 渲染3 中内容
                    // 画背景
                    game.bg.render()
                    // 画大地
                    game.land.render()
                    
                    // 画管子
                    for (var i = 0; i < game.pipeArr.length; i++) {
                            // console.log(game.pipeArr)
                            game.pipeArr[i] && game.pipeArr[i].render()
                    }
                    if(!this.isBirdLand){
                        // 画鸟
                        game.bird.render()
                    }else{
                        // 渲染爆炸特效
                        game.ctx.drawImage(game.R["s" + this.bomStep],game.bird.x-24,game.bird.y-24,48,48)
                    }
                    var scoreString = game.score.toString()
                    for(var i = 0; i < scoreString.length ; i++){
                        game.ctx.drawImage(game.R["score_0" + scoreString.charAt(i)],game.canvas.width / 2 - scoreString.length / 2 * 16 + 16 * i,30)
                    }

                    // 画gameover
                    game.ctx.drawImage(game.R["gameover"],game.canvas.width / 2 - 102,this.gameoverY)
                    // 画button
                    game.ctx.drawImage(game.R["button_play"],this.button_playX,this.button_playY)
                    break;
                default:
                    break;
            }
        }


        // 进入场景 的一瞬间
        enter(number){
            this.sceneNumber = number
            switch (this.sceneNumber) {
                case 1:
                    //进入一号场景 这一瞬间 所做的事
                        // 恢复 Y 值
                    this.logoY = -48
                    this.button_playY = game.canvas.height
                    break;
                case 2:   
                    game.bird.y = 100
                    // tutorial 的透明度 0 ~ 1
                    this.tutorialOpacity = 1
                    // 标记 上升下降
                    this.tutorialOpacityIsDown = true
                    break;
                case 3:
                    game.bg = new Background()
                    game.bird = new Bird()
                    // game.bird.hasEnergy = false
                    // game.bird.y = 100
                    // game.bird.birdfno = 0
                    // game.bird.d = 0
                    game.bird.x = game.canvas.width * ( 1- 0.618 )
                    game.pipeArr = []
                    game.score = 0
                    break;
                case 4:
                    // 小鸟是否已经触底
                    this.isBirdLand = false
                    // 小鸟下落帧数
                    this.birddown = 0
                    //爆炸动画
                    this.bomStep = 0
                    this.gameoverY = -48
                    this.button_playY = game.canvas.height

                    break;
                default:
                    break;
            }
        }


        // 监听事件
        bindEvent(){
            var self = this

            //电脑版
            game.canvas.onmousedown = function (event) {
                clickHandler(event.clientX,event.clientY)
            }
            //手机
            game.canvas.addEventListener("touchstart",function(event){
                event.preventDefault()
                var finger = event.touches[0]
                clickHandler(finger.clientX,finger.clientY)
            },true)

           function clickHandler (x,y) {
                // 点击的时候判断当前是第几个场景
                switch (self.sceneNumber) {
                case 1:
                    if(x > self.button_playX && x < self.button_playX + 116 && y > self.button_playY && y < self.button_playY + 70){
                        // 说明用户点击到按钮上
                        self.enter(2)
                    }
                    break;
                case 2:
                    self.enter(3)
                    break;
                case 3:
                    game.bird.fly()
                    break;
                case 4:
                    if(x > self.button_playX && x < self.button_playX + 116 && y > self.button_playY && y < self.button_playY + 70){
                        // 说明用户点击到按钮上
                        self.enter(3)
                    }
                    break;
                default:
                    break;
                }
            }
        }
    }
})()