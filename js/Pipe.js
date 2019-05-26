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