$(function () {
    var scene = new t.Scene();
    var camera = new t.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new t.WebGLRenderer();
    renderer.setClearColor(0x333333, 0.5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    var spotLight = new t.SpotLight();
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var axes = new t.AxisHelper(10);
    // scene.add(axes);

    var plane = new t.Mesh(new t.PlaneGeometry(60, 20, 1, 1),
                           new t.MeshLambertMaterial({ color: 0xCCCCCC }));
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;

    scene.add(plane);

    var cube = new t.Mesh(new t.CubeGeometry(4, 4, 4),
                          new t.MeshLambertMaterial({ color: 0xFF0000, wireframe: false }));
    cube.position.x = - 4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;

    scene.add(cube);

    var sphere = new t.Mesh(new t.SphereGeometry(4, 20, 20),
                            new t.MeshLambertMaterial({ color: 0x7777ff, wireframe: false }));
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    $("#container").append(renderer.domElement);

    var renderFunction = function() {
        window.requestAnimationFrame(renderFunction);
        renderer.render(scene, camera);
        stats.update();
    };
    var time = 0;
    setInterval(function() {
        time += 1;
        sphere.position.y= 4 + Math.abs(10 * Math.sin(Math.PI * (time / 10)));
    }, 100);
    addStats();
    renderFunction();
});
