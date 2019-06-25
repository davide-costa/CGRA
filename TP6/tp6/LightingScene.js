var degToRad = Math.PI / 180.0;

const CUBE = 0;
const SPHERE = 1;
const TARGETS_SIZE = 1.2; 


function LightingScene() 
{
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) 
{
	CGFscene.prototype.init.call(this, application);

// Materials
	this.materialDefault = new CGFappearance(this);

	this.floorAppearance = new CGFappearance(this);
	this.floorAppearance.setSpecular(0.1,0.1,0.1, 1);
	this.floorAppearance.setDiffuse(0.8,0.8,0.8, 1);
	this.floorAppearance.setShininess(1);
	this.floorAppearance.loadTexture("../resources/images/sand.png");
	this.floorAppearance.setTextureWrap("REPEAT", "REPEAT");

	this.ferroAppearance = new CGFappearance(this);
	this.ferroAppearance.setSpecular(0.1,0.1,0.1, 1);
	this.ferroAppearance.setDiffuse(0.8,0.8,0.8, 1);
	this.ferroAppearance.setShininess(1);
	this.ferroAppearance.loadTexture("../resources/images/ferro_enferrujado.png");

	this.steelAppearance = new CGFappearance(this);
	this.steelAppearance.setSpecular(0.1,0.1,0.1, 1);
	this.steelAppearance.setDiffuse(0.8,0.8,0.8, 1);
	this.steelAppearance.setShininess(1);
	this.steelAppearance.loadTexture("../resources/images/steel.png");

	this.BlackAppearance = new CGFappearance(this);
	this.BlackAppearance.setSpecular(0.1,0.1,0.1, 1);
	this.BlackAppearance.setDiffuse(0.8,0.8,0.8, 1);
	this.BlackAppearance.setShininess(1);
	this.BlackAppearance.loadTexture("../resources/images/black.png");

	this.clockAppearence = new CGFappearance(this);
	this.clockAppearence.setSpecular(0.2, 0.2, 0.2, 1);
	this.clockAppearence.setDiffuse(0.8, 0.8, 0.8, 1);
	this.clockAppearence.setShininess(100);
	this.clockAppearence.loadTexture("../resources/images/clock.png");

	this.lavaAppearence = new CGFappearance(this);
	this.lavaAppearence.setSpecular(0.9, 0.9, 0, 1);
	this.lavaAppearence.setDiffuse(0.9, 0.9, 0, 1);
	this.lavaAppearence.setEmission(0.9, 0.9, 0.9, 1)
	this.lavaAppearence.setShininess(100);
	this.lavaAppearence.loadTexture("../resources/images/lava.png");
	
	//enabling textures
	this.enableTextures(true);


//Interface

	this.Keys = {
			front: false,
			back : false,
		   	left : false,
			right : false,
			up: false,
			down: false,
			rollLeft: false,
			rollRight: false,
			periscopeUp: false,
			periscopeDown: false
		 };

	//ligths control
	this.LeftFront=true; 
	this.RigthFront=true; 
	this.LeftBack=true; 
	this.RightBack=true;
	this.Middle=true;
	this.Clock=true;

	//clock mechanism control
	this.clock_working = true;

	//speed control
	this.Submarine_Speed = 0.1;

	//textures manage
	this.currSubmarineAppearance = 0; //set first texture on the array as default
		//Data structures
		this.submarineAppearances = [];  //an array with all the texture to aplly to the submarine

		
		//Steel appearance
		this.submarineAppearances.push(this.steelAppearance);

		//Black appearance
		this.submarineAppearances.push(this.BlackAppearance);

		//Rusty Iron appearance
		this.submarineAppearances.push(this.ferroAppearance);


	this.initCameras();
	
	this.initLights();

	this.gl.clearColor(57/256, 135/256, 201/256, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);


	this.axis = new CGFaxis(this);

	this.submarine = new MySubmarine(this, 14.5, 6.5, 14.5, this.Submarine_Speed);

	this.torpedo_animation = false;
	this.explosion_effect = false;

	this.floor = new Plane(this, 100, 0, 5, 0, 5);

	this.column = new MyCylinder(this, 8, 20);

	this.clock = new MyClock(this);


	//instantiate targets
	this.targets = [];
	this.num_targets = Math.floor((Math.random() * 3) + 2);
	var targets_x_positions = [];
	var targets_z_positions = [];
	var x_pos;
	var y_pos = TARGETS_SIZE/2;
	var z_pos;

	for(var i = 0; i < this.num_targets; i++)
	{
		var first_attempt = true;
		while(first_attempt || this.AreTargetsOverlapped(targets_x_positions, targets_z_positions, x_pos, z_pos))
		{		
			first_attempt = false;
			x_pos = Math.floor((Math.random() * 29) + 1);
			z_pos = Math.floor((Math.random() * 29) + 1);
		}
		targets_x_positions.push(x_pos);
		targets_z_positions.push(z_pos);

		var target_type = Math.floor(Math.random() * 2);
		if(target_type == SPHERE)
			this.targets.push(new MyTargetSphere(this, x_pos, y_pos, z_pos, TARGETS_SIZE/2, this.BlackAppearance));
		else if(target_type == CUBE)
			this.targets.push(new MyTargetCube(this, x_pos, y_pos, z_pos, TARGETS_SIZE, this.BlackAppearance));
	}

	//update period to refresh the elements of te scene
	var date = new Date();
	this.lastCurrTime = date.getTime(); //time in milliseconds
	this.setUpdatePeriod(10);
	
};

