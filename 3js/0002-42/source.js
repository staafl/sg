// ..\_misc\helpers.js

var cube;

var expansion = 1;
var direction = 1;
var my_random = 0;
var pushed = {};
var any_reversal = false;
setup({
    axesEnabled: false,
    gridEnabled: false,
    guiOptions: {
        properties: [{
            name: "test",
            start: 10,
            min: 1,
            max: 60,
            step: 1
        }]
    },
    sceneOptions: {
        clearColor: 0x000000,
        cameraBoxHeight: 10,
        cameraPosition: new t.Vector3(100, 100, 100)
    },
    animateOptions: {
        fpsLimit: 60,
        renderCallback: function (deltaMs) {
            var revolutionsPerSecond = 0.5;
            var percentPerSecond = 100;
            var max = 3;
            if (cube) {
                sequentialRotate(cube, deltaMs, revolutionsPerSecond);
                var scalarStep = (percentPerSecond / 100) * (deltaMs / 1000);
                var multiplyBy = 1 + scalarStep;
                if (expansion > max) {
                    direction = -1;
                    my_random = 0;
                }
                else if (expansion < 1) {
                    direction = 1;
                    my_random = 0;
                    pushed = {};
                }
                if (direction < 0) {
                    multiplyBy = 1 / multiplyBy;
                }
                expansion *= multiplyBy;
                // console.log(expansion);
                for (var i = 0; i < 60; ++i) {
                    var vertex = Math.floor(Math.abs(Math.sin(100 * (my_random++)))*10000) % 60;
                    pushed[vertex] = pushed[vertex] || [1];
                    if (direction > 0) {
                        cube.geometry.vertices[ vertex ].multiplyScalar(multiplyBy);
                        pushed[vertex].push(multiplyBy);
                    }
                    else {
                        cube.geometry.vertices[ vertex ].multiplyScalar(1 / (pushed[vertex].pop() || 1));
                    }
                }
                cube.geometry.verticesNeedUpdate = true; // important
            }
        }
    }
});

// deprecated
//var texture = t.ImageUtils.loadTexture('tick42-logo-white.png');
var texture = new t.TextureLoader().load('tick42-logo-white.png');
var geo = new t.BoxGeometry(2, 2, 2, 2);
var explodeModifier = new THREE.ExplodeModifier();
explodeModifier.modify( geo );
cube = addNewMesh(
    geo,
    new t.MeshNormalMaterial({ color: "white", map: texture }));


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

// OBJECTS
/*
addNewMesh(triangleXY(0, 0, 50, 50));

addNewMesh(
    new THREE.SphereGeometry(10, 32, 32),
    randomPhongMaterial());

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