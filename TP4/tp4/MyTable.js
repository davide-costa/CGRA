/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(scene) {
	CGFobject.call(this,scene);
	this.cube = new MyUnitCubeQuad(this.scene);
	
	
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
  	
  	this.scene.TableLegsMaterial.apply();
  	
    // pernas
 	this.scene.pushMatrix();
 	this.scene.translate(2, 3.5 / 2, 1);
 	this.scene.scale(0.3, 3.5, 0.3);
 	this.cube.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(2, 3.5 / 2, -1);
 	this.scene.scale(0.3, 3.5, 0.3);
 	this.cube.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(-2, 3.5 / 2, 1);
 	this.scene.scale(0.3, 3.5, 0.3);
 	this.cube.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(-2, 3.5 / 2, -1);
 	this.scene.scale(0.3, 3.5, 0.3);
 	this.cube.display();
 	this.scene.popMatrix();
	
	// tampo
	this.scene.TableTopMaterial.apply();
	this.scene.tableAppearance.apply();
	
 	this.scene.pushMatrix();
 	this.scene.translate(0, 3.5, 0);
 	this.scene.scale(5, 0.3, 3);
 	this.cube.display();
 	this.scene.popMatrix();

 	this.scene.materialDefault.apply();
}