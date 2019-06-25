/**
 * MyPrism
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	

	var theta = (2*Math.PI)/this.slices;
	var v1_x, v1_y, v1_z;
	var v2_x, v2_y, v2_z;
	var vinit1_x, vinit1_y, vinit1_z;
	var vinit2_x, vinit2_y, vinit2_z;

	var n1_x, n1_y, n1_z;
	var ninit_x, ninit_y, ninit_z;
	var temp_j;

	var j = 0;
	
	//Draw sides
	for (z = -(this.stacks)/2; z < (this.stacks)/2; z += 1.0)
	{
		vinit1_x = Math.cos(0);
		vinit1_y = Math.sin(0);
		vinit1_z = z;

		vinit2_x = Math.cos(0);
		vinit2_y = Math.sin(0);
		vinit2_z = vinit1_z + 1;
		
		ninit_x = Math.cos(0);
		ninit_y = Math.sin(0);
		ninit_z = 0;

		this.vertices.push(vinit1_x, vinit1_y, vinit1_z);
		this.vertices.push(vinit2_x, vinit2_y, vinit2_z);

		for (k = 0; k < 2; k++)
		{
			this.normals.push(ninit_x, ninit_y, ninit_z);
		}
		
		temp_j = j;
		for (i = 1; i < this.slices; i++, j += 2)
		{
			v1_x = Math.cos(i*theta);
			v1_y = Math.sin(i*theta);
			v1_z = z;

			v2_x = Math.cos(i*theta);
			v2_y = Math.sin(i*theta);
			v2_z = z+1;

			this.vertices.push(v1_x, v1_y, v1_z);
			this.vertices.push(v2_x, v2_y, v2_z);
			this.texCoords.push(v1_x, v1_y, v1_z);
			this.texCoords.push(v2_x, v2_y, v2_z);

			n1_x = Math.cos(i*theta);
			n1_y = Math.sin(i*theta);
			n1_z = 0;

			for (k = 0; k < 2; k++)
			{
				this.normals.push(n1_x, n1_y, n1_z);
			}

			this.indices.push(j+2, j+1, j);
			this.indices.push(j+2, j+3, j+1);
		}

		j += 2;
		this.indices.push(temp_j, temp_j + 1, j-1);
		this.indices.push(j-2, temp_j, j-1);
		this.texCoords.push(temp_j, temp_j + 1, j-1);
		this.texCoords.push(j-2, temp_j, j-1);
		
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
