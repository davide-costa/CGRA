var degToRad = Math.PI / 180.0;

/**
 * MyTargetCube
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTargetCube(scene, x_pos, y_pos, z_pos, size, appearance)
{
	CGFobject.call(this, scene);
	this.scene = scene;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.z_pos = z_pos;
	this.size = size;
	this.appearance = appearance;
	this.initial_volume = Math.pow(size, 3);

	this.initBuffers();
};

MyTargetCube.prototype = Object.create(CGFobject.prototype);
MyTargetCube.prototype.constructor = MyTargetCube;

MyTargetCube.prototype.initBuffers = function()
{
	this.cube_target = new MyUnitCubeQuad(this.scene);

};

MyTargetCube.prototype.display = function()
{
	this.scene.pushMatrix();
	this.scene.translate(this.x_pos, this.y_pos, this.z_pos);
	this.scene.scale(this.size, this.size, this.size);
	this.appearance.apply();
	this.cube_target.display();
	this.scene.popMatrix();
};

MyTargetCube.prototype.IncrementSize = function(increment)
{
	this.size += increment;
};

MyTargetCube.prototype.IncrementPositions = function(x_increment, y_increment, z_increment)
{
	this.x_pos += x_increment;
	this.y_pos += y_increment;
	this.z_pos += z_increment;
};

MyTargetCube.prototype.SetAppearance = function(appearance)
{
	this.appearance = appearance;
};

MyTargetCube.prototype.GetPosition = function()
{
	return[this.x_pos, this.y_pos, this.z_pos];
};


MyTargetCube.prototype.GetInitialVolume = function()
{
	return this.initial_volume;
};

MyTargetCube.prototype.GetVolume = function()
{
	return Math.pow(this.size, 3);
};