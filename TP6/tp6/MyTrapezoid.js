/**
 * MyTrapezoid
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTrapezoid(scene, higher_b, lower_b, height, width, minS = 0, maxS = 1, minT = 0, maxT = 1)
{
	CGFobject.call(this, scene);
	//If the programmer has mistaken the order of the parameters of higher and lower base, swap the values of the variables
	if (lower_b > higher_b)
	{
		var temp = higher_b;
		higher_b = lower_b;
		lower_b = temp;
	}
	this.higher_b = higher_b;
	this.lower_b = lower_b;
	this.height = height;
	this.width = width;
	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;

	//TexCoords
	this.sDiff = this.maxS - this.minS;
	this.tDiff = this.maxT - this.minT;

	var xTotalLength = this.higher_b;
	var quadCoef = this.lower_b / xTotalLength;
	var triangleCoef = ((this.higher_b - this.lower_b) / 2) / xTotalLength;
	this.sQuadLength = this.sDiff * quadCoef;
	this.sTriangleLength = this.sDiff * triangleCoef;

	//Calculate normal vectors
	this.x_catheter = (higher_b - lower_b) / 2;
	this.y_catheter = height;
	this.left_close_normal_vector = [-this.x_catheter, this.y_catheter, 0];
	this.right_close_normal_vector = [this.x_catheter, this.y_catheter, 0];
	Vectors.TransformVectorIntoVersor(this.left_close_normal_vector);
	Vectors.TransformVectorIntoVersor(this.right_close_normal_vector);
	
	this.initBuffers();
};

MyTrapezoid.prototype = Object.create(CGFobject.prototype);
MyTrapezoid.prototype.constructor = MyQuad;

MyTrapezoid.prototype.initBuffers = function()
{
	this.vertices = [
		//first trapezoid
		-this.higher_b / 2, -this.height / 2, -this.width / 2, //0
			-this.lower_b / 2, -this.height / 2, -this.width / 2, //1
			this.lower_b / 2, -this.height / 2, -this.width / 2, //2
			this.higher_b / 2, -this.height / 2, -this.width / 2, //3
			-this.lower_b / 2, this.height / 2, -this.width / 2, //4
			this.lower_b / 2, this.height / 2, -this.width / 2,  //5
			//second trapezoid
			-this.higher_b / 2, -this.height / 2, this.width / 2, //6
			-this.lower_b / 2, -this.height / 2, this.width / 2, //7
			this.lower_b / 2, -this.height / 2, this.width / 2, //8
			this.higher_b / 2, -this.height / 2, this.width / 2, //9
			-this.lower_b / 2, this.height / 2, this.width / 2, //10
			this.lower_b / 2, this.height / 2, this.width / 2,  //11
			//left close
			-this.higher_b / 2, -this.height / 2, -this.width / 2, //0 12
			-this.lower_b / 2, this.height / 2, -this.width / 2, //4 13
			-this.higher_b / 2, -this.height / 2, this.width / 2, //6 14
			-this.lower_b / 2, this.height / 2, this.width / 2, //10 15
			//right close
			this.higher_b / 2, -this.height / 2, -this.width / 2, //3 16
			this.lower_b / 2, this.height / 2, -this.width / 2,  //5 17
			this.higher_b / 2, -this.height / 2, this.width / 2, //9 18
			this.lower_b / 2, this.height / 2, this.width / 2,  //11 19
			//top close
			-this.lower_b / 2, this.height / 2, -this.width / 2, //4 20
			this.lower_b / 2, this.height / 2, -this.width / 2,  //5 21
			-this.lower_b / 2, this.height / 2, this.width / 2, //10 22
			this.lower_b / 2, this.height / 2, this.width / 2,  //11 23
			//bottom close
			-this.higher_b / 2, -this.height / 2, -this.width / 2, //0 24
			this.higher_b / 2, -this.height / 2, -this.width / 2, //3 25
			-this.higher_b / 2, -this.height / 2, this.width / 2, //6 26
			this.higher_b / 2, -this.height / 2, this.width / 2 //9 27

	];


	this.indices = [
		//first trapezoid
		0, 4, 1,
			4, 5, 1,
			1, 5, 2,
			2, 5, 3,
			//second trapezoid
			7, 10, 6,
			7, 11, 10,
			8, 11, 7,
			9, 11, 8,
			//left close
			13, 12, 15,
			15, 12, 14,
			//right close
			16, 17, 19,
			16, 19, 18,
			//top close
			20, 22, 21,
			22, 23, 21,
			//bottom close
			26, 25, 27,
			26, 24, 25
	];



	this.normals = [
		//first trapezoid
		0, 0, -1, //0
			0, 0, -1, //1
			0, 0, -1, //2
			0, 0, -1, //3
			0, 0, -1, //4
			0, 0, -1,  //5
			//second trapezoid
			0, 0, 1, //6
			0, 0, 1, //7
			0, 0, 1, //8
			0, 0, 1, //9
			0, 0, 1, //10
			0, 0, 1, //11
			//left close
			this.left_close_normal_vector[0], this.left_close_normal_vector[1], this.left_close_normal_vector[2], //12
			this.left_close_normal_vector[0], this.left_close_normal_vector[1], this.left_close_normal_vector[2], //13
			this.left_close_normal_vector[0], this.left_close_normal_vector[1], this.left_close_normal_vector[2], //14
			this.left_close_normal_vector[0], this.left_close_normal_vector[1], this.left_close_normal_vector[2], //15
			//right close
			this.right_close_normal_vector[0], this.right_close_normal_vector[1], this.right_close_normal_vector[2], //16
			this.right_close_normal_vector[0], this.right_close_normal_vector[1], this.right_close_normal_vector[2], //17
			this.right_close_normal_vector[0], this.right_close_normal_vector[1], this.right_close_normal_vector[2], //18
			this.right_close_normal_vector[0], this.right_close_normal_vector[1], this.right_close_normal_vector[2], //19
			//top close
			0, 1, 0, //20
			0, 1, 0, //21
			0, 1, 0, //22
			0, 1, 0, //23
			//bottom close
			0, -1, 0, //24
			0, -1, 0, //25
			0, -1, 0, //26
			0, -1, 0 //27
	];

	this.texCoords = [
		//first trapezoid
		this.minS, this.maxT, //0
			this.minS + this.sTriangleLength, this.maxT, //1
			this.minS + this.sTriangleLength + this.sQuadLength, this.maxT, //2
			this.minS + this.sTriangleLength + this.sQuadLength + this.sTriangleLength, this.maxT, //3
			this.minS, this.minT, //4
			this.maxS, this.minT,  //5
			//second trapezoid
			this.minS, this.maxT, //0
			this.minS + this.sTriangleLength, this.maxT, //1
			this.minS + this.sTriangleLength + this.sQuadLength, this.maxT, //2
			this.minS + this.sTriangleLength + this.sQuadLength + this.sTriangleLength, this.maxT, //3
			this.minS, this.minT, //4
			this.maxS, this.minT,  //5
			//left close
			this.maxS, this.maxT, //12
			this.maxS, this.minT, //13
			this.minS, this.maxT, //14
			this.minS, this.minT, //15
			//right close
			this.minS, this.maxT, //16
			this.minS, this.minT, //17
			this.maxS, this.maxT, //18
			this.maxS, this.minT, //19
			//top close
			this.maxS, this.minT, //20
			this.maxS, this.maxT, //21
			this.minS, this.minT, //22
			this.maxS, this.minT, //23
			//bottom close
			this.minS, this.minT, //24
			this.maxS, this.minT, //25
			this.minS, this.maxT, //26
			this.maxS, this.maxT //27
	]


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
};