var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	
	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	// Scene elements
	this.table = new MyTable(this);
	this.wall = new Plane(this);
	this.floor = new MyQuad(this, 0, 10, 0, 12);
	this.LeftWall = new MyQuad(this, -0.5, 1.5, -0.5, 1.5);
	this.clock = new MyClock(this);
	this.base = new MyBase(this, 12);
	
	this.boardA = new Plane(this, BOARD_A_DIVISIONS);
	this.boardB = new Plane(this, BOARD_B_DIVISIONS, 0, 1,-0.15, 1.15);

	//Textures
	this.tableAppearance = new CGFappearance(this);
	this.tableAppearance.setSpecular(0.1,0.1,0.1, 1);
	this.tableAppearance.setDiffuse(0.9,0.8,0.8, 1);
	this.tableAppearance.setShininess(1);
	this.tableAppearance.loadTexture("../resources/images/table.png");

	this.floorAppearance = new CGFappearance(this);
	this.floorAppearance.setSpecular(0.1,0.1,0.1, 1);
	this.floorAppearance.setDiffuse(0.9,0.8,0.8, 1);
	this.floorAppearance.setShininess(1);
	this.floorAppearance.loadTexture("../resources/images/floor.png");

	this.windowAppearance = new CGFappearance(this);
	this.windowAppearance.loadTexture("../resources/images/window.png");
	this.windowAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.slidesAppearence = new CGFappearance(this);
	this.slidesAppearence.loadTexture("../resources/images/slides.png");
	this.slidesAppearence.setSpecular(0.1,0.1,0.1, 1);
	this.slidesAppearence.setDiffuse(0.9,0.9,0.9, 1);
	this.slidesAppearence.setShininess(1);
	
	this.boardAppearence = new CGFappearance(this);
	this.boardAppearence.loadTexture("../resources/images/board.png");
	this.boardAppearence.setSpecular(0.5,0.5,0.5, 1);
	this.boardAppearence.setDiffuse(0.6,0.6,0.6, 1);
	this.boardAppearence.setShininess(100);

	this.marmoreAppearence = new CGFappearance(this);
	this.marmoreAppearence.loadTexture("../resources/images/marmore.png");
	this.marmoreAppearence.setSpecular(0.8, 0.8, 0.8, 1);
	this.marmoreAppearence.setDiffuse(0.8, 0.8, 0.8, 1);
	this.marmoreAppearence.setShininess(100);

	this.clockAppearence = new CGFappearance(this);
	this.clockAppearence.loadTexture("../resources/images/clock.png");
	this.clockAppearence.setSpecular(0.2, 0.2, 0.2, 1);
	this.clockAppearence.setDiffuse(0.8, 0.8, 0.8, 1);
	this.clockAppearence.setShininess(100);

	this.enableTextures(true);

	//Prism
	this.prism = new MyPrism(this, 8, 20);

	//Cylinder
	this.cylinder = new MyCylinder(this, 8, 20);
	
	// Materials
	this.materialDefault = new CGFappearance(this);
	
	this.materialA = new CGFappearance(this);
	this.materialA.setAmbient(0.3,0.3,0.3,1);
	this.materialA.setDiffuse(0.6,0.6,0.6,1);
	//this.materialA.setSpecular(0.2,0.2,0.2,1); //original
	//this.materialA.setSpecular(0.8,0.8,0.8,1); //2.6
	//this.materialA.setSpecular(0, 0, 0.2, 1); //2.8
	this.materialA.setSpecular(0, 0.2, 0, 1); //2.9
	
	//this.materialA.setShininess(10);
	this.materialA.setShininess(120);

	this.materialB = new CGFappearance(this);
	this.materialB.setAmbient(0.3,0.3,0.3,1);
	this.materialB.setDiffuse(0.6,0.6,0.6,1);
	this.materialB.setSpecular(0.8,0.8,0.8,1);	
	this.materialB.setShininess(120);
	
	this.TableTopMaterial = new CGFappearance(this);
	this.TableTopMaterial.setAmbient(0.3,0.3,0.3,1);
	this.TableTopMaterial.setDiffuse(0.6,0.6,0.6,1);
	this.TableTopMaterial.setSpecular(0.2,0.2,0.2,1);	
	this.TableTopMaterial.setDiffuse(139/255, 69/255, 19/255, 1);
	this.TableTopMaterial.setShininess(10);

	this.TableLegsMaterial = new CGFappearance(this);
	this.TableLegsMaterial.setAmbient(0.3,0.3,0.3,1);
	this.TableLegsMaterial.setDiffuse(0.2,0.2,0.2,1);
	this.TableLegsMaterial.setSpecular(0.8,0.8,0.8,1);	
	this.TableLegsMaterial.setDiffuse(120/255, 120/255, 120/255, 1);
	this.TableLegsMaterial.setShininess(120);

	this.WallMaterial = new CGFappearance(this);
	this.WallMaterial.setAmbient(0.3,0.3,0.3,1);
	this.WallMaterial.setDiffuse(0.6,0.6,0.6,1);
	this.WallMaterial.setSpecular(0.2,0.2,0.2,1);	
	this.WallMaterial.setDiffuse(255/255, 250/255, 250/255, 1);
	this.WallMaterial.setShininess(10);

	this.GroundMaterial = new CGFappearance(this);
	this.GroundMaterial.setAmbient(0.3,0.3,0.3,1);
	this.GroundMaterial.setDiffuse(0.6,0.6,0.6,1);
	this.GroundMaterial.setSpecular(0.2,0.2,0.2,1);	
	this.GroundMaterial.setDiffuse(139/255, 69/255, 0/255, 1);
	this.GroundMaterial.setShininess(10);

	//update period to refresh the elements of te scene
	this.setUpdatePeriod(100);
};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(0, 0, 0, 1.0);
	
	// Positions for four lights
	this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[0].setVisible(true); // show marker on light position (different from enabled)
	
	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[1].setVisible(true); // show marker on light position (different from enabled)

	this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
	this.lights[2].setVisible(true); // show marker on light position (different from enabled)

	this.lights[3].setPosition(4, 6, 5, 1);
	this.lights[3].setVisible(true); // show marker on light position (different from enabled)
	//this.lights[2].setPosition(10.5, 6.0, 5.0, 1.0);
	//this.lights[1].setVisible(true); // show marker on light position (different from enabled)
	//this.lights[3].setPosition(4, 6.0, 5.0, 1.0);
	//this.lights[1].setVisible(true); // show marker on light position (different from enabled)
