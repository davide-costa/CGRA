var degToRad = Math.PI / 180.0;

//Torpedo Modeling Constants
const TORPEDO_BODY_HEIGHT = 0.126;  //(1.05*0.6)/5
const TORPEDO_BODY_WIDTH = 0.153;   //(1.05*0.73)/5
const TORPEDO_BODY_C_LENGTH = 1; //body cylinder length
const TORPEDO_BODY_S_LENGTH = 0.225; //body sphere length (0.225 = (5/4.08) - 1)
const TORPEDO_BODY_T_LENGTH = 1.225; //body total length
const TORPEDO_FIN_HEIGHT = 0.048; //(1.05*0.23)/5
const TORPEDO_FIN_HIGHER_BASE = 0.344; //(1.05*1.64)/5
const TORPEDO_FIN_LOWER_BASE = 0.491;//(1.05*2.34)/5
const TORPEDO_FIN_THICKNESS = 0.021;//(1.05*2.34)/5
const DROP_DISTANCE = BODY_HEIGHT + TORPEDO_FIN_HIGHER_BASE / 2; //this is the full depth that the torpedo should descend

//Torpedo stats
const INIT = 0;
const LOCK_TARGET = 1;
const MOVING = 2;
const INIT_EXPLOSION = 3;
const EXPLOSION = 4;

//explosion effects
const INCREASING = 0;
const FRAGMENTING = 1;

const SIZE_INCREMENT = 0.2;
const PARTICLES_INITIAL_SPEED = 2; //2 UNITS PER SECOND

/**
* MyTorpedo
* @constructor
*/
function MyTorpedo(scene, x_pos, y_pos, z_pos, submarine)
{
	CGFobject.call(this, scene);
	this.submarine = submarine;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.z_pos = z_pos;
	this.target = null;
	this.last_t = 0;
	this.state = INIT;
	this.normal_vector = [0, 0, 0];
	this.original_heading = [0, 0, -1];
	this.velocity = this.submarine.curr_sub_ref_x.slice();


	var temp_velocity = this.submarine.curr_sub_ref_x.slice();
	Vectors.ScaleVector(temp_velocity, 6);
	this.P1 = [this.x_pos + this.velocity[0], this.y_pos - DROP_DISTANCE, this.z_pos + this.velocity[2]];
	this.P2 = Vectors.AddVectors(this.P1, temp_velocity);
	var num_targets = this.scene.num_targets;
	this.P3 = [this.scene.targets[num_targets - 1].x_pos, this.scene.targets[num_targets - 1].y_pos + 3, this.scene.targets[num_targets - 1].z_pos];
	this.P4 = [this.scene.targets[num_targets - 1].x_pos, this.scene.targets[num_targets - 1].y_pos - TARGETS_SIZE / 2, this.scene.targets[num_targets - 1].z_pos];
	this.initBuffers();
};

MyTorpedo.prototype = Object.create(CGFobject.prototype);
MyTorpedo.prototype.constructor = MySubmarine;

MyTorpedo.prototype.initBuffers = function()
{
	this.cylinder = new MyCylinder(this.scene, 20, 4);
	this.cylinder_base = new MyBase(this.scene, 20, 4);
	this.semi_sphere = new MySemiSphere(this.scene, 20, 4);
	this.back_fin = new MyTrapezoid(this.scene, TORPEDO_FIN_HIGHER_BASE, TORPEDO_FIN_LOWER_BASE, TORPEDO_FIN_HEIGHT, TORPEDO_FIN_THICKNESS); //0.23 = (5 - 4.08)/2/2
};

