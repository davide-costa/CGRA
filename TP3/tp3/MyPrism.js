/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	
	
	var theta = (2*Math.PI)/this.slices;
	var v1_x, v1_y, v1_z;
	var v2_x, v2_y, v2_z;
	var v3_x, v3_y, v3_z;
	var v4_x, v4_y, v4_z;

	var n_x, n_y, n_z;
	
	var j = 0;
	
	//Draw sides
	for (z = -(this.stacks)/2; z < (this.stacks)/2; z += 1.0)
	{
		for (i = 0; i < this.slices; i++, j += 4)
		{
			v1_x = Math.cos(i*theta);
			v1_y = Math.sin(i*theta);
			v1_z = z;

			v2_x = Math.cos(i*theta);
			v2_y = Math.sin(i*theta);
			v2_z = z+1;

			v3_x = Math.cos((i+1)*theta);
			v3_y = Math.sin((i+1)*theta);
			v3_z = z+1;

			v4_x = Math.cos((i+1)*theta);
			v4_y = Math.sin((i+1)*theta);
			v4_z = z;

			this.vertices.push(v1_x, v1_y, v1_z);
			this.vertices.push(v2_x, v2_y, v2_z);
			this.vertices.push(v3_x, v3_y, v3_z);
			this.vertices.push(v4_x, v4_y, v4_z);


			n_x = Math.cos(i*theta - theta / 2);
			n_y = Math.sin(i*theta - theta / 2);
			n_z = 0;

			for (k = 0; k < 4; k++)
			{
				this.normals.push(n_x, n_y, n_z);
			}

			this.indices.push(j+2, j+1, j);
			this.indices.push(j+3, j+2, j);
		}
	}
	


	//Draw bases
	v1_x = 0;
	v1_y = 0;

	n_x = 0;
	n_y = 0;
				
	for (z = -(this.stacks)/2; z <= (this.stacks)/2; z += this.stacks)
	{
		if (z < 0) //first iteration
		{	
			n_z = -1;
		}
		else //second (and last) iteration
		{
			n_z = 1;
		}
		
		for (i = 0; i < this.slices; i++, j += 3)
		{
			v1_z = z;
			
			v2_x = Math.cos(i*theta);
			v2_y = Math.sin(i*theta);
			v2_z = z;

			v3_x = Math.cos((i+1)*theta);
			v3_y = Math.sin((i+1)*theta);
			v3_z = z;


			this.vertices.push(v1_x, v1_y, v1_z);
			this.vertices.push(v2_x, v2_y, v2_z);
			this.vertices.push(v3_x, v3_y, v3_z);
			
			for (k = 0; k < 3; k++)
			{
				this.normals.push(n_x, n_y, n_z);
			}

			if (z < 0) //first iteration
			{	
				this.indices.push(j+2, j+1, j);
			}
			else //second (and last) iteration
			{
				this.indices.push(j, j+1, j+2);
			}
		}
	}
	
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
