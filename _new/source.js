// ..\_misc\helpers.js

setup();
addNewMesh(triangleXY(0, 0, 50, 50));

// LIGHTS
//*
var ambientLight = new THREE.AmbientLight( 0x222222 );

var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
light.position.set( 200, 400, 500 );

var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
light2.position.set( -500, 250, -200 );

scene.add(ambientLight);
scene.add(light);
scene.add(light2);
//*/

/*
addNewMesh(
    new THREE.SphereGeometry(10, 32, 32), 
    randomPhongMaterial());
//*/

//*
var material = new THREE.LineBasicMaterial({
	color: 0x0000ff
});

var geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 0, 10, 0 ),
);

var line = new THREE.Line( geometry, material );
scene.add( line );
//*/