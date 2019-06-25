var degToRad = Math.PI / 180.0;

//Submarine Modeling Constants
const BODY_HEIGHT = 0.6;
const BODY_WIDTH = 0.73;
const BODY_C_LENGTH = 4.08; //body cylinder length
const BODY_S_LENGTH = 0.92; //body sphere length
const BODY_T_LENGTH = 5; //body total length
const CABINE_DESPLACEMENT_OF_FRONT = 1.456; // assuming that the cabine it´s displaced to the front of the body (BODY_C_LENGTH - CABINE_LENGTH) / 2.5 = 1.28
const CABINE_HEIGHT = 0.57;
const CABINE_WIDTH = 0.6;
const CABINE_LENGTH = 0.88;
const V_PERISCOPE_WIDTH = 0.1;//vertical periscope
const H_PERISCOPE_WIDTH = 0.1; //horizontal periscope
const H_PERISCOPE_LENGTH = 0.3;
const FIN_HEIGHT = 0.23;
const FIN_THICKNESS = 0.1;
const PROPELLER_RADIOUS = 0.23;
const PROPELLER_S_RADIOUS = 0.05; //propeller sphere radious
const PROPELLER_R_WIDTH = 0.1;
const PROPELLER_R_LENGTH = 0.3;


const V_PERISCOPE_MAX_HEIGHT = 1.8;
const V_PERISCOPE_MIN_HEIGHT = 0.3;
const MAX_SUB_SPEED = 2.5;
const MIN_SUB_SPEED = -2.5;
const MAX_SUB_DEPTH = 2.34 / 2; // 2.34/2 represents the height of the vertical back fin, avoiding that submarine colides with the ground
const MIN_SUB_DEPTH = 20;

const ACROBATIC_SUBMARINE = false;
/**
* MySubmarine
* @constructor
*/
function MySubmarine(scene, x_pos, y_pos, z_pos, initial_speed, turnAngle = 0, pitchAngle = 0) 
{
	CGFobject.call(this, scene);
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.z_pos = z_pos;
	this.turnAngle = turnAngle * degToRad; //horizontal turn angle
	this.pitchAngle = pitchAngle * degToRad;
	this.speed = initial_speed;
	this.depth = 5;
	this.horizontalFinAngle = 0;
	this.verticalFinAngle = 0;
	this.periscope_height = 0.57; //default height
	this.depth_inclination_angle = 0;
	this.propeller_angle = 0;
	this.propeller_speed = -360; //360º(1 complete rotation) per second; negative because the initial speed is 0.1 positive 

	//The following vectors represent the submarine current headings
	//They are implemented in the form of a mobile right hand referencial
	//They must be correctly initialized (regarding its starting headings) to work properly
	this.curr_sub_ref_x = [0, 0, -1]; //submarine moving way (heading) 
	this.curr_sub_ref_y = [0, 1, 0]; //up direction (to where the cabinet points)
	this.curr_sub_ref_z = [1, 0, 0]; //right direction (to where the submarine should go when it rotates rght)

	this.original_heading = this.curr_sub_ref_x.slice();
	this.original_top_facing_direction = this.curr_sub_ref_y.slice();

	this.ComputeCurrentHeading();

	this.initBuffers();
};

MySubmarine.prototype = Object.create(CGFobject.prototype);
MySubmarine.prototype.constructor = MySubmarine;

MySubmarine.prototype.initBuffers = function()
{
	this.cylinder = new MyCylinder(this.scene, 20, 4);
	this.double_cylinder = new MyDoubleCylinder(this.scene, 20, 4);
	this.cylinder_base = new MyBase(this.scene, 20, 4);
	this.semi_sphere = new MySemiSphere(this.scene, 20, 4);
	this.back_fin = new MyTrapezoid(this.scene, 2.34, 1.64, FIN_HEIGHT, 0.1); //0.23 = (5 - 4.08)/2/2
	this.periscope_fin = new MyTrapezoid(this.scene, 1.42, 0.995, FIN_HEIGHT, 0.1); // 0.995 para manter proporçao da outra fin 
	this.rectangle = new MyQuad(this.scene);
};