this.lights[4].setPosition(6, 6, 3, 1);
	this.lights[4].setVisible(true); // show marker on light position (different from enabled)
	this.lights[4].enable();

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1, 1, 0, 1);
	this.lights[0].enable();

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();

	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1, 1, 1, 1);
	//this.lights[2].setConstantAttenuation(0); //3.2
	//this.lights[2].setLinearAttenuation(0.2); //3.2
	this.lights[2].setLinearAttenuation(1); //3.3
	this.lights[2].enable();

	this.lights[3].setAmbient(0, 0, 0, 1);
	this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[3].setSpecular(1, 1, 0, 1);
	this.lights[3].setConstantAttenuation(0); //3.4
	//this.lights[3].setQuadraticAttenuation(0.2); //3.4
	this.lights[3].setQuadraticAttenuation(1); //3.5
	this.lights[3].enable();
	
};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}


LightingScene.prototype.display = function() {
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

	
	//this.table.display();
	// Draw axis
	this.axis.display();

	this.materialDefault.apply();

	// ---- END Background, camera and axis setup

	
	// ---- BEGIN Geometric transformation section

	// ---- END Geometric transformation section


	// ---- BEGIN Primitive drawing section


	// Floor
	
	this.pushMatrix();
		this.translate(7.5, 0, 7.5);
		this.rotate(-90 * degToRad, 1, 0, 0);
		this.scale(15, 15, 0.2);
		this.floorAppearance.apply();
		this.floor.display();
	this.popMatrix();

	// Left Wall
	this.pushMatrix();
		this.translate(0, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15, 8, 0.2);
		this.windowAppearance.apply();
		this.LeftWall.display();
	this.popMatrix();

	// Plane Wall
	this.pushMatrix();
		this.translate(7.5, 4, 0);
		this.scale(15, 8, 0.2);
		this.WallMaterial.apply();
		this.wall.display();
	this.popMatrix();

	// First Table
	this.pushMatrix();
		this.translate(5, 0, 8);
		this.table.display();
	this.popMatrix();

	// Second Table
	this.pushMatrix();
		this.translate(12, 0, 8);
		this.table.display();
	this.popMatrix();

	// Board A
	this.pushMatrix();
		this.translate(4, 4.5, 0.2);
		//this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		this.scale(5, 4, 1);
		this.slidesAppearence.apply();
		this.boardA.display();
	this.popMatrix();


	// Board B
	this.pushMatrix();
		this.translate(10.5, 4.5, 0.2);
		//this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		this.scale(5, 4, 1);
		this.boardAppearence.apply();
		this.boardB.display();
	this.popMatrix();

	//Draw prism
	this.pushMatrix();
	this.translate(1, 4, 14.15);
	this.scale(1, 0.4, 1);
	this.rotate(90 * degToRad, 1, 0, 0);
	this.marmoreAppearence.apply();
	this.prism.display();
	this.popMatrix();
	
	
	//Draw cylinder
	this.pushMatrix();
	this.translate(1, 0, 12);
	this.scale(1, 8, 1);
	this.rotate(90 * degToRad, -1, 0, 0);
	this.marmoreAppearence.apply();
	this.cylinder.display();
	this.popMatrix();

	//Draw clock
	this.pushMatrix();
	this.translate(7.25, 7, 0);
	this.clock.display();
	this.popMatrix();

	
	// ---- END Primitive drawing section
};

LightingScene.prototype.update = function (currTime) 
{
	this.clock.update(currTime);
};
