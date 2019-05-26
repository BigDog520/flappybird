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