//This functions returns the matrix necessary to be applied for the submarine to rotate from its original heading to face his current heading
//The appliance of the transformation may cause the submarine to roll and so roll correction is necessary
MySubmarine.prototype.GetHeadingAdjustmentMatrix = function(rotation_matrix)
{
	var turn_axis = Vectors.CrossProduct(this.curr_sub_ref_x, this.original_heading);
	var rot_angle = Vectors.GetAngleBetweenVectors(this.curr_sub_ref_x, this.original_heading);
	var unit_matrix = [
		1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
	];
	var rotation_matrix = unit_matrix.slice();
	mat4.rotate(rotation_matrix, unit_matrix, -rot_angle, [turn_axis[0], turn_axis[1], turn_axis[2]]);
	//The matrix is needed to know where is the cabinet facing towards so that it is known how much to rotate to correct the roll angle caused by the appliance of this matrix

	return rotation_matrix;
}

MySubmarine.prototype.ComputeCurrentHeading = function()
{
	this.heading_adjustment_matrix = this.GetHeadingAdjustmentMatrix();
	this.roll_correction_angle = this.GetRollCorrectionAngle(this.heading_adjustment_matrix);
}

MySubmarine.prototype.GetRollCorrectionAngle = function(rotation_matrix)
{
	//since its roll angle will be random, it needs to be fixed
	//the current top facing direction is saved on this.vertices (it is declared as vertices so that it gets changed with matrix multiplications)
	//the correct top facing direction is saved on this.curr_sub_ref_y
	//to correct just roll it back to this.curr_sub_ref_y
	var curr_top_facing_direction = this.curr_sub_ref_y.slice();
	curr_top_facing_direction.push(0);
	this.original_top_facing_direction.push(0);
	vec4.transformMat4(curr_top_facing_direction, this.original_top_facing_direction, rotation_matrix);
	curr_top_facing_direction.pop();
	this.original_top_facing_direction.pop();
	var roll_correction_turn_axis;
	roll_correction_turn_axis = this.curr_sub_ref_x.slice();
	var temp_curr_sub_ref_z = this.curr_sub_ref_z.slice();
	Vectors.ScaleVector(temp_curr_sub_ref_z, -1);

	return Vectors.GetFullAngleFromReferencial(curr_top_facing_direction, this.curr_sub_ref_y, temp_curr_sub_ref_z);
}

