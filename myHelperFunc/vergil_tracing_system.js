/*
tracing system
need to load three.js before using
*/
//tracing system set up
function tracing_system(object_array)
{
	var origin_object = null;
	var prev = null;
	for(i = 0; i < object_array.length; i++)
	{
		scene.add(object_array[i]);
		if(origin_object == null)
		{
			origin_object = {
				next_module: null,
				this_object: object_array[i],
				distance_to_next: 0.0,
				rotation_z_to_next: 0.0,
				random_move_frame_count: 0,
				random_move_rotation_angel_x: 0,
				random_move_rotation_angel_y: 0,
				trace_move: function(soft, elastic, transX, transY, transZ, rotateX, rotateY, rotateZ)
				{
					tracing_move_leader(this, soft, elastic, transX, transY, transZ, rotateX, rotateY, rotateZ);
				},
				random_move: function(soft, elastic, idle_time, x_pos_boundry, x_neg_boundry, y_pos_boundry, y_neg_boundry, z_pos_boundry, z_neg_boundry)
				{
					this.random_move_frame_count += 1;
					if(this.random_move_frame_count > idle_time)
					{
						this.random_move_frame_count = 0;
						if(this.this_object.position.x > x_pos_boundry || this.this_object.position.x < x_neg_boundry || this.this_object.position.y > y_pos_boundry || this.this_object.position.y < y_neg_boundry || this.this_object.position.z > z_pos_boundry || this.this_object.position.z < z_neg_boundry)
						{
							this.this_object.lookAt(new THREE.Vector3(0,0,0));
						}
						else
						{
							this.random_move_rotation_angel_x = Math.floor((Math.random() * 360) + 1) /180 * 3.14 - 3.14;
							this.random_move_rotation_angel_y = Math.floor((Math.random() * 360) + 1) /180 * 3.14 - 3.14;
						}									
					}
					var rotate_in_x = 0.0, rotate_in_y = 0.0;
					if (this.random_move_rotation_angel_x > 0)
					{
						rotate_in_x = 0.003;
						this.random_move_rotation_angel_x -= 0.003;
						if(this.random_move_rotation_angel_x < 0)
						{
							this.random_move_rotation_angel_x = 0.0;
						}
					}
					else if (this.random_move_rotation_angel_x < 0)
					{
						rotate_in_x = -0.003;
						this.random_move_rotation_angel_x += 0.003;
						if(this.random_move_rotation_angel_x > 0)
						{
							this.random_move_rotation_angel_x = 0.0;
						}
					}
					if (this.random_move_rotation_angel_y > 0)
					{
						rotate_in_y = 0.003;
						this.random_move_rotation_angel_y -= 0.003;
						if(this.random_move_rotation_angel_y < 0)
						{
							this.random_move_rotation_angel_y = 0.0;
						}
					}
					else if (this.random_move_rotation_angel_y < 0)
					{
						rotate_in_y = -0.003;
						this.random_move_rotation_angel_y += 0.003;
						if(this.random_move_rotation_angel_y > 0)
						{
							this.random_move_rotation_angel_y = 0.0;
						}
					}
					tracing_move_leader(this, soft, elastic, 0.0, 0.0, 0.05, rotate_in_x, rotate_in_y, 0.0);
				},
				random_move_x: function(soft, elastic, idle_time, x_pos_boundry, x_neg_boundry, y_pos_boundry, y_neg_boundry, z_pos_boundry, z_neg_boundry)
				{
					this.random_move_frame_count += 1;
					if(this.random_move_frame_count > idle_time)
					{
						if(this.this_object.position.x > x_pos_boundry || this.this_object.position.x < x_neg_boundry || this.this_object.position.y > y_pos_boundry || this.this_object.position.y < y_neg_boundry || this.this_object.position.z > z_pos_boundry || this.this_object.position.z < z_neg_boundry)
						{
							this.this_object.lookAt(new THREE.Vector3(0,0,0));
						}
						else
						{
							this.random_move_frame_count = 0;
							this.random_move_rotation_angel_x = Math.floor((Math.random() * 360) + 1) /180 * 3.14 - 3.14;
						}									
					}
					var rotate_in_x = 0.0;
					if (this.random_move_rotation_angel_x > 0)
					{
						rotate_in_x = 0.003;
						this.random_move_rotation_angel_x -= 0.003;
						if(this.random_move_rotation_angel_x < 0)
						{
							this.random_move_rotation_angel_x = 0.0;
						}
					}
					else if (this.random_move_rotation_angel_x < 0)
					{
						rotate_in_x = -0.003;
						this.random_move_rotation_angel_x += 0.003;
						if(this.random_move_rotation_angel_x > 0)
						{
							this.random_move_rotation_angel_x = 0.0;
						}
					}
					tracing_move_leader(this, soft, elastic, 0.0, 0.0, 0.05, rotate_in_x, 0.0, 0.0);
				}
			};

			prev = origin_object;
		}
		else
		{
			var new_object = {
				next_module: null,
				this_object: object_array[i],
				distance_to_next: 0.0,
				rotation_z_to_next:0.0
			}

			prev.next_module = new_object;
			//calculate the distance so in the future they will always keep the same distance
			prev.distance_to_next = distance_between(object_array[i], prev.this_object);
			prev = new_object;
		}
	}
	return origin_object;
}
//tracer movement, should accept two parameters, one is the object, the other is its moving destination
//when move, it should first roate the object toward that destination's direction
//then move the object to that position
//finally it passes its previous position( the position at beginning of this function) to next object
//the parameter "soft" means is the tracing movement is like a soft chain(can be twisted) or a hard snake
//like creature, finally elastic is NOT FINISHED YET! It is like when the leading module is self rotating,
//its child should also follow the self rotation so that the neck of this snake won't broke!
function tracing_move_leader(leader, soft, elastic, transX, transY, transZ, rotateX, rotateY, rotateZ)
{
	//rotate and move the object
	leader.this_object.rotateOnAxis (new THREE.Vector3(1,0,0), rotateX);
	leader.this_object.rotateOnAxis (new THREE.Vector3(0,1,0), rotateY);
	leader.this_object.rotateOnAxis (new THREE.Vector3(0,0,1), rotateZ);
	leader.this_object.translateX(transX);
	leader.this_object.translateY(transY);
	leader.this_object.translateZ(transZ);
	//pass the previous position to children
	if(leader.next_module != null)
	{
		//update leader matrix
		leader.this_object.updateMatrixWorld();
		//get z rotation related data(self rotate)		
		//console.log(rotation_so_far);
		//postive and negative trick. In Three js the rotation is between 3.14~-3.14. It means
		//if you achieve 3.14 then all of a sudden it will change to -3.14
		tracing_move_tracer(leader.next_module, leader, leader.distance_to_next, soft,elastic);
	}
}

function tracing_move_tracer(tracer, leader, distance, soft, elastic)
{
	//update tracer matrix
	tracer.this_object.lookAt(leader.this_object.position);
	//tracer.this_object.rotation.z = leader.this_object.rotation.z;
	var distanceNow = distance_between(tracer.this_object, leader.this_object);
	if(distanceNow - distance > 0 || !soft)
	{
		tracer.this_object.translateZ(distanceNow - distance);
	}		
	//rotate
	
	//move the tracer along the path of leader
	if(tracer.next_module != null)
	{
		//update tracer matrix
		tracer.this_object.updateMatrixWorld();
		tracing_move_tracer(tracer.next_module, tracer, tracer.distance_to_next, soft, elastic);
	}
}



/*
math and basic helper
*/
function distance_between( object1, object2 )
{
	object1.updateMatrixWorld();
	object2.updateMatrixWorld();
	v1 = new THREE.Vector3().setFromMatrixPosition(object1.matrixWorld);
	v2 = new THREE.Vector3().setFromMatrixPosition(object2.matrixWorld);
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}
