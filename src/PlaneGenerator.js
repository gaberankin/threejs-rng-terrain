import * as THREE from 'three';

var getxy = function(i, w, h) {
	var x = i % w;
	var y = (i - x) / w;
	return [x, y];
};

export default class PlaneGenerator {
	constructor(options) {
		this.options = {
			origin: [0, 0],
			z: function(x, y){ return 0; },
			width: 1,
			height: 1
		};
		for(var o in options) {
			if(options.hasOwnProperty(o) && this.options.hasOwnProperty(o)) {
				this.options[o] = options[o];
			}
		}
	}
	origin(){
		if(arguments.length == 0) {
			return this.options.origin;
		}
		if(arguments.length == 2) {
			this.options.origin = [parseFloat(arguments[0]), parseFloat(arguments[1])];
		}
	}
	z(){
		if(arguments.length == 0) {
			return this.options.z;
		}
		if(arguments[0] instanceof Function) {
			this.options.z = arguments[0];
		} else {
			var zVal = arguments[0];
			if(typeof zVal != 'number') {
				zVal = parseFloat(zVal);
				if(isNaN(zVal)) {
					return;
				}
			}
			this.options.z = function(x, y) { return zVal; };
		}
	}
	width() {
		if(arguments.length == 0) {
			return this.options.width;
		}
		var wVal = arguments[0];
		if(typeof wVal != 'number') {
			wVal = parseFloat(wVal);
			if(isNaN(wVal)) {
				return;
			}
		}
		this.options.width = wVal;
	}
	height() {
		if(arguments.length == 0) {
			return this.options.height;
		}
		var wVal = arguments[0];
		if(typeof wVal != 'number') {
			wVal = parseFloat(wVal);
			if(isNaN(wVal)) {
				return;
			}
		}
		this.options.height = wVal;
	}
	generate(){
		let geometry = new THREE.Geometry();

		for(let i = 0, l = this.options.width * this.options.height; i < l; i++) {
			//set up vertices
			let xy = getxy(i, this.options.width, this.options.height);
			let z = this.options.z(xy[0], xy[1]);
			geometry.vertices.push(new THREE.Vector3( this.options.origin[0] + xy[0] - this.options.width / 2, z, this.options.origin[1] + xy[1] - this.options.height / 2 ));
		}
		for(let n = 0, i = 0, l = ((this.options.width - 1) * (this.options.height - 1)); i < l; i++, n++) {
			//set up the triangles.
			if((n + 1) % this.options.width === 0){	//don't get the right edge
				n++;
			}

			geometry.faces.push( new THREE.Face3( n, n + this.options.width, n + this.options.width + 1 ) );
			geometry.faces.push( new THREE.Face3( n, n + this.options.width + 1, n + 1 ) );
		}
		return geometry;
	}
}
