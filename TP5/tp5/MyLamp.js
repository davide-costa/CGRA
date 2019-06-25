/**
 * MyLamp
 * @constructor
 */
 function MyLamp(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyLamp.prototype = Object.create(CGFobject.prototype);
 MyLamp.prototype.constructor = MyLamp;

 MyLamp.prototype.initBuffers = function() {
 	
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	

	var theta = (2*Math.PI)/this.slices;
	var v1_x, v1_y, v1_z;
	var v2_x, v2_y, v2_z;
	var v3_x, v3_y, v3_z;
	var v4_x, v4_y, v4_z;

	var n1_x, n1_y, n1_z;
	var n2_x, n2_y, n2_z;
	 
	
	//Draw sides
	for (z = -(this.stacks)/2, j = 0; z < (this.stacks)/2; z += 1.0)
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

			n1_x = Math.cos(i*theta);
			n1_y = Math.sin(i*theta);
			n1_z = 0;
			n2_x = Math.cos((i+1)*theta);
			n2_y = Math.sin((i+1)*theta);
			n2_z = 0;

			for (k = 0; k < 2; k++)
			{
				this.normals.push(n1_x, n1_y, n1_z);
			}

			for (k = 0; k < 2; k++)
			{
				this.normals.push(n2_x, n2_y, n2_z);
			}

			//this.indices.push(j, j+1, j+2);
			//this.indices.push(j, j+2, j+3);

			this.indices.push(j+2, j+1, j);
			this.indices.push(j+3, j+2, j);
		}
	}

	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
