import * as THREE from 'three';
import OrbitControlsBootstrap from 'three-orbit-controls';
import Terrain from './Terrain';
import PlaneGenerator from './PlaneGenerator';

var container, camera, scene, renderer, objects;
var particleLight, clock, controls;
var formCameraX, formCameraY, formCameraZ;
const OrbitControls = OrbitControlsBootstrap(THREE);


function init() {

	formCameraX = document.getElementById('camera-x');
	formCameraY = document.getElementById('camera-y');
	formCameraZ = document.getElementById('camera-z');

	clock = new THREE.Clock();

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 20, 20, 30 );
	controls = new OrbitControls( camera );
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();

	// Grid

	var t = new Terrain({width: 60, height: 60, hills: 12, min: -2, max: 10});
	var p = new PlaneGenerator({width: 60, height: 60, z: function(x, y){
		return t.getCellValue(x, y);
	}});
	var pWater = new PlaneGenerator({width: 60, height: 60, z: function(x, y){
		return 0.01;
	}});
	t.generate();

	var hills = p.generate();// new THREE.Geometry();
	var material = new THREE.MeshPhongMaterial({
		color: 0x006600,
		shading: THREE.FlatShading
	});
	var water = new THREE.MeshPhongMaterial({
		color: 0x000066,
		shading: THREE.FlatShading
	});
	water.specular = new THREE.Color(0xAAAAAA);


	var plane = new THREE.Mesh( hills, material);
	scene.add( plane );
	var waterPlane = new THREE.Mesh( pWater.generate(), water);
	scene.add( waterPlane );


	// Lights

	scene.add( new THREE.AmbientLight( 0xFFFFFF ) );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 5, 0.25 );
	scene.add( directionalLight );


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function render() {
	renderer.render( scene, camera );
	formCameraX.value = camera.position.x;
	formCameraY.value = camera.position.y;
	formCameraZ.value = camera.position.z;
}

window.addEventListener('load', function(){
	init();
	render();
});
