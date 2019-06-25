/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(scene, quad) {
	CGFobject.call(this,scene);
	this.cube = new MyUnitCube(this.scene);
    //this.quad.initBuffers();
};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor=MyTable;



MyTable.prototype.display = function()
{	
	this.deg2rad=Math.PI/180.0;
	
	//this.scene.pushMatrix();
	//this.scene.translate(0.5,0.5,0.5);
	//this.cube.display();
  	//this.scene.popMatrix();
  	


  	
	//Tampo
	this.scene.pushMatrix();
	this.scene.translate(2.5, 3.65, 1.5); //colocar o tampo no sitio certo
    this.scene.scale(5, 0.3, 3); //criar o tampo à custa do cubo
    this.cube.display();
    this.scene.popMatrix();

    //Perna esquerda tras
	this.scene.pushMatrix();
	this.scene.translate(0.15, 1.75, 0.15);
	this.scene.translate(0.2, 0, 0.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.cube.display();
    this.scene.popMatrix();

    //Perna esquerda frente
	this.scene.pushMatrix();
	this.scene.translate(0.15, 1.75, 3-0.15);
	this.scene.translate(0.2, 0, -0.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.cube.display();
    this.scene.popMatrix();

    //Perna direita tras
	this.scene.pushMatrix();
	this.scene.translate(5-0.15, 1.75, 0.15);
	this.scene.translate(-0.2, 0, 0.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.cube.display();
    this.scene.popMatrix();

    //Perna direita frente
	this.scene.pushMatrix();
	this.scene.translate(5-0.15, 1.75, 3-0.15);
	this.scene.translate(-0.2, 0, -0.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.cube.display();
    this.scene.popMatrix();

    
}