MyTorpedo.prototype.display = function()
{
	this.scene.translate(this.x_pos, this.y_pos, this.z_pos);
	var rot_angle = Vectors.GetAngleBetweenVectors(this.original_heading, this.velocity);
	var rot_axis = Vectors.CrossProduct(this.original_heading, this.velocity);
	this.scene.rotate(rot_angle, rot_axis[0], rot_axis[1], rot_axis[2]);

	//Torpedo Body
	//Cylinder
	this.scene.pushMatrix();
	this.scene.scale(TORPEDO_BODY_WIDTH / 2, TORPEDO_BODY_HEIGHT, TORPEDO_BODY_C_LENGTH);
	this.cylinder.display();
	this.scene.popMatrix();

	//front extreme
	this.scene.pushMatrix();
	this.scene.translate(0, 0, TORPEDO_BODY_C_LENGTH);
	this.scene.scale(TORPEDO_BODY_WIDTH / 2, TORPEDO_BODY_HEIGHT, TORPEDO_BODY_S_LENGTH / 2);
	this.semi_sphere.display();
	this.scene.popMatrix();

	//back extreme
	this.scene.pushMatrix();
	this.scene.rotate(180 * degToRad, 0, 1, 0);
	this.scene.scale(TORPEDO_BODY_WIDTH / 2, TORPEDO_BODY_HEIGHT, TORPEDO_BODY_S_LENGTH / 2);
	this.semi_sphere.display();
	this.scene.popMatrix();


	//Fins
	//horizontal fin
	this.scene.pushMatrix();
	this.scene.translate(0, 0, TORPEDO_BODY_C_LENGTH + TORPEDO_BODY_S_LENGTH / 2 / 2);
	this.scene.rotate(-90 * degToRad, 1, 0, 0);
	this.back_fin.display();
	this.scene.popMatrix();

	//vertical fin
	this.scene.pushMatrix();
	this.scene.translate(0, 0, TORPEDO_BODY_C_LENGTH + TORPEDO_BODY_S_LENGTH / 2 / 2);
	this.scene.rotate(90 * degToRad, 0, 0, 1);
	this.scene.rotate(-90 * degToRad, 1, 0, 0);
	this.back_fin.display();
	this.scene.popMatrix();
}

MyTorpedo.prototype.SetTarget = function(target)
{
	this.target = target;
};

MyTorpedo.prototype.SetInitAnimationTime = function(currTime)
{
	this.init_animation_time = currTime;
};

MyTorpedo.prototype.Update = function(currTime, elapsedTime)
{
	switch (this.state)
	{
	case INIT:
		this.DropTorpedo(currTime, elapsedTime);
		break;
	case LOCK_TARGET:
		this.LockTarget();
		break;
	case MOVING:
		this.Move(elapsedTime);
		break;
	case INIT_EXPLOSION:
		if (this.effect == FRAGMENTING)
			this.InitExplosion(currTime);
		else if (this.effect == INCREASING)
			this.state = EXPLOSION;
		break;
	case EXPLOSION:
		if (this.effect == FRAGMENTING)
			this.FragmentingExplosion(currTime, elapsedTime);
		else if (this.effect == INCREASING)
			this.IncreasingExplosion(elapsedTime);
		break;
	}
};

MyTorpedo.prototype.DropTorpedo = function(currTime, elapsedTime)
{
	//this.velocity = this.submarine.curr_sub_ref_x.slice();
	this.x_pos += (elapsedTime / 1000) * this.velocity[0];
	this.y_pos -= (elapsedTime / 1000) * DROP_DISTANCE;
	this.z_pos += (elapsedTime / 1000) * this.velocity[2];

	if (currTime - this.init_animation_time > 1000)
		this.state = LOCK_TARGET;
};

MyTorpedo.prototype.LockTarget = function()
{
	this.distance_to_target = Math.sqrt(Math.pow(this.P4[0] - this.P1[0], 2) + Math.pow(this.P4[1] - this.P1[1], 2) + Math.pow(this.P4[2] - this.P1[2], 2));
	this.last_position = this.P1.slice();
	this.P1_P2 = Vectors.SubVectors(this.P2, this.P1);
	this.P1_P3 = Vectors.SubVectors(this.P3, this.P1);
	this.normal_vector = Vectors.CrossProduct(this.P1_P2, this.P1_P3);
	this.state = MOVING;
};

MyTorpedo.prototype.Move = function(elapsedTime)
{
	var t = this.last_t + (1 / this.distance_to_target) * (elapsedTime / 1000);
	this.x_pos = Math.pow((1 - t), 3) * this.P1[0] + 3 * t*Math.pow((1 - t), 2) *  this.P2[0] + 3 * t*t*(1 - t)*this.P3[0] + t*t*t*this.P4[0];
	this.y_pos = Math.pow((1 - t), 3) * this.P1[1] + 3 * t*Math.pow((1 - t), 2) *  this.P2[1] + 3 * t*t*(1 - t)*this.P3[1] + t*t*t*this.P4[1];
	this.z_pos = Math.pow((1 - t), 3) * this.P1[2] + 3 * t*Math.pow((1 - t), 2) *  this.P2[2] + 3 * t*t*(1 - t)*this.P3[2] + t*t*t*this.P4[2];

	this.velocity = [this.x_pos - this.last_position[0], this.y_pos - this.last_position[1], this.z_pos - this.last_position[2]];
	this.angle = Vectors.GetAngleBetweenVectors(this.velocity, this.P1_P2);

	if (t >= 1)
	{
		this.state = INIT_EXPLOSION;
		this.ChooseExplosionEffect();
	}
	this.last_position = [this.x_pos, this.y_pos, this.z_pos];
	this.last_t = t;
};


