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