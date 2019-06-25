/**
 * MyUnitCube
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyUnitCube(scene) {
	CGFobject.call(this,scene);

	this.initBuffers();
};

MyUnitCube.prototype = Object.create(CGFobject.prototype);
MyUnitCube.prototype.constructor=MyUnitCube;

MyUnitCube.prototype.initBuffers = function () {
	this.vertices = [
	-0.5,-0.5,0.5, //0
	0.5,-0.5,0.5, //1
	0.5,0.5,0.5, //2
	-0.5,0.5,0.5, //3
	-0.5,-0.5,-0.5, //4
	0.5,-0.5,-0.5, //5
	0.5,0.5,-0.5, //6
	-0.5,0.5,-0.5 //7
			];

	this.indices = [
            3,0,1, //frente
            2,3,1,

            2,1,5, //direita
            5,6,2,

            2,6,7, //cima
            7,3,2,

            3,7,4, //esquerda
            4,0,3,
            
			5,1,0, //baixo
			0,4,5,

			7,6,5, //atras
			5,4,7,



        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
