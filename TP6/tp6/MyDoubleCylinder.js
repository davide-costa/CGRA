/**
 * MyPrism
 * @constructor
 */
 function MyDoubleCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyDoubleCylinder.prototype = Object.create(CGFobject.prototype);
 MyDoubleCylinder.prototype.constructor = MyDoubleCylinder;

 MyDoubleCylinder.prototype.initBuffers = function() {
 		
 	var sLength = 1 / this.slices;
	var tLength = 1 / this.stacks;	


	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	

	var theta = (2*Math.PI)/this.slices;

	var v_x, v_y, v_z;

 	for(var j = 0; j <= this.stacks; j++)
 	{
		for (var i = 0; i <= this.slices; i++)
		{
			v_x = Math.cos(i*theta);
			v_y = Math.sin(i*theta);
			v_z = j / this.stacks;

			this.vertices.push(v_x, v_y, v_z);
			this.normals.push(v_x, v_y, v_z);
		}
	}

for(var j = 0; j < this.stacks; j++)
	{
		for (var i = 0; i < this.slices; i++)
		{
			this.indices.push( j * (this.slices +1) + i, j * (this.slices +1) + i + 1, (j + 1) * (this.slices +1) + i );
			this.indices.push( j * (this.slices +1) + i + 1, (j + 1) * (this.slices +1) + i + 1, (j + 1) * (this.slices +1) + i );
		}
	}

	for(var j = 0; j < this.stacks; j++)
	{
		for (var i = 0; i < this.slices; i++)
		{
			this.indices.push((j + 1) * (this.slices +1) + i  , j * (this.slices +1) + i + 1, j * (this.slices +1) + i);
			this.indices.push( (j + 1) * (this.slices +1) + i  , (j + 1) * (this.slices +1) + i + 1, j * (this.slices +1) + i + 1);
		}
	}

	for(var t = 0; t <= this.stacks; t++)
	{
		for(var s = 0; s <= this.slices; s++)
		{
			this.texCoords.push(sLength * s, tLength * t);
		}
	}
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