LightingScene.prototype.initCameras = function() 
{
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.AreTargetsOverlapped = function(targets_x_positions, targets_z_positions, x_pos, z_pos) 
{
	for(var i = 0; i < targets_x_positions.length; i++)
	{
		if( (Math.abs(x_pos - targets_x_positions[i]) <= 1) && (Math.abs(z_pos - targets_z_positions[i]) <= 1) )
		return true;
	}

	return false;
};

LightingScene.prototype.initLights = function() 
{
	this.setGlobalAmbientLight(0, 0, 1.0, 1.0);
	
	// Positions for five lights
	this.lights[0].setPosition(0, 8, 0, 1);
	this.lights[0].setVisible(false);
		
	this.lights[1].setPosition(30, 8, 0, 1);
	this.lights[1].setVisible(false);

	this.lights[2].setPosition(0, 8, 30, 1);
	this.lights[2].setVisible(false);

	this.lights[3].setPosition(30, 8, 30, 1);
	this.lights[3].setVisible(false);

	this.lights[4].setPosition(15, 8, 15, 1);
	this.lights[4].setVisible(false);
	
	//this light allows to see the clock better
	this.lights[5].setPosition(14.5, 8.5, 2, 1);
	this.lights[5].setVisible(false);
};

LightingScene.prototype.updateLights = function() 
{
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}

LightingScene.prototype.display = function() 
{
// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();


// ---- END Background, camera and axis setup


// ---- BEGIN Primitive drawing section

	//Submarino
	this.pushMatrix();
	this.submarineAppearances[this.currSubmarineAppearance].apply();
	this.submarine.display();
	this.popMatrix();

	// Floor
	this.pushMatrix();
	this.translate(15, 0, 15);
	this.rotate(-90 * degToRad, 1, 0, 0);
	this.scale(30, 30, 0.2);
	this.floorAppearance.apply();
	this.floor.display();
	this.popMatrix();


	//Draw column to clock
	this.pushMatrix();
	this.translate(14.5, 0, 0.5);
	this.scale(0.4, 8, 0.4);
	this.rotate(90 * degToRad, -1, 0, 0);
	this.ferroAppearance.apply();
	this.column.display();
	this.popMatrix();

	//Draw clock
	this.pushMatrix();
	this.translate(14.5, 7.5, 0);
	this.clock.display();
	this.popMatrix();

	//Draw targets
	this.pushMatrix();
	for(var i = 0; i < this.num_targets; i++)
		this.targets[i].display();	
	this.popMatrix();
	

	if(this.torpedo_animation == true)
		this.torpedo.display();

	// ---- END Primitive drawing section
};

//added for tp6
LightingScene.prototype.Clock_Mechanism = function ()
{ 
	if(this.clock_working == true)
		this.clock_working = false;
	else
	 	this.clock_working = true;
};

LightingScene.prototype.LightManager = function()
{
	if(this.LeftFront == true)
		this.lights[0].enable();
	else
		this.lights[0].disable();

	if(this.RigthFront == true)
		this.lights[1].enable();
	else
		this.lights[1].disable();

	if(this.LeftBack == true)
		this.lights[2].enable();
	else
		this.lights[2].disable();

	if(this.RightBack == true)
		this.lights[3].enable();
	else
		this.lights[3].disable();

	if(this.Middle == true)
		this.lights[4].enable();
	else
		this.lights[4].disable();

	if(this.Clock == true)
		this.lights[5].enable();
	else
		this.lights[5].disable();
}

LightingScene.prototype.UpdateSubmarineSpeed = function(elapsedTime)
{
	//update based on gui modification
	this.submarine.SetSpeed(this.Submarine_Speed);

//update based on keys
	if (this.Keys.front)
		this.Submarine_Speed = this.submarine.IncreaseSpeed(elapsedTime);
	if (this.Keys.back)
		this.Submarine_Speed = this.submarine.DecreaseSpeed(elapsedTime);
	
	//update proeller angle
	this.submarine.UpdatePropellerAngle(elapsedTime);
};

LightingScene.prototype.UpdateSubmarineHeading = function(elapsedTime)
{
	if(!this.Keys.left && !this.Keys.right)
	{
		this.submarine.setVerticalBackFinAngle(0);
		return;
	}
	
	if (this.Keys.left)
	{
		this.submarine.RotateLeft(elapsedTime);
		this.submarine.setVerticalBackFinAngle(-30);
	}
		
	if (this.Keys.right)
	{
		this.submarine.RotateRight(elapsedTime);
		this.submarine.setVerticalBackFinAngle(30);
	}	
};

LightingScene.prototype.UpdatePeriscopeHeight = function(elapsedTime)
{
	if(this.Keys.periscopeUp)
		this.submarine.IncreasePeriscopeHeight(elapsedTime);
	if(this.Keys.periscopeDown)
		this.submarine.DecreasePeriscopeHeight(elapsedTime);
};

LightingScene.prototype.UpdateSubmarineDepth = function(elapsedTime)
{
	if(!this.Keys.up && !this.Keys.down)
	{
		this.submarine.setHorizontalBackFinAngle(0);
		return;
	}

	if(this.Keys.up)
	{
		this.submarine.PitchForward(elapsedTime);
		this.submarine.setHorizontalBackFinAngle(30);
	}

	if(this.Keys.down)
	{
		this.submarine.PitchBack(elapsedTime);
		this.submarine.setHorizontalBackFinAngle(-30);
	}
};

LightingScene.prototype.UpdateSubmarineRoll = function(elapsedTime)
{
	if(this.Keys.rollLeft)
		this.submarine.RollLeft(elapsedTime);
	
	if(this.Keys.rollRight)
		this.submarine.RollRight(elapsedTime);	
}

LightingScene.prototype.FireTorpedo = function()
{
	if(this.torpedo_animation == true || this.explosion_effect == true || this.num_targets == 0)
		return;
	
	this.torpedo_animation = true;
	var location = this.submarine.GetLocation();
	this.torpedo = new MyTorpedo(this, location[0], location[1], location[2], this.submarine);
	
	this.torpedo.SetTarget(this.targets[this.num_targets - 1]);

	//set currTime that will be used for torpedo descending animation
	var date = new Date();
	this.torpedo.SetInitAnimationTime(date.getTime());
};

LightingScene.prototype.update = function (currTime) 
{
	var elapsedTime = currTime - this.lastCurrTime;
	
	//control lights
	this.LightManager();

	//control clock
	if(this.clock_working == true)
		this.clock.update(currTime);

	//move submarine
	this.UpdateSubmarineSpeed(elapsedTime);
	this.UpdateSubmarineHeading(elapsedTime);
	this.UpdatePeriscopeHeight(elapsedTime);
	this.UpdateSubmarineDepth(elapsedTime);
	this.submarine.Move(elapsedTime);
	this.UpdateSubmarineRoll(elapsedTime);

	//torpedo animation
	if(this.torpedo_animation || this.explosion_effect)
		this.torpedo.Update(currTime, elapsedTime);


	this.lastCurrTime = currTime;
};
