;(function () {
    var Game = window.Game = class Game {
        constructor(id) {
            //得到画布
            this.canvas = document.getElementById(id)
            //上下文
            this.ctx = this.canvas.getContext("2d")
            // 请求文件路径
            this.RtextURL = "R.json"
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