MySubmarine.prototype.display = function()
{
	this.scene.translate(this.x_pos, this.y_pos, this.z_pos);

	this.scene.rotate(this.roll_correction_angle, this.curr_sub_ref_x[0], this.curr_sub_ref_x[1], this.curr_sub_ref_x[2])
		this.scene.multMatrix(this.heading_adjustment_matrix);

	//center the submarine at the origin
	this.scene.translate(0, 0, -2.04);

	//Subamrine Body
	//Cylinder
	this.scene.pushMatrix();
	this.scene.scale(BODY_WIDTH / 2, BODY_HEIGHT, BODY_C_LENGTH);
	this.cylinder.display();
	this.scene.popMatrix();

	//front extreme
	this.scene.pushMatrix();
	this.scene.translate(0, 0, BODY_C_LENGTH);
	this.scene.scale(BODY_WIDTH / 2, BODY_HEIGHT, BODY_S_LENGTH / 2);
	this.semi_sphere.display();
	this.scene.popMatrix();

	//back extreme
	this.scene.pushMatrix();
	this.scene.rotate(180 * degToRad, 0, 1, 0);
	this.scene.scale(BODY_WIDTH / 2, BODY_HEIGHT, BODY_S_LENGTH / 2);
	this.semi_sphere.display();
	this.scene.popMatrix();

	//Cabine
	//cylinder
	this.scene.pushMatrix();
	this.scene.translate(0, BODY_HEIGHT + CABINE_HEIGHT, CABINE_DESPLACEMENT_OF_FRONT + CABINE_LENGTH / 2);
	this.scene.scale(CABINE_WIDTH / 2, CABINE_HEIGHT + 0.43, CABINE_LENGTH / 2);
	this.scene.rotate(90 * degToRad, 1, 0, 0);
	this.cylinder.display();
	this.scene.popMatrix();
	//base
	this.scene.pushMatrix();
	this.scene.translate(0, BODY_HEIGHT + CABINE_HEIGHT, CABINE_DESPLACEMENT_OF_FRONT + CABINE_LENGTH / 2);
	this.scene.scale(CABINE_WIDTH / 2, 1, CABINE_LENGTH / 2);
	this.scene.rotate(-90 * degToRad, 1, 0, 0);
	this.cylinder_base.display();
	this.scene.popMatrix();

	//Periscope with 2 of height, 0.57 visible by default
	//vertical
	this.scene.pushMatrix();
	this.scene.translate(0, BODY_HEIGHT + CABINE_HEIGHT + this.periscope_height, CABINE_DESPLACEMENT_OF_FRONT + V_PERISCOPE_WIDTH + 0.1);
	this.scene.scale(V_PERISCOPE_WIDTH, V_PERISCOPE_MAX_HEIGHT, V_PERISCOPE_WIDTH);
	this.scene.rotate(90 * degToRad, 1, 0, 0);
	this.cylinder.display();
	this.scene.popMatrix();
	//horizontal
	this.scene.pushMatrix();
	this.scene.translate(0, BODY_HEIGHT + CABINE_HEIGHT + this.periscope_height + H_PERISCOPE_WIDTH / 2, (CABINE_DESPLACEMENT_OF_FRONT + V_PERISCOPE_WIDTH + 0.1) - (H_PERISCOPE_LENGTH - H_PERISCOPE_WIDTH));
	this.scene.scale(H_PERISCOPE_WIDTH, H_PERISCOPE_WIDTH, H_PERISCOPE_LENGTH);
	this.cylinder.display();
	this.scene.rotate(180 * degToRad, 0, 1, 0);
	this.cylinder_base.display();//front base
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, BODY_HEIGHT + CABINE_HEIGHT + this.periscope_height + H_PERISCOPE_WIDTH / 2, (CABINE_DESPLACEMENT_OF_FRONT + V_PERISCOPE_WIDTH + 0.1) + H_PERISCOPE_WIDTH);
	this.scene.scale(H_PERISCOPE_WIDTH, H_PERISCOPE_WIDTH, H_PERISCOPE_LENGTH);
	this.cylinder_base.display();//back base
	this.scene.popMatrix();


	//Fins
	//Back fin horizontal
	this.scene.pushMatrix();
	this.scene.translate(0, FIN_THICKNESS * 2, BODY_C_LENGTH + BODY_S_LENGTH / 2 / 2);
	this.scene.rotate(this.horizontalFinAngle * degToRad, 1, 0, 0);
	this.scene.rotate(-90 * degToRad, 1, 0, 0);
	this.back_fin.display();
	this.scene.popMatrix();

	//Back fin vertical
	this.scene.pushMatrix();
	this.scene.translate(0, 0, BODY_C_LENGTH + BODY_S_LENGTH / 2 / 2);
	this.scene.rotate(90 * degToRad, 0, 0, 1);
	this.scene.rotate(this.verticalFinAngle * degToRad, 1, 0, 0);
	this.scene.rotate(-90 * degToRad, 1, 0, 0);
	this.back_fin.display();
	this.scene.popMatrix();

	//Periscope Fin
	this.scene.pushMatrix();
	this.scene.translate(0, BODY_HEIGHT + CABINE_HEIGHT / 2, CABINE_DESPLACEMENT_OF_FRONT + CABINE_LENGTH / 2);
	this.scene.rotate(-this.horizontalFinAngle * degToRad, 1, 0, 0);
	this.scene.rotate(90 * degToRad, 1, 0, 0);
	this.periscope_fin.display();
	this.scene.popMatrix();


	//Propellers
	//left propeller
	//cylinder
	this.scene.pushMatrix();
	this.scene.translate(BODY_WIDTH / 2 + PROPELLER_RADIOUS / 2, -0.1, BODY_C_LENGTH - 0.2);
	this.scene.scale(PROPELLER_RADIOUS, PROPELLER_RADIOUS, PROPELLER_RADIOUS);
	this.double_cylinder.display();
	this.scene.popMatrix();

	//rectangle
	this.scene.pushMatrix();
	this.scene.translate(BODY_WIDTH / 2 + PROPELLER_RADIOUS / 2, -0.1, BODY_C_LENGTH - 0.2 + PROPELLER_RADIOUS / 2);
	this.scene.pushMatrix();
	this.scene.rotate(this.propeller_angle * degToRad, 0, 0, 1);
	this.scene.scale(PROPELLER_R_WIDTH, PROPELLER_R_LENGTH, PROPELLER_R_LENGTH);
	this.rectangle.display();
	this.scene.popMatrix();
	this.scene.rotate(this.propeller_angle * degToRad, 0, 0, 1);
	this.scene.rotate(180 * degToRad, 0, 1, 0);
	this.scene.scale(PROPELLER_R_WIDTH, PROPELLER_R_LENGTH, PROPELLER_R_LENGTH);
	this.rectangle.display();
	this.scene.popMatrix();

	//semi_sphere
	this.scene.pushMatrix();
	this.scene.translate(BODY_WIDTH / 2 + PROPELLER_RADIOUS / 2, -0.1, BODY_C_LENGTH - 0.2 + PROPELLER_RADIOUS / 2);
	this.scene.scale(PROPELLER_S_RADIOUS, PROPELLER_S_RADIOUS, PROPELLER_S_RADIOUS);
	this.semi_sphere.display();
	this.scene.popMatrix();

	//right propeller
	//cylinder
	this.scene.pushMatrix();
	this.scene.translate(-BODY_WIDTH / 2 - PROPELLER_RADIOUS / 2, -0.1, BODY_C_LENGTH - 0.2);
	this.scene.scale(PROPELLER_RADIOUS, PROPELLER_RADIOUS, PROPELLER_RADIOUS);
	this.double_cylinder.display();
	this.scene.popMatrix();

	//rectangle
	this.scene.pushMatrix();
	this.scene.translate(-BODY_WIDTH / 2 - PROPELLER_RADIOUS / 2, -0.1, BODY_C_LENGTH - 0.2 + PROPELLER_RADIOUS / 2);
	this.scene.pushMatrix();
	this.scene.rotate(-this.propeller_angle * degToRad, 0, 0, 1);
	this.scene.scale(PROPELLER_R_WIDTH, PROPELLER_R_LENGTH, PROPELLER_R_LENGTH);
	this.rectangle.display();
	this.scene.popMatrix();
	this.scene.rotate(-this.propeller_angle * degToRad, 0, 0, 1);
	this.scene.rotate(180 * degToRad, 0, 1, 0);
	this.scene.scale(PROPELLER_R_WIDTH, PROPELLER_R_LENGTH, PROPELLER_R_LENGTH);
	this.rectangle.display();
	this.scene.popMatrix();

	//semi_sphere
	this.scene.pushMatrix();
	this.scene.translate(-BODY_WIDTH / 2 - PROPELLER_RADIOUS / 2, -0.1, BODY_C_LENGTH - 0.2 + PROPELLER_RADIOUS / 2);
	this.scene.scale(PROPELLER_S_RADIOUS, PROPELLER_S_RADIOUS, PROPELLER_S_RADIOUS);
	this.semi_sphere.display();
	this.scene.popMatrix();

}

