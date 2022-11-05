/*global THREE, requestAnimationFrame, console*/

var currentCamera, camera1, camera2 , camera3, scene, renderer;

var geometry, mesh;

var room, sculpture, op_art, sphere,cone;

var size = 3;

var directionalLight1 ,directionalLight2, spotLight1, spotLight2, spotLight4 , spotLight3;

var light1,light2,light3,light4;

var material_state = 1; // basic = 0, lambert = 1, phong = 2 
var previous_material = 1;

var meshArrayDots, meshArraylines, meshArrayBox, meshArrayWall, meshArrayFloor, meshArrayICO, meshArrayPilar, meshMoldura;

function createMeshArray(mesh_color){

	'use strict';

    var materialArray = [
    new THREE.MeshBasicMaterial({
        color: mesh_color
    }),
    new THREE.MeshPhongMaterial({
        color: mesh_color
    }),
    new THREE.MeshLambertMaterial({
        color: mesh_color
    })
	];
    return materialArray;
}

function changeMaterialAux(node, index){

	'use strict';

    if(node.name == "dot"){
        node.material = meshArrayDots[index];
    }
    if(node.name == "box"){
        node.material = meshArrayBox[index];
    }
    if(node.name == "line"){
        node.material = meshArraylines[index];
    }
    if(node.name == "pilar"){
        node.material = meshArrayPilar[index];
    }
    if(node.name == "ico"){
        node.material = meshArrayICO[index];
    }
    if(node.name == "wall"){
        node.material = meshArrayWall[index];
    }
    if(node.name == "floor"){  
        node.material = meshArrayFloor[index];
    }
    if(node.name == "moldura"){
        node.material = meshMoldura[index];
    }

}

function changeMaterialE(){
	'use strict';

    if(material_state == 0)
        return;

    if (material_state == 1){
        material_state = 2;
        previous_material = 1;
    }
    else {
        material_state = 1;
        previous_material = 2;
    }

    for(var i = 0; i < op_art.children.length; i++){
            changeMaterialAux(op_art.children[i],material_state);
    }
    for(var i = 0; i < room.children.length; i++){
            changeMaterialAux(room.children[i],material_state);
    }
    for(var i = 0; i < sculpture.children.length; i++){
            changeMaterialAux(sculpture.children[i],material_state);            
    }
}

function changeMaterialW(){
	'use strict';

    if(material_state != 0){
        previous_material = material_state;
        material_state = 0;
    }

    else{
        material_state = previous_material;
        previous_material = 0;
    }

    for(var i = 0; i < op_art.children.length; i++){
            changeMaterialAux(op_art.children[i], material_state);                        
    }

    for(var i = 0; i < room.children.length; i++){
            changeMaterialAux(room.children[i],material_state);
    }
    for(var i = 0; i < sculpture.children.length; i++){
            changeMaterialAux(sculpture.children[i],material_state);
    }
}


//OP ART
function addOPrectangle(obj,altura, largura, x,y,z, material){

	 'use strict';

    geometry = new THREE.BoxGeometry(0.5, altura, largura,10,10,10);
    mesh = new THREE.Mesh(geometry,material);
    mesh.position.set(x,y,z);
    if(material.color.equals(new THREE.Color(0))){
        mesh.name = "box";
    }

    else{
        mesh.name = "line";
    }

    obj.add(mesh);
}

function addOPdots(obj,x,y,z, material){

	'use strict';

    geometry = new THREE.CylinderGeometry( 0.4, 0.4, 0.1, 64,64 );
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x,y,z);
    mesh.rotation.z = Math.PI / 2;
    mesh.name = "dot";
    obj.add(mesh);  
}

function addMoldura(obj, x, y, z){

	'use strict';

	meshMoldura = createMeshArray(0xd2b48c);
	for(var i=0; i<meshMoldura.length ; i++)
		meshMoldura[i].side = THREE.DoubleSide;
	geometry = new THREE.RingGeometry(17, 22, 4,30);
	mesh = new THREE.Mesh(geometry, meshMoldura[1]);
	mesh.name = "moldura";
	mesh.position.set(x,y,z);
	mesh.rotation.y = Math.PI / 2;
	mesh.rotation.x = Math.PI / 4;
	obj.add(mesh);

}

