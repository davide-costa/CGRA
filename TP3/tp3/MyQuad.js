/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene) {
	CGFobject.call(this,scene);

	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
            -0.5, -0.5, 0, //0
            0.5, -0.5, 0, //1
            -0.5, 0.5, 0, //2
            0.5, 0.5, 0 //3
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
	

	

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
