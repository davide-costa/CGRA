/**
* MyInterface
* @constructor
*/

function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
* init
* @param {CGFapplication} application
*/
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();

	//Clock_Mechanism
	this.gui.add(this.scene, 'Clock_Mechanism');

	// lights controls
	var group = this.gui.addFolder("Lights");
	group.open();
	group.add(this.scene, 'LeftFront');
	group.add(this.scene, 'RigthFront');
	group.add(this.scene, 'LeftBack');
	group.add(this.scene, 'RightBack');
	group.add(this.scene, 'Middle');
	group.add(this.scene, 'Clock');


	//Submarine speed
	this.gui.add(this.scene, 'Submarine_Speed', MIN_SUB_SPEED, MAX_SUB_SPEED).listen(); // Min and max; the listen allows to alter the velocity shown t Submarine_Speed in real time

	// Submarine Texture
	this.gui.add(this.scene, 'currSubmarineAppearance', { Steel : 0, Black : 1, Rusty_Iron : 2 });

	return true;
};

MyInterface.prototype.processKeyboard = function(event) 
{
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	var key_pressed = (ch = event.which) || (ch = event.keyCode);

	if(key_pressed == 102 || key_pressed == 102 - 32)
		this.scene.FireTorpedo();

};

MyInterface.prototype.processKeyUp = function(event)
{
	switch ((ch = event.which) || (ch = event.keyCode))
	{
	case (97): case(97 - 32):
		this.scene.Keys.left = false;
		break;
	case (100): case(100 - 32):
		this.scene.Keys.right = false;
		break;
	case (119): case(119 - 32):
		this.scene.Keys.front = false;
		break;
	case (115): case(115 - 32):
		this.scene.Keys.back = false;
		break;
	case (113): case(113 - 32):
		this.scene.Keys.down = false;
		break;
	case (101): case(101 - 32):
		this.scene.Keys.up = false;
		break;
	case (90): case (90 - 32):
		this.scene.Keys.rollLeft = false;
		break;
	case (67): case (67 - 32):
		this.scene.Keys.rollRight = false;
		break;
	case (112): case(112 - 32):
		this.scene.Keys.periscopeUp = false;
		break;
	case (108): case(108 - 32):
		this.scene.Keys.periscopeDown = false;
		break;
	};
};

MyInterface.prototype.processKeyDown = function(event)
{
	switch ((ch = event.which) || (ch = event.keyCode))
	{
	case (97): case(97 - 32):
		this.scene.Keys.left = true;
		break;
	case (100): case(100 - 32):
		this.scene.Keys.right = true;
		break;
	case (119): case(119 - 32):
		this.scene.Keys.front = true;
		break;
	case (115): case(115 - 32):
		this.scene.Keys.back = true;
		break;
	case (113): case(113 - 32):
		this.scene.Keys.down = true;
		break;
	case (101): case(101 - 32):
		this.scene.Keys.up = true;
		break;
	case (90): case (90 - 32):
		this.scene.Keys.rollLeft = true;
		break;
	case (67): case (67 - 32):
		this.scene.Keys.rollRight = true;
		break;
	case (112): case(112 - 32):
		this.scene.Keys.periscopeUp = true;
		break;
	case (108): case(108 - 32):
		this.scene.Keys.periscopeDown = true;
		break;
	}
}; 