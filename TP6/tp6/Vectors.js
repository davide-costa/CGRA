/**
* Vectors
* @constructor
*/
class Vectors
{
	
	//Returns a number representing the magnitude of the vector it receives as parameter
	static GetMagnitudeOfVector(vector)
	{
		var magnitude = 0;
		for (var i = 0; i < vector.length; i++)
		{
			magnitude += (vector[i] * vector[i]);
		}
		magnitude = Math.sqrt(magnitude);
		return magnitude;
	}

	//Normalizes a vector. Tranforms the vector ir receives as parameter into a versor. (A versor is a vector which has a magnitude of 1)
	static TransformVectorIntoVersor(vector)
	{
		//Tranform curr_sub_ref_x vector in a versor
		var magnitude = this.GetMagnitudeOfVector(vector);
		for (var i = 0; i < vector.length; i++)
		{
			vector[i] /= magnitude;
		}
	}

	static ScaleVector(vector, scale_factor)
	{
		for (var i = 0; i < vector.length; i++)
		{
			vector[i] *= scale_factor;
		}
	}

	static AddVectors(vector1, vector2)
	{
		var result_vector = [];
		for (var i = 0; i < vector1.length; i++)
		{
			result_vector.push(vector1[i] + vector2[i]);
		}
		return result_vector;
	}
	
	//Returns a vector that represents the subtraction betweeen two vectors
	static SubVectors(vector1, vector2)
	{
		var result_vector = [];
		for (var i = 0; i < vector1.length; i++)
		{
			result_vector.push(vector1[i] - vector2[i]);
		}
		return result_vector;
	}

	static DotProduct(vector1, vector2)
	{
		var result = 0;
		for (var i = 0; i < vector1.length; i++)
		{
			result += vector1[i] * vector2[i];
		}
		return result;
	}

	//Returns a vector representing the result of the cross product operation on two vectors
	static CrossProduct(vector1, vector2)
	{
		var result = [vector1[1] * vector2[2] - vector1[2] * vector2[1], vector1[2] * vector2[0] - vector1[0] * vector2[2], vector1[0] * vector2[1] - vector1[1] * vector2[0]]
			return result;
	}

	//Returns a number representing the magnitude of the vector that is the result of the cross product between two vectors
	static CrossProductMagnitude(vector1, vector2)
	{
		//a x b = |a| * |b| * sin(t); t = angulo entre a e b
		return GetMagnitudeOfVector(vector1) * GetMagnitudeOfVector(vector2) * Math.sin(GetAngleBetweenVectors(vector1, vector2));
	}

	static GetAngleBetweenVectors(vector1, vector2)
	{
		var cos = this.DotProduct(vector1, vector2) / (this.GetMagnitudeOfVector(vector1) * this.GetMagnitudeOfVector(vector2));
		//Fix floating point number
		if (cos > 1)
			cos = 1;
		return Math.acos(cos);
	}

	//This function returns the angle that vector makes from the origin of the referencial (angle between 0 and 360 degrees)
	static GetFullAngleFromReferencial(vector, ref_vector0, ref_vector90)
	{
		var ref_angle0 = Vectors.GetAngleBetweenVectors(vector, ref_vector0);
		var ref_angle90 = Vectors.GetAngleBetweenVectors(vector, ref_vector90);
		var angle;

		if (ref_angle0 < Math.PI / 2) //1st or 4th quadrant
		{
			if (ref_angle90 < Math.PI / 2) //1st quadrant
				angle = ref_angle0;
			else if (ref_angle90 > Math.PI / 2) //4th quadrant
				angle = -ref_angle0;
			else //(ref_angle90 == Math.PI/2) //positive x axis
				angle = ref_angle0; // = 0
		}
		else if (ref_angle0 > Math.PI / 2) //2nd or 3rd quadrant
		{
			if (ref_angle90 < Math.PI / 2) //2nd quadrant
				angle = ref_angle0;
			else if (ref_angle90 > Math.PI / 2) //3rd quadrant
				angle = Math.PI * 2 - ref_angle0;
			else //(ref_angle90 == Math.PI/2) //negative x axis
				angle = ref_angle0; // = Math.PI
		}
		else
			if (ref_angle90 == 0) //1st quadrant
				angle = ref_angle0;
			else //if (ref_angle90 == Math.PI/2) //4th quadrant
				angle = -ref_angle0;

		return angle;
	}

	static CopyContent(v1, v2)
	{
		for (var i = 0; i < v1.length; i++)
		{
			v1[i] = v2[i];
		}
	}
}
