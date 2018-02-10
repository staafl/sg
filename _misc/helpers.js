var t = THREE;
window.cgi = {};

function coalesce(obj, prop, value) {
    if (obj[prop] === undefined) {
        obj[prop] = value;
    }
    return obj[prop];
}

// constructors

window.OrbitControls =
    window.OrbitControls ||
    window.OrbitAndPanControls;

window.OrbitAndPanControls =
    window.OrbitAndPanControls || window.OrbitControls;

// setup

function setup(options) {

    options = options || {};
    coalesce(options, "gridEnabled", true);
    coalesce(options, "axesEnabled", true);
    coalesce(options, "statsEnabled", true);
    coalesce(options, "startAnimating", true);
    coalesce(options, "guiEnabled", options.guiOptions);

    options.sceneOptions = options.sceneOptions || {};
    options.gridOptions = options.gridOptions || {};
    options.axisOptions = options.axisOptions || {};
    options.statsOptions = options.statsOptions || {};
    options.animateOptions = options.animateOptions || {};

    setupScene(options.sceneOptions);

    if (options.gridEnabled) {
        drawGrids(options.gridOptions);
    }

    if (options.axesEnabled) {
        drawAxes(options.axisOptions);
    }

    if (options.statsEnabled) {
        createStats(options.statsOptions);
    }

    if (options.guiEnabled) {
        createGui(options.guiOptions);
    }

    if (options.startAnimating) {
        animate(options.animateOptions);
    }

    // backward
    window.scene = window.cgi.scene;
}

// setup renderer, scene, camera and controls
function setupScene(options) {
    var aspectRatio = screen.width / screen.height;

    options = options || {};

    coalesce(options, "clearColor", 0xffffff);
    options.canvasHeight = options.canvasHeight || screen.height;
    options.canvasWidth = options.canvasWidth || (options.canvasHeight * aspectRatio);

    // by default see 100 units along Y and 160 units along X
    options.cameraBoxHeight = options.cameraBoxHeight || 100;
    options.cameraBoxWidth =
        options.cameraBoxWidth ||
        options.cameraBoxHeight * aspectRatio;
    options.cameraFocus = options.cameraFocus || new THREE.Vector3(0, 0, 0);
    options.cameraDistance = options.cameraDistance || 50;
    // by default look at cameraFocus down negative z axis from cameraDistance
    options.cameraPosition =
        options.cameraPosition ||
        new THREE.Vector3(
            options.cameraFocus.x,
            options.cameraFocus.y,
            options.cameraDistance);
    options.cameraFar = options.cameraFar || 4000;
    options.cameraNear = options.cameraNear || 0.01;

    window.cgi.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });
    window.cgi.renderer.gammaInput = true;
    window.cgi.renderer.gammaOutput = true;

    // Evaluates to 2 if Retina
    var devicePixelRatio = window.devicePixelRatio || 1;

    window.cgi.renderer.setSize(
        options.canvasWidth// / devicePixelRatio,
        ,
        options.canvasHeight// / devicePixelRatio
        );

    window.cgi.renderer.setClearColor(options.clearColor);

    window.cgi.scene = new t.Scene();

    window.cgi.camera = new t.OrthographicCamera(
        -options.cameraBoxWidth / 2,
        options.cameraBoxWidth / 2,
        options.cameraBoxHeight / 2,
        -options.cameraBoxHeight / 2,
        options.cameraNear,
        options.cameraFar);

    window.cgi.cameraControls = new THREE.OrbitControls(
        window.cgi.camera,
        window.cgi.renderer.domElement);

	window.cgi.cameraControls.target.set(0,0,0);

    window.cgi.camera.position.copy(options.cameraPosition);
    window.cgi.camera.lookAt(options.cameraFocus);

//    // CAMERA
//	camera = new THREE.PerspectiveCamera( 38, aspectRatio, 1, 10000 );
//	camera.position.set( -510, 240, 100 );
//
//	// CONTROLS
//	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
//	cameraControls.target.set(0,120,0);
//	camera.position.set(5*-102, 4*177, 4*20);
//	cameraControls.target.set(-13, 100, 2);

    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(window.cgi.renderer.domElement);
    // container.style.border = "1px solid black";
};

function createStats(options) {
    window.cgi.stats = new Stats();
    window.cgi.stats.domElement.style.position = 'absolute';
    window.cgi.stats.domElement.style.top = '0px';
    $("#container").get(0).appendChild( window.cgi.stats.domElement );
}

function createGui(guiOptions) {

    guiOptions = guiOptions || { };

    // { properties: [{ name: ..., start: ..., min: ..., max: ..., step: ..., callback: ...}], builderCallback: ... }
	window.cgi.effectController = { };
	window.cgi.gui = new dat.GUI();

    if (guiOptions.builderCallback) {
        builderCallback(window.cgi.effectController, window.cgi.gui);
        // effectController.fps = 6.0;
        // var element = gui.add(effectController, "fps", 1.0, 60.0).step(1.0);
        // element.name("FPS");
	}
	if (guiOptions.properties) {
        guiOptions.properties.forEach(function (prop) {
            window.cgi.effectController[prop.name] = prop.start;
            var element = window.cgi.gui.add(window.cgi.effectController, prop.name, prop.min, prop.max).step(prop.step || 1.0);
            element.name(prop.name);
            if (prop.callback) {
                prop.callback(element, window.cgi.effectController, window.cgi.gui);
            }
        });
	}
}