MySubmarine.prototype.GetLocation = function()
{
	var location = [];
	location.push(this.x_pos);
	location.push(this.y_pos);
	location.push(this.z_pos);
	return location;
}

MySubmarine.prototype.Move = function(elapsedTime)
{
	var displacement = this.speed * (elapsedTime / 1000);
	var temp_x_ref = this.curr_sub_ref_x.slice(); //copy the array (temp_x_ref = curr_sub_ref_x would put temp_x_ref pointing to the same memory address of curr_sub_ref_x and not create a seperate copy)
	temp_x_ref.map(function(x) { return x * this.speed; }); //transform the array 

	this.x_pos += displacement * temp_x_ref[0];
	this.y_pos += displacement * temp_x_ref[1];
	this.z_pos += displacement * temp_x_ref[2];
	if (this.y_pos < MAX_SUB_DEPTH)
		this.y_pos = MAX_SUB_DEPTH;
};

MySubmarine.prototype.SetSpeed = function(SubmarineSpeed)
{
	this.propeller_speed += (Math.abs(SubmarineSpeed - this.speed) / 0.1) * 360;
	this.speed = SubmarineSpeed;
};

MySubmarine.prototype.DecreaseSpeed = function(elapsedTime)
{
	if (this.speed > MIN_SUB_SPEED)
		this.speed -= 1 * (elapsedTime / 1000);

	this.propeller_speed += (this.speed / 0.1) * 360;

	return this.speed;
};

MySubmarine.prototype.IncreaseSpeed = function(elapsedTime)
{
	if (this.speed < MAX_SUB_SPEED)
		this.speed += 1 * (elapsedTime / 1000);

	this.propeller_speed += (this.speed / 0.1) * 360;

	return this.speed;
};