MyTorpedo.prototype.ChooseExplosionEffect = function()
{
	this.effect = Math.floor(Math.random() * 2);
};


MyTorpedo.prototype.IncreasingExplosion = function(elapsedTime)
{
	this.scene.torpedo_animation = false;
	this.scene.explosion_effect = true;

	this.scene.targets[this.scene.num_targets - 1].SetAppearance(this.scene.lavaAppearence);
	//assuming an incremnt of 0.4 per second
	var increment = SIZE_INCREMENT * (elapsedTime / 1000);
	this.scene.targets[this.scene.num_targets - 1].IncrementSize(increment)
		if (this.scene.targets[this.scene.num_targets - 1].GetVolume() > 1.7 * this.scene.targets[this.scene.num_targets - 1].GetInitialVolume())
		{
			this.scene.explosion_effect = false;
			this.scene.targets.pop(this.scene.num_targets - 1);
			this.scene.num_targets--;
			return;
		}
	this.scene.targets[this.scene.num_targets - 1].IncrementPositions(0, increment, 0);
};

MyTorpedo.prototype.InitExplosion = function(currTime)
{
	this.scene.torpedo_animation = false;
	this.scene.explosion_effect = true;

	if (this.scene.targets[this.scene.num_targets - 1] instanceof MyTargetCube)
	{
		var position = this.scene.targets[this.scene.num_targets - 1].GetPosition();
		this.scene.targets[this.scene.num_targets - 1] = new MyTargetCube(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 4, this.scene.lavaAppearence);
		this.scene.targets.push(new MyTargetCube(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 4, this.scene.lavaAppearence));
		this.scene.targets.push(new MyTargetCube(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 4, this.scene.lavaAppearence));
		this.scene.targets.push(new MyTargetCube(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 4, this.scene.lavaAppearence));
		this.scene.num_targets += 3;
	}
	else if (this.scene.targets[this.scene.num_targets - 1] instanceof MyTargetSphere)
	{
		var position = this.scene.targets[this.scene.num_targets - 1].GetPosition();
		this.scene.targets[this.scene.num_targets - 1] = new MyTargetSphere(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 8, this.scene.lavaAppearence);
		this.scene.targets.push(new MyTargetSphere(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 8, this.scene.lavaAppearence));
		this.scene.targets.push(new MyTargetSphere(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 8, this.scene.lavaAppearence));
		this.scene.targets.push(new MyTargetSphere(this.scene, position[0], position[1], position[2], TARGETS_SIZE / 8, this.scene.lavaAppearence));
		this.scene.num_targets += 3;
	}

	this.explosion_time_init = currTime;
	this.fragments_speed = PARTICLES_INITIAL_SPEED;
	this.state = EXPLOSION;
};


MyTorpedo.prototype.FragmentingExplosion = function(currTime, elapsedTime)
{
	this.fragments_speed += 0.1;
	var travelled_distance = this.fragments_speed * (elapsedTime / 1000);
	this.scene.targets[this.scene.num_targets - 1].IncrementPositions(travelled_distance, travelled_distance, travelled_distance);
	this.scene.targets[this.scene.num_targets - 2].IncrementPositions(-travelled_distance, travelled_distance, travelled_distance);
	this.scene.targets[this.scene.num_targets - 3].IncrementPositions(travelled_distance, travelled_distance, -travelled_distance);
	this.scene.targets[this.scene.num_targets - 4].IncrementPositions(-travelled_distance, travelled_distance, -travelled_distance);


	if (currTime - this.explosion_time_init > 4000)
	{
		this.scene.explosion_effect = false;
		this.scene.targets.pop(this.scene.num_targets - 1);
		this.scene.targets.pop(this.scene.num_targets - 2);
		this.scene.targets.pop(this.scene.num_targets - 3);
		this.scene.targets.pop(this.scene.num_targets - 4);
		this.scene.num_targets -= 4;
	}
};
