/**
 * MyClock
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyClock(scene) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.initBuffers();
	this.real_init_time = Date.now();
	this.clock_init_time = 1492702245000;  //15:30:45 de 20/04/2017 para começar na hora que é pedida em ms, usando o dia da execuçao do codigo
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


	this.hours.setAngle(90);
	this.minutes.setAngle(180);
	this.seconds.setAngle(270);
	
}

MyClock.prototype.display = function ()
{
	this.scene.marmoreAppearence.apply();
	this.cilinder.display();
	this.scene.clockAppearence.apply();
	this.base.display();
	this.scene.materialDefault.apply();

	this.blackHandMaterial.apply();
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1.001);
	this.hours.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1.002);
	this.minutes.display();
	this.scene.popMatrix();

	this.redHandMaterial.apply();
	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1.003);
	this.seconds.display();
	this.scene.popMatrix();

};

MyClock.prototype.update = function (currTime)
{
	var seconds_since_last_update = ((currTime - this.real_init_time) + this.clock_init_time) / 1000;  //to obtain the seconds since last update on clock_hand..currTime in ms
	var minutes_since_last_update = seconds_since_last_update / 60;
	var hours_since_last_update = seconds_since_last_update / 3600; //3600, the number of seconds of an hour

	this.seconds.setAngle((seconds_since_last_update * (360/60)) % 360);
	this.minutes.setAngle((minutes_since_last_update * (360/60)) % 360);
	this.hours.setAngle((hours_since_last_update * (360/12)) % 360);
};

