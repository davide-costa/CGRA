/**
 * MyBase
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyBase(scene, slices) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.slices = slices;

	this.initBuffers();
};

MyBase.prototype = Object.create(CGFobject.prototype);
MyBase.prototype.constructor=MyBase;


MyBase.prototype.initBuffers = function()
{
	var theta = (2*Math.PI)/this.slices;
	var sLength = 1 / this.slices;
	
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	
	

	//Draw front of clock (base of cylinder)
	var v_x, v_y, v_z;
	v_z = 1 //for the base, v_z is always equal to 1

	this.vertices.push(0, 0, v_z); //middle vertice
	this.texCoords.push(0.5, 0.5);
	this.normals.push(0, 0, 1);

	for (var i = 0; i <= this.slices; i++)
	{
		v_x = Math.cos(i*theta);
		v_y = Math.sin(i*theta);
		//console.log(v_x, v_y, v_z);	
		this.vertices.push(v_x, v_y, v_z);
	    this.texCoords.push(v_x/2 + 0.5, -v_y/2 + 0.5);
		this.normals.push(0, 0, 1);
	}

	for (var i = 1; i <= this.slices; i++)
	{
		console.log("Im pushing to the indices");
			
		this.indices.push(0, i, i+1);
	}

	console.log(this.vertices);
	console.log(this.normals);
	console.log(this.indices);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

}