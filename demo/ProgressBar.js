/*我们封装进度条本质上就是把两个Konva的矩形组合在一起，一个充当内部的动态区域，一个做外边框*/
/*Konva这个库的本质就是用类似于Konva.Rect这种形状api创建图形，然后只要是我们把这个图形添加到“层”上，（如果这个层属于某个“舞台”，其实舞台就相当于原生的canvas区域）就能在层上展示出来我们创建的图形*/
class ProgressBar {
	//用配置对象做参数，要优于若干单独变量
	constructor(option) {
	    this.x = option.x || 0; //进度条的x坐标
		this.y = option.y || 0; //进度条的y坐标
		this.w = option.w || 0;	//进度条的宽度
		this.h = option.h || 0; //进度条的高度
		
		this.fillStyle = option.fillStyle || 'red';
		this.strokeStyle = option.strokeStyle || 'black';
		
		//定义内部的进度条矩形
		var innerRect = new Konva.Rect({
			x: this.x,
			y: this.y,
			width: 0,
			height: this.h,
			fill: this.fillStyle,
			cornerRadius: 1/2 * this.h,
			id: 'innerRect',
		});
		
		//添加一个外边框的矩形
		var outerRect = new Konva.Rect({
			x: this.x,
			y: this.y,
			width: this.w,
			height: this.h,
			cornerRadius: 1/2 * this.h,
			stroke: this.strokeStyle,
		});
		
		//我们先创建一个group组，用这个组来组合两个独立的矩形
		//创建组（new Konva.Group）时配置对象的x,y是指这个组相对于舞台的位置，然后组内的元素的x,y都是相对于组的位置（因为我们组的位置x y为0 0,所以组内的两个矩形的x,y就相当于处于舞台的位置）
		this.group = new Konva.Group({
			x: 0,
			y: 0,
		});
		this.group.add(innerRect);
		this.group.add(outerRect);
	}
	
	changeValue( val ) {
		//传进来的进度
		if(val > 1) {
			val = val / 100;
		}
		
		var width = this.w * val; //最终进度条内部矩形的宽度
		
		//进度条的动态效果是通过内部矩形改变宽度来实现的，所以我们首先要拿到内部的矩形，然后再用to方法动态改变矩形宽度
		
		//通过Group的findOne(_id选择器_)方法拿到内部的矩形
		var innerRect = this.group.findOne('#innerRect');
		
		//Konva绘制的图形调用to方法生成动画效果
		innerRect.to({
			//指明变化的属性
			width: width,
			//变化的时间
			duration: 0.3,
			//变化的函数模型
			easing: Konva.Easings.EasIn
		});
	}
	// 把当前创建的进度条添加到层中（上面说了，利用Konva创建的单独的图形或者是group图形组，添加到层上，才会生效，相当于原生canvas中stroke的作用，图形或者图形组在添加到层上之前就相当于原生canvas的画线）
	addToLayer(layer) {
		layer.add(this.group);
	}
}