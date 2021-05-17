// Uniform mass center triangle fractal
// Jeremy Rifkin 2017, updated 2021

"use strict";

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Triangle {
	constructor(p0, p1, p2, it) {
		this.points = [p0, p1, p2];
		this.subtriangles = it > 0 ? this.create_sub_triangles(it - 1) : null;
	}

	render(ctx) {
		ctx.beginPath();
		for(let i = 0; i < this.points.length; i++){
			ctx.moveTo(this.points[i].x, this.points[i].y);
			ctx.lineTo(this.points[(i + 1) % this.points.length].x,
			           this.points[(i + 1) % this.points.length].y);
		}
		ctx.stroke();
		if(this.subtriangles == null)
			return;
		for(let t of this.subtriangles){
			t.render(ctx);
		}
	}
	
	midpoint(p0, p1) {
		return new Point((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
	}

	// point 2/3rds between p0 -> p1
	two_thirds(p0, p1) {
		return new Point(p0.x + ((p1.x - p0.x) * (2 / 3)), p0.y + ((p1.y - p0.y) * (2 / 3)));
	}
	
	create_sub_triangles(nit) {
		return [
			new Triangle(this.two_thirds(this.points[0], this.midpoint(this.points[1], this.points[2])), this.points[1], this.points[2], nit),
			new Triangle(this.two_thirds(this.points[1], this.midpoint(this.points[2], this.points[0])), this.points[2], this.points[0], nit),
			new Triangle(this.two_thirds(this.points[2], this.midpoint(this.points[0], this.points[1])), this.points[0], this.points[1], nit)
		];
	}
}

let width = window.innerWidth,
	height = window.innerHeight,
	padding = 40;

let c = document.getElementById("c"),
	ctx = c.getContext("2d");
	
function render() {
	let iterations = Math.min(Math.ceil(Math.min(width, height) / 110), 10);
	console.log(iterations);

	c.width = width;
	c.height = height;

	// clear background
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);

	// prepare for rendering the triangle
	ctx.globalCompositeOperation = "lighter"; // "screen" also has a similar effect but a less of a vivid blue
	ctx.strokeStyle = "#3383FF";
	ctx.lineWidth = 0.05 * Math.pow(2, 8 - Math.min(iterations, 8)); //0.05;

	// setup triangle
	let tHeight = height - (padding * 2);
	let b = tHeight / (Math.sqrt(3) / 2);
	let t = new Triangle(
		new Point(width / 2, padding),
		new Point((width / 2) - (b * Math.cos((Math.PI * 4) / 3)), padding - (b * Math.sin((Math.PI * 4) / 3))),
		new Point((width / 2) - (b * Math.cos((Math.PI * 5) / 3)), padding - (b * Math.sin((Math.PI * 5) / 3))),
		iterations
	);

	// render triangle
	t.render(ctx);
}

+function(){
	render();
	window.addEventListener("resize", () => {
		height = window.innerHeight;
		width = window.innerWidth;
		render();
	});
}();