function createOPart(){

	'use strict';

    var lado = 25;
    var inicio_do_quadrado = lado/2;
    var espacamento = 2.5;
    var box_color = 0;
    var rectangle_color = 0XA4A4A4;
    var aux = 0;
    meshArraylines = createMeshArray(rectangle_color);
    meshArrayBox = createMeshArray(box_color);
    meshArrayDots = createMeshArray(0XFFFFFF);

    op_art = new THREE.Object3D();
    addMoldura(op_art, 1, 0, 0);
    addOPrectangle(op_art, lado, lado, 0, 0, 0, meshArrayBox[1]);
    
    
    for(var i = espacamento; i < lado; i+= espacamento){
        addOPrectangle(op_art, lado, 0.5, 0.1, 0, 25/2 -i , meshArraylines[1]);
    } 
      
    for(var i = espacamento; i < lado; i+= espacamento){
        addOPrectangle(op_art, 0.5, lado, 0.1, 25/2 -i, 0, meshArraylines[1]);
    }
    
    for(var i = espacamento ; i < lado ; i+=espacamento){
        for(var j = espacamento; j < lado; j+= espacamento){
            addOPdots(op_art, 0.31, 25/2 -i, 25/2 -j, meshArrayDots[1]);
        }
    }

    scene.add(op_art);
    op_art.position.x = -44.5;
    op_art.position.y =  25;
    op_art.position.z = 0;

}

