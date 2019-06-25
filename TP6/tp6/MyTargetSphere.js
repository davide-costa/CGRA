var degToRad = Math.PI / 180.0;

/**
 * MyTargetSphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTargetSphere(scene, x_pos, y_pos, z_pos, radius, appearance)
{
	CGFobject.call(this, scene);
	this.scene = scene;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.z_pos = z_pos;
	this.radius = radius;
	this.appearance = appearance;
	this.initial_volume = (4 * Math.PI * Math.pow(this.radius, 3)) / 3;
	this.initBuffers();
};

MyTargetSphere.prototype = Object.create(CGFobject.prototype);
MyTargetSphere.prototype.constructor = MyTargetSphere;

MyTargetSphere.prototype.initBuffers = function()
{
	this.sphere_target = new MySphere(this.scene, 20, 20);

};

MyTargetSphere.prototype.display = function()
{
	this.scene.pushMatrix();
	this.scene.translate(this.x_pos, this.y_pos, this.z_pos);
	this.scene.scale(this.radius, this.radius, this.radius);
	this.appearance.apply();
	this.sphere_target.display();
	this.scene.popMatrix();
};

MyTargetSphere.prototype.IncrementSize = function(increment)
{
	this.radius += increment;
	return this.radius;
};

MyTargetSphere.prototype.IncrementPositions = function(x_increment, y_increment, z_increment)
{
	this.x_pos += x_increment;
	this.y_pos += y_increment;
	this.z_pos += z_increment;
};

MyTargetSphere.prototype.SetAppearance = function(appearance)
{
	this.appearance = appearance;
};

MyTargetSphere.prototype.GetPosition = function()
{
	return[this.x_pos, this.y_pos, this.z_pos];
};

MyTargetSphere.prototype.GetInitialVolume = function()
{
	return this.initial_volume;
};

MyTargetSphere.prototype.GetVolume = function()
{
	return (4 * Math.PI * Math.pow(this.radius, 3)) / 3;
};


