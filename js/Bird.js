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