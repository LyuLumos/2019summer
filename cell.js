// 初始化对象
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
// 定义游戏需要的数据
var score = 0; // 得分
var length = 0; // 总水平运动距离
var upSpeed = 3; // 上升速度
var downSpeed = 0.2; // 自动下落速度
var obsDistance = 150; // 障碍上下距离
var divDistance = 110; // 障碍左右距离
var preDistance = 15; // 碰撞距离控制
var direction = 'left';
var cell = {
	// 初始坐标
	x: canvas.width / 2,
	y: canvas.height / 2,
	// 竖直方向速度
	dy: 1
};
var Obstacles = []; // 障碍
// 监视键盘输入
document.onkeydown = function (e) {
	var code = e.keyCode;
	if (e.charCode) {
		code = e.charCode;
	}
	switch (code) {
		case 38:
			direction = 'up';
			break; // 方向键上键
		default:
			direction = 'down';
			break;
	}
}
// 生成方块
function generateCell() {
	// 画方块
	context.beginPath();
	context.rect(cell.x, cell.y, 20, 20);
	context.fillStyle = "yellow";
	context.fill();
	context.closePath();
	// 方块移动
	cell.y += cell.dy;
	cell.dy += downSpeed;
	if (direction == 'up') {
		cell.dy = -upSpeed;
		direction = '';
	}
}
// 生成障碍
function generateObstacles() {
	for (p of Obstacles) {
		// 画顶部障碍
		context.beginPath();
		context.rect(p.top.x, p.top.y, p.top.width, p.top.height);
		context.fillStyle = "#008000"; //深绿色
		context.fill();
		context.closePath();

		// 画底部障碍
		p.bottom.y = p.top.height + obsDistance;
		p.bottom.height = (canvas.height - p.bottom.y);

		context.beginPath();
		context.rect(p.bottom.x, p.bottom.y, p.bottom.width, p.bottom.height);
		context.fillStyle = "#008000";
		context.fill();
		context.closePath();

		// 障碍向左移动
		p.bottom.x -= 1;
		p.top.x -= 1;

		// 障碍出界，删除首元素
		if (p.top.x < -10) {
			Obstacles.shift();
		}

		// 判断是否死亡，重载
		if (isDeath()) {
			alert('Game over! Your score : ' + score);
			window.location.reload();
		}
		// 增加难度
		if (score % 10 == 0) {
			score += 1;
			obsDistance -= 5;
		}
	}
}
// 判断死亡
function isDeath() {
	return (
		attBottom(cell, p.bottom) || // 撞上底部障碍
		attTop(cell, p.top) || // 撞上顶部障碍
		cell.y + 10 >= canvas.height || // 出下界
		cell.y - 10 <= 0 // 出上界
	)
}
// 触底部障碍
function attBottom(a, p) {
	return (
		(a.x + preDistance > p.x) &&
		(a.x < p.x + preDistance) &&
		(a.y > p.y || a.y + preDistance > p.y)
	);
}
// 触顶部障碍
function attTop(a, p) {
	return (
		(a.x + preDistance > p.x) &&
		(a.x < p.x + preDistance) &&
		(a.y < p.y + p.height)
	);
}
// 生成min至max的随机数
function Rand(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
// 程序循环函数
(function loop() {
	requestAnimationFrame(function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (length % divDistance == 0) {
			Obstacles.push({
				top: {
					x: canvas.width,
					y: 0,
					height: Rand(20, 300), // 顶部障碍长度
					width: 20,
				},
				bottom: {
					x: canvas.width,
					y: 0,
					width: 20,
				}
			});
			score++;
		}
		generateCell();
		generateObstacles();
		length++;
		loop();
	})
})();