var degToRad = Math.PI / 180.0;

/**
 * MyClock
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyClock(scene) 
{
	CGFobject.call(this,scene);
	this.scene = scene;
	this.initBuffers();
};

MyClock.prototype = Object.create(CGFobject.prototype);
MyClock.prototype.constructor=MyClock;

MyClock.prototype.initBuffers = function()
{
	var slices = 12;
	var stacks = 1;
	this.cilinder = new MyCylinder(this.scene, slices, stacks);
	this.base = new MyBase(this.scene, slices);
	this.hours = new MyClockHand(this.scene, 0.8, 0.4);
	this.minutes = new MyClockHand(this.scene, 0.7, 0.7);
	this.seconds = new MyClockHand(this.scene, 0.4, 0.7);

	this.blackHandMaterial = new CGFappearance(this.scene);
	this.blackHandMaterial.setSpecular(0, 0, 0, 1);
	this.blackHandMaterial.setDiffuse(0, 0, 0, 1);
	this.blackHandMaterial.setShininess(1);

	this.redHandMaterial = new CGFappearance(this.scene);
	this.redHandMaterial.setSpecular(0.2, 0, 0, 1);
	this.redHandMaterial.setDiffuse(0.8, 0, 0, 1);
	this.redHandMaterial.setShininess(1);	
};

MyClock.prototype.display = function ()
{
	this.cilinder.display();
	this.scene.pushMatrix();
	this.scene.rotate(180 * degToRad, 0, 1, 0);
	this.base.display(); //Back base
	this.scene.popMatrix();
	this.scene.clockAppearence.apply();
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1);
	this.base.display(); //Front base
	this.scene.materialDefault.apply();
	this.scene.popMatrix();

	this.blackHandMaterial.apply();
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1.002);
	this.hours.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1.004);
	this.minutes.display();
	this.scene.popMatrix();

	this.redHandMaterial.apply();
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1.006);
	this.seconds.display();
	this.scene.popMatrix();

};

MyClock.prototype.update = function (currTime)
{
	var seconds_since_last_update = currTime / 1000;
	var minutes_since_last_update = seconds_since_last_update / 60;
	var hours_since_last_update = seconds_since_last_update / 3600; //3600, the number of seconds of an hour

	this.seconds.setAngle((seconds_since_last_update * (360/60)) % 360);
	this.minutes.setAngle((minutes_since_last_update * (360/60)) % 360);
	this.hours.setAngle((hours_since_last_update * (360/12)) % 360);
};

