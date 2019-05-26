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