function addFloor(obj, x, y, z) {

	'use strict';

    meshArrayFloor = createMeshArray(0XFFFFFF);
    geometry = new THREE.BoxGeometry(90, 1, 90, 30, 30, 30);
    mesh = new THREE.Mesh(geometry, meshArrayFloor[1]);
    mesh.name = "floor";
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWall(obj, x, y, z) {

    'use strict';

    meshArrayWall = createMeshArray(0x8f8996);
    geometry = new THREE.BoxGeometry(50 , 0 , 90, 30, 30, 30);
    mesh = new THREE.Mesh(geometry, meshArrayWall[1]);
    mesh.rotation.z = Math.PI * 0.5;
    mesh.position.set(x, y, z);
    mesh.name="wall";
    obj.add(mesh);
}

function addSculptureBottom(obj, x, y, z) {

    'use strict';
    meshArrayPilar = createMeshArray(0xd48ecf);
    geometry = new THREE.CylinderGeometry( 5, 5, 20, 64, 64);
    mesh = new THREE.Mesh(geometry, meshArrayPilar[1]);
    mesh.position.set(x, y, z);
    mesh.name ="pilar";
    obj.add(mesh);
}

function createRoom(x, y, z) {
   
    'use strict';
    
    room = new THREE.Object3D();
    
    addFloor(room, 0, 0, 0);
    addWall(room, -45, 25, 0);
    scene.add(room);
   
    room.position.x = x;
    room.position.y = y;
    room.position.z = z;
}

function createIcosahedron(obj,x,y,z){

	'use strict';
    meshArrayICO = createMeshArray(0xffa424);
	var t = (1 + Math.sqrt(5)) / 2;

	geometry = new THREE.Geometry();

	geometry.vertices.push(new THREE.Vector3(-size,t*size,0).multiplyScalar(1.14));
	geometry.vertices.push(new THREE.Vector3(size,t*size,0).multiplyScalar(1.13));
	geometry.vertices.push(new THREE.Vector3(-size,-t*size,0).multiplyScalar(1.15));
	geometry.vertices.push(new THREE.Vector3(size,-t*size,0).multiplyScalar(1.05));
	geometry.vertices.push(new THREE.Vector3(0,-size,t*size).multiplyScalar(1.2));
	geometry.vertices.push(new THREE.Vector3(0,size,t*size).multiplyScalar(0.93));
	geometry.vertices.push(new THREE.Vector3(0,-size,-t*size).multiplyScalar(1.11));
	geometry.vertices.push(new THREE.Vector3(0,size,-t*size).multiplyScalar(0.95));
	geometry.vertices.push(new THREE.Vector3(t*size,0,-size).multiplyScalar(0.85));
	geometry.vertices.push(new THREE.Vector3(t*size,0,size));
	geometry.vertices.push(new THREE.Vector3(-t*size,0,-size).multiplyScalar(1.1));
	geometry.vertices.push(new THREE.Vector3(-t*size,0,size).multiplyScalar(1.2));

	
	geometry.faces.push(new THREE.Face3(0,11,5));
	geometry.faces.push(new THREE.Face3(0,5,1));
	geometry.faces.push(new THREE.Face3(0,1,7));
	geometry.faces.push(new THREE.Face3(0,7,10));
	geometry.faces.push(new THREE.Face3(0,10,11));
	geometry.faces.push(new THREE.Face3(1,5,9));
	geometry.faces.push(new THREE.Face3(5,11,4));
	geometry.faces.push(new THREE.Face3(11,10,2));
	geometry.faces.push(new THREE.Face3(10,7,6));
	geometry.faces.push(new THREE.Face3(7,1,8));
	geometry.faces.push(new THREE.Face3(3,9,4));
	geometry.faces.push(new THREE.Face3(3,4,2));
	geometry.faces.push(new THREE.Face3(3,2,6));
	geometry.faces.push(new THREE.Face3(3,6,8));
	geometry.faces.push(new THREE.Face3(3,8,9));
	geometry.faces.push(new THREE.Face3(4,9,5));
	geometry.faces.push(new THREE.Face3(2,4,11));
	geometry.faces.push(new THREE.Face3(6,2,10));
	geometry.faces.push(new THREE.Face3(8,6,7));
	geometry.faces.push(new THREE.Face3(9,8,1));

	geometry.computeFaceNormals();
	

	mesh = new THREE.Mesh(geometry, meshArrayICO[1]);
    mesh.name = "ico"; 
	mesh.position.set(x, y, z);
	
	obj.add(mesh);

}


function createSculpture(x, y, z) {

    'use strict';
    
    sculpture = new THREE.Object3D();
   
    addSculptureBottom(sculpture, 0, 0, 0);
    createIcosahedron(sculpture,0, 15,0);
    scene.add(sculpture);
    
    sculpture.position.set(x , y , z);
 
}

function createLights(){

	'use strict';

	light1 = new THREE.Object3D();

	sphere = new THREE.SphereGeometry(3,20,20);
	cone = new THREE.ConeGeometry(3,7,64);
	mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x9083f4}));
    mesh.position.set(0, 0, 0);
    light1.add(mesh);
    mesh = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: 0xd2b48c}));
    mesh.position.set(0, 4, 0);
    light1.add(mesh);

    light2 = new THREE.Object3D();

	sphere = new THREE.SphereGeometry(3,20,20);
	cone = new THREE.ConeGeometry(3,7,64);
	mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffff78}));
    mesh.position.set(0, 0, 0);
    light2.add(mesh);
    mesh = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: 0xd2b48c}));
    mesh.position.set(0, 4, 0);
    light2.add(mesh);

    light3 = new THREE.Object3D();

	sphere = new THREE.SphereGeometry(3,20,20);
	cone = new THREE.ConeGeometry(3,7,64);
	mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x235813}));
    mesh.position.set(0, 0, 0);
    light3.add(mesh);
    mesh = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: 0xd2b48c}));
    mesh.position.set(0, 4, 0);
    light3.add(mesh);

    light4 = new THREE.Object3D();

	sphere = new THREE.SphereGeometry(3,20,20);
	cone = new THREE.ConeGeometry(3,7,64);
	mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xfd5d62}));
    mesh.position.set(0, 0, 0);
    light4.add(mesh);
    mesh = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: 0xd2b48c}));
    mesh.position.set(0, 4, 0);
    light4.add(mesh);

    light1.position.set(-20,60,38);
    light1.rotation.z += Math.PI/2;
    light1.rotation.y += Math.PI/2;
    light1.rotation.x += Math.PI/-3;
    light2.position.set(-20,60,-38);
    light2.rotation.z += Math.PI/2;
    light2.rotation.y += Math.PI/-2;
    light2.rotation.x += Math.PI/4;
    light3.position.set(20,60,38);
    light3.rotation.z += Math.PI/2;
    light3.rotation.y += Math.PI/1.5;
    light3.rotation.x += Math.PI/-3;
    light4.position.set(20,60,-38);
    light4.rotation.z += Math.PI/1.9;
    light4.rotation.y += Math.PI/-1.75;
    light4.rotation.x += Math.PI/3.75;
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);
}

