/*
model loader
need to load three.js and MTLLoader.js and OBJLoader.js before using
*/
function load_obj(obj_url, mtl_url, manager)
{
	var group = new THREE.Object3D();
	var mtlLoader = new THREE.MTLLoader();
	//If you don't set base url then base url will become string "undefined", this means
	//for some path you give to system (for example, path of texture), the system will make 
	//the path into "undefined" + path. "C/Desktop" will become "undefinedC/Desktop"
	mtlLoader.setBaseUrl("");
	mtlLoader.load( mtl_url, function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader(manager);
		objLoader.setMaterials( materials );
		objLoader.load( obj_url, function ( object ) {
			object.traverse( function( node ) { 
				if ( node instanceof THREE.Mesh ) 
					{ 
						node.castShadow = true; 
						node.receiveShadow = true;
					} 
			} );
			group.add(object);
			scene.add( group );
		});
	});
	return group;
}

