var degToRad = Math.PI / 180.0;
/**
 * MyClockHand
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyClockHand(scene, size_x, size_y, minS = 0, maxS = 1, minT = 0, maxT = 1) {
	CGFobject.call(this,scene);
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;
	this.size_x = size_x;
	this.size_y = size_y;
	
	this.initBuffers();
};

MyClockHand.prototype = Object.create(CGFobject.prototype);
MyClockHand.prototype.constructor=MyClockHand;

MyClockHand.prototype.initBuffers = function () {
	this.vertices = [
            -0.05, -0.5, 0, //0
            0.05, -0.5, 0, //1
            -0.05, 0.5, 0, //2
            0.05, 0.5, 0 //3
			];

	
	this.indices = [
            0, 1, 2,
            1, 3, 2
        ];
	
	//TODO check this
	this.normals = [
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1
	];
	
	this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
	]
	

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyClockHand.prototype.setAngle = function(angle)
{
	this.angle = angle * degToRad;
};

MyClockHand.prototype.display = function()
{
	this.scene.pushMatrix();
	this.scene.rotate(-this.angle, 0, 0, 1);
	this.scene.scale(this.size_x, this.size_y, 1);
	this.scene.translate(0, 0.5, 0);
	CGFobject.prototype.display.call(this);
	this.scene.popMatrix();
};