function createspotLight(){

	'use strict';

	directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight1.position.set(10, 30, 20);
	directionalLight1.target.position.set(-10,10,0);
	scene.add(directionalLight1.target);
	scene.add(directionalLight1);
	spotLight1 = new THREE.SpotLight(0x9083f4,1,0,Math.PI/8,0,0);
	spotLight1.position.copy(light1.position);
	spotLight1.target.position.set(-22,0,0);
	scene.add(spotLight1.target);
	scene.add(spotLight1);
	spotLight2 = new THREE.SpotLight(0xffff78,1,0,Math.PI/8,0,0);
	spotLight2.position.copy(light2.position);
	spotLight2.target.position.set(-25,0,10);
	scene.add(spotLight2.target);
	scene.add(spotLight2);
	spotLight3 = new THREE.SpotLight(0x235813,1,0,Math.PI/8,0,0);
	spotLight3.position.copy(light3.position);
	spotLight3.target.position.set(-25,0,-10);
	scene.add(spotLight3.target);
	scene.add(spotLight3);
	spotLight4 = new THREE.SpotLight(0xfd5d62,1,0,Math.PI/8,0,0);
	spotLight4.position.copy(light4.position);
	spotLight4.target.position.set(-10,25,-10);
	scene.add(spotLight4.target);
	scene.add(spotLight4);
	
}





function createScene() {

    'use strict';
    
    scene = new THREE.Scene();

    createRoom(0,0,0);
    createSculpture(-10,18,0);
    createOPart();
    createLights();
    createspotLight();
    
}



function createCameras() {

    'use strict';
    camera1 = new THREE.OrthographicCamera(window.innerWidth/-45 , window.innerWidth/45 , window.innerHeight/45 , window.innerHeight / -45 , 1 , 1000);
    camera2 = new THREE.PerspectiveCamera(90, innerWidth / innerHeight , 1 , 1000);
    camera2.position.set(75, 70, 50);
    camera1.position.set(-35, 20,0);
    changeCamera(camera2);
}

function changeCamera(obj){

	'use strict';

	currentCamera = obj;
	currentCamera.lookAt(scene.position);
    if(currentCamera == camera1){
        camera1.lookAt(op_art.position);
    }
}



function onResize() {

    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {

        camera1.left = window.innerWidth / (-45);
        camera1.right = window.innerWidth / 45;
        camera1.top = window.innerHeight / 45;
        camera1.bottom = window.innerHeight / (-45);
        camera1.updateProjectionMatrix();


        camera2.aspect = window.innerWidth / window.innerHeight;
        camera2.updateProjectionMatrix();
    }

}

function lightOff(light,spotlight){
	'use strict';

	spotlight.visible = !spotlight.visible;
	if(light.children[0].material.color.equals(spotlight.color)){
    	light.children[0].material.color.set(0x808080);
	}
    else
    	light.children[0].material.color.copy(spotlight.color);

}


function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {

    	case 49: //1
    		lightOff(light1,spotLight1);
    		break;
    	case 50: //2
    		lightOff(light2, spotLight2);
    		break;
    	case 51: //3
    		lightOff(light3 , spotLight3);
    		break;

    	case 52: //4
			lightOff(light4, spotLight4);
    		break;

    	case 53: //5
    		changeCamera(camera1);
    		break;

    	case 54: //6
    		changeCamera(camera2);
    		break;

   		case 81:  //q
        	directionalLight1.visible = !directionalLight1.visible;  
        	break;

    	case 87:  //w
       	 	changeMaterialW();
        	break;

    	case 69:  //e
        	changeMaterialE();
        	break;
    }
    
}

function render() {
    'use strict';
    renderer.render(scene, currentCamera);

}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
    createScene();
    createCameras();
    
    render();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
  	
    render();
    requestAnimationFrame(animate);
}

