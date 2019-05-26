var gp = require('gulp')
var concat = require('gulp-concat')
  

	// 把1.js 和2.js 合并为main.js 输出到dest/js目录下
	gp.src(['js/*.js']).pipe(concat('main.js')).pipe(gp.dest('./dest'))
