

function MyUnitCube(scene) {
	CGFobject.call(this,scene);

	this.initBuffers();
};

MyUnitCube.prototype = Object.create(CGFobject.prototype);
MyUnitCube.prototype.constructor=MyUnitCube;

MyUnitCube.prototype.initBuffers = function () {
	this.vertices = [
           0.5,0.5,0.5,  //canto superior direito frente
           0.5,0.5,-0.5,  //canto superior direito tras
           -0.5,0.5,0.5,  //canto superior esquerdo frente
           -0.5,0.5,-0.5,  //canto superior esquerdo tras
           0.5,-0.5,0.5,  //canto inferior direito frente
           0.5,-0.5,-0.5,  //canto inferior direito tras
           -0.5,-0.5,0.5,  //canto inferior esquerdo frente
           -0.5,-0.5,-0.5,  //canto inferior esquerdo tras
			];

	this.indices = [
          0,4,1,  //face lateral direita
          5,1,4,
          2,3,7, //face lateral esquerda
          7,6,2,
          4,0,2,  //face frontal
          2,6,4,
          7,3,1,  //face traseira
          1,5,7,
          1,3,2,  //face cima
          0,1,2,
          6,7,5, //face baixo
          5,4,6
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};