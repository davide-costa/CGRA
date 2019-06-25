
/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
function Plane(scene, nrDivs, minS = 0, maxS = 1, minT = 0, maxT = 1)
{
	CGFobject.call(this, scene);

	// nrDivs = 1 if not provided
	nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;

	this.nrDivs = nrDivs;
	this.patchLength = 1.0 / nrDivs;
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;

	this.initBuffers();
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function()
{
	// Generate vertices and normals 
	this.vertices = [];
	this.normals = [];

	// Uncomment below to init texCoords
	this.texCoords = [];

	var yCoord = 0.5;
	var deltaS = this.maxS - this.minS;
	var deltaT = this.maxT - this.minT;

	for (var j = 0; j <= this.nrDivs; j++)
	{
		var xCoord = -0.5;
		for (var i = 0; i <= this.nrDivs; i++)
		{
			this.vertices.push(xCoord, yCoord, 0);

			// As this plane is being drawn on the xy plane, the normal to the plane will be along the positive z axis.
			// So all the vertices will have the same normal, (0, 0, 1).

			this.normals.push(0, 0, 1);

			this.texCoords.push(i*deltaS / this.nrDivs + this.minS, j*deltaT / this.nrDivs + this.minT);

			xCoord += this.patchLength;
		}
		yCoord -= this.patchLength;
	}

	this.indices = [];
	var ind = 0;

	for (var j = 0; j < this.nrDivs; j++)
	{
		for (var i = 0; i <= this.nrDivs; i++)
		{
			this.indices.push(ind);
			this.indices.push(ind + this.nrDivs + 1);

			ind++;
		}
		if (j + 1 < this.nrDivs)
		{
			// Extra vertices to create degenerate triangles so that the strip can wrap on the next row
			// degenerate triangles will not generate fragments
			this.indices.push(ind + this.nrDivs);
			this.indices.push(ind);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};