MySubmarine.prototype.RotateLeft = function(elapsedTime)
{
	this.ChangeCurrentHeading(this.curr_sub_ref_x, this.curr_sub_ref_z, -0.5, elapsedTime, true);
};

MySubmarine.prototype.RotateRight = function(elapsedTime)
{
	this.ChangeCurrentHeading(this.curr_sub_ref_x, this.curr_sub_ref_z, 0.5, elapsedTime, true);
};


MySubmarine.prototype.PitchForward = function(elapsedTime)
{
	this.ChangeCurrentHeading(this.curr_sub_ref_x, this.curr_sub_ref_y, -0.5, elapsedTime, true);
};

MySubmarine.prototype.PitchBack = function(elapsedTime)
{
	this.ChangeCurrentHeading(this.curr_sub_ref_x, this.curr_sub_ref_y, 0.5, elapsedTime, true);
};

MySubmarine.prototype.RollLeft = function(elapsedTime)
{
	var acceleration = this.curr_sub_ref_z;
	this.ChangeCurrentHeading(this.curr_sub_ref_y, this.curr_sub_ref_z, -0.5, elapsedTime, false);
};

MySubmarine.prototype.RollRight = function(elapsedTime)
{
	this.ChangeCurrentHeading(this.curr_sub_ref_y, this.curr_sub_ref_z, 0.5, elapsedTime, false);
};

MySubmarine.prototype.ChangeCurrentHeading = function(velocity, acceleration, acceleration_coef, elapsedTime, invert_way_if_moving_backwards)
{
	var speedCoef = this.speed / MAX_SUB_SPEED;
	var acceleration_magnitude = acceleration_coef * (elapsedTime / 1000) * (speedCoef * speedCoef);
	if (invert_way_if_moving_backwards && (this.speed < 0))
		acceleration_magnitude = -acceleration_magnitude;
	var temp_velocity = velocity.slice();
	var temp_acceleration = acceleration.slice();
	this.ApplyAcceleration(velocity, acceleration, acceleration_magnitude);
	if (!ACROBATIC_SUBMARINE)
		if (!this.IsCurrSubmarineHeadingValid())
		{
			Vectors.CopyContent(velocity, temp_velocity);
			Vectors.CopyContent(acceleration, temp_acceleration);
		}
	this.ComputeCurrentHeading();
}

MySubmarine.prototype.ApplyAcceleration = function(velocity, acceleration, acceleration_magnitude)
{
	var temp_velocity = velocity.slice();
	Vectors.ScaleVector(temp_velocity, acceleration_magnitude); //transform the array (multiply each element by the function) 
	var acceleration_vector = acceleration.slice();
	Vectors.ScaleVector(acceleration_vector, acceleration_magnitude); //scale

	//Change velocity direction
	var new_velocity = Vectors.AddVectors(velocity, acceleration_vector);
	Vectors.TransformVectorIntoVersor(velocity);
	//Adjust the acceleration versor
	var new_acceleration = Vectors.SubVectors(acceleration, temp_velocity);
	Vectors.TransformVectorIntoVersor(acceleration);

	Vectors.CopyContent(velocity, new_velocity);
	Vectors.CopyContent(acceleration, new_acceleration);
}

MySubmarine.prototype.IsCurrSubmarineHeadingValid = function()
{
	if (Vectors.GetAngleBetweenVectors(this.curr_sub_ref_y, [0, 1, 0]) <= (45 * degToRad))
		return true;
	else
		return false;
}

MySubmarine.prototype.setHorizontalBackFinAngle = function(angle)
{
	this.horizontalFinAngle = angle;
};

MySubmarine.prototype.setVerticalBackFinAngle = function(angle)
{
	this.verticalFinAngle = angle;
};

MySubmarine.prototype.UpdatePropellerAngle = function(elapsedTime)
{
	this.propeller_angle -= (this.speed / 0.1) * 360 * (elapsedTime / 1000);
};

MySubmarine.prototype.IncreasePeriscopeHeight = function(elapsedTime)
{
	if (this.periscope_height < V_PERISCOPE_MAX_HEIGHT - 0.2)
		this.periscope_height += 1 * (elapsedTime / 1000);
};

MySubmarine.prototype.DecreasePeriscopeHeight = function(elapsedTime)
{
	if (this.periscope_height > V_PERISCOPE_MIN_HEIGHT)
		this.periscope_height -= 1 * (elapsedTime / 1000);
};