"use strict";
(function(){
	class Point {
		constructor(x, y){
			this.x = x;
			this.y = y;
		}
	}
	class Triangle {
		constructor(p0, p1, p2, it) {
			this.points = [p0, p1, p2];
			this.subtriangles = it > 0 ? this.calculateSubTriangles(it - 1) : null;
		}
		render(){
			for(let i = 1, l = this.points.length; i < l; i++){
				ctx.beginPath();
				ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
				ctx.lineTo(this.points[i].x, this.points[i].y);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
			ctx.lineTo(this.points[0].x, this.points[0].y);
			ctx.stroke();
			if(this.subtriangles == null)
				return;
			for(let t of this.subtriangles){
				t.render();
			}
		}
		dist(p0, p1){
			return Math.sqrt(((p0.x - p1.x) * (p0.x - p1.x)) + ((p0.y - p1.y) * (p0.y - p1.y)));
		}
		midpoint(p0, p1){
			return new Point((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
		}
		// TwoThirds Point
		ttPoint(p0, p1){
			return new Point(p0.x + ((p1.x - p0.x) * (2 / 3)), p0.y + ((p1.y - p0.y) * (2 / 3)));
		}
		calculateSubTriangles(nit){
			return [
				new Triangle(this.ttPoint(this.points[0], this.midpoint(this.points[1], this.points[2])), this.points[1], this.points[2], nit),
				new Triangle(this.ttPoint(this.points[1], this.midpoint(this.points[2], this.points[0])), this.points[2], this.points[0], nit),
				new Triangle(this.ttPoint(this.points[2], this.midpoint(this.points[0], this.points[1])), this.points[0], this.points[1], nit)
			];
		}
	}
	function rad (angle) {
		return angle * (Math.PI / 180);
	}
	let width = window.innerWidth,
		height = window.innerHeight,
		padding = 40;
	let iterations = Math.min(width, height) / 8;
	let c = document.getElementById("c"),
		ctx = c.getContext("2d");
	function render(){
		c.width = width;
		c.height = height;

		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, width, height);
		/*let tRadius = padding + ((2 / 3) * (height - (padding * 2)));
		var grd = ctx.createRadialGradient(width / 2, tRadius, 40, width / 2, tRadius, tRadius * 2);
		grd.addColorStop(0, "#000000");
		grd.addColorStop(0.5, "#000000");
		grd.addColorStop(0.500000001, "#ff0000");
		grd.addColorStop(1, "#484848");
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, width, height);*/

		ctx.globalCompositeOperation = "lighter"; // "screen" also has a similar effect but a less of a vivid blue
		ctx.strokeStyle = "#3383FF";
		ctx.lineWidth =  0.05;

		let tHeight = height - (padding * 2);
		let b = tHeight / (Math.sqrt(3) / 2);
		console.log(tHeight, b);
		let t = new Triangle(
			new Point(width / 2, padding),
			new Point((width / 2) - (b * Math.cos((Math.PI * 4) / 3)), padding - (b * Math.sin((Math.PI * 4) / 3))),
			new Point((width / 2) - (b * Math.cos((Math.PI * 5) / 3)), padding - (b * Math.sin((Math.PI * 5) / 3))),
			iterations
		);
		t.render();

		/*ctx.globalCompositeOperation = "source-over";
		ctx.beginPath();
		ctx.arc(width / 2, tRadius, 20, 0, 2 * Math.PI, false);
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
		ctx.stroke();*/
	}
	~function init(){
		render();
		window.addEventListener("resize", () => {
			height = window.innerHeight;
			width = window.innerWidth;
			render();
		})
	}();
})();