function drawGrids(options) {
    Coordinates.drawGrid({
        size:100,
        scale:1,
        orientation:"z"
    });
}

function drawAxes(options) {
     Coordinates.drawAxes({
        axisLength: 100,
        axisOrientation: "x",
        axisRadius: 0.04,
        color: 0xff0000
    });

    Coordinates.drawAxes({
        axisLength: 100,
        axisOrientation: "y",
        axisRadius: 0.04,
        color: 0x00ff00
    });

    Coordinates.drawAxes({
        axisLength: 100,
        axisOrientation: "z",
        axisRadius: 0.04,
        color: 0x0000ff
    });
}


function animate(options, lastCall) {
    options = options || {};
    // javascript - Limiting framerate in Three.js to increase performance, requestAnimationFrame? - Stack Overflow
    // http://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
    options.fpsLimit = options.fpsLimit || 60;

    var now = new Date().getTime();
    setTimeout(function() {
        window.requestAnimationFrame(function() {
            animate(options, now);
        });
    }, Math.floor(1000 / options.fpsLimit));

    var renderCallback = options.renderCallback;
    var deltaMs = lastCall && now - lastCall;

    if (renderCallback && deltaMs) {
        renderCallback(deltaMs);
    }
    window.cgi.renderer.render(window.cgi.scene, window.cgi.camera);
    if (window.cgi.stats) {
        window.cgi.stats.update();
    }
}

// geometries

function squareXY(x1, y1, x2, y2) {

    var square = new THREE.Geometry();

    square.vertices.push(new THREE.Vector3(x1, y1, 0));
    square.vertices.push(new THREE.Vector3(x1, y2, 0));
    square.vertices.push(new THREE.Vector3(x2, y2, 0));
    square.vertices.push(new THREE.Vector3(x2, y1, 0));

    square.faces.push(new THREE.Face3(0, 1, 2));
    square.faces.push(new THREE.Face3(2, 3, 0));

    return square;
}

function triangleXY(x1, y1, x2, y2) {

    var square = new THREE.Geometry();

    square.vertices.push(new THREE.Vector3(x1, y1, 0));
    square.vertices.push(new THREE.Vector3(x2, y1, 0));
    square.vertices.push(new THREE.Vector3(x1, y2, 0));

    square.faces.push(new THREE.Face3(0, 1, 2));

    return square;
}

// materials

var defaultMaterialConstructor =
    function(materialProps) {
        return new THREE.MeshBasicMaterial(
            materialProps || defaultMaterialProps);
    };

var defaultMaterialProps = { color: 0xF6831E, side: THREE.DoubleSide };

var defaultMaterial = defaultMaterialConstructor();

function randomColor(predicate) {
    while (true) {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var rgb = r << 4 & g << 2 & b;
        if (!predicate || predicate(rgb)) {
            return rgb;
        }
    }
}

function randomLambertMaterial() {
    return new THREE.MeshLambertMaterial({ color: randomColor() });
}

function randomPhongMaterial() {
    return new THREE.MeshPhongMaterial({ color: randomColor() });
}

// scene construction

function addNewMesh(geometry, material) {
    var mesh = new t.Mesh(
            geometry,
            material || defaultMaterial);
    // mesh.frustumCulled = false;
    window.cgi.scene.add(mesh);
    return mesh;
}

// animation

function sequentialRotate(obj, deltaMs, revolutionsPerSecond) {
    var any = false;
    var step = (deltaMs / 1000) * revolutionsPerSecond * Math.PI;

    var axes = ["x", "y", "z"];
    var axisNext = { x: "y", y: "z", z: "x" };

    var times = 1 + _.min(_.map(axes, function(k) { return Math.floor(obj.rotation[k] / Math.PI); }));

    if (times == 3) {
        obj.rotation.copy(new t.Euler(0, 0, 0, 'XYZ'));
        times = 1;
    }

    // console.log("times: " + times);

    for (var ii = 0; ii < 3; ++ii) {
        var axis = _.maxBy(axes, function(k) { return (obj.rotation[k] >= times * Math.PI) ? -1 : obj.rotation[k]; });

        obj.rotation[axis] += step;
        // console.log(axis + ": " + obj.rotation[axis]);
        if (obj.rotation[axis] >= times * Math.PI) {
            obj.rotation[axis] = times * Math.PI;
            axis = axisNext[axis];
        }
        else {
            return;
        }

    }

    return;
//    ["xy", "yz", "zy"].forEach(function(axis) {
//        if (any) {
//            return;
//        }
//        cube.rotation[axis] += (delta / 1000) * revolutionsPerSecond * Math.PI;
//        if (cube.rotation[axis] >= 2*Math.PI) {
//            cube.rotation[axis] = 0;
//        }
//        else {
//            any = true;
//        }
//    });

};
