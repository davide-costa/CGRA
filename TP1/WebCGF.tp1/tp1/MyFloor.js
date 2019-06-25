/**
 * MyFloor
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyFloor(scene, quad) {
	CGFobject.call(this,scene);
	this.quad = new MyQuad(this.scene);
    //this.quad.initBuffers();
};

MyFloor.prototype = Object.create(CGFobject.prototype);
MyFloor.prototype.constructor=MyFloor;



MyFloor.prototype.display = function()
{	
	this.deg2rad=Math.PI/180.0;
	
	//Tampo
	this.scene.pushMatrix();
	this.scene.scale(8, 0.1, 6); 
	this.scene.rotate(-90*this.deg2rad, 1, 0, 0);
    this.quad.display();
    this.scene.popMatrix();
    
}