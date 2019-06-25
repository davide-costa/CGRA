var degToRad = Math.PI / 180.0;

/**
 * MySphere
 * @constructor
 */
function MySphere(scene, slices, stacks)
{
	CGFobject.call(this, scene);

	this.semi_sphere1 = new MySemiSphere(scene, slices, stacks);
	this.semi_sphere2 = new MySemiSphere(scene, slices, stacks);

	this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function()
{
	//this.primitiveType = this.scene.gl.TRIANGLES;
	//this.initGLBuffers();
};

MySphere.prototype.display = function()
{
	this.scene.pushMatrix();
	this.semi_sphere1.display();
	this.scene.rotate(180 * degToRad, 1, 0, 0);
	this.semi_sphere2.display();
	this.scene.popMatrix();
};