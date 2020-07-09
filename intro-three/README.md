# Introduction to Threejs
This is the first article in a series of articles about three.js. Three.js is a 3D library that tries to make it as easy as possible to get 3D content on a webpage.

## First up, what is WebGL?
WebGL is a web technology that brings hardware-accelerated 3D graphics to the browser, without the need for installing additional plugins or downloading extra software.

## And what’s Three.js?
Both OpenGL and WebGL are relatively complex.

Three.js is here to help. It’s an open-source library that simplifies the creation of WebGL tools and environments. It covers the majority of the lower level programming involved in developing GPU-accelerated 3D animations.

We are going to learn how to build a simple scene using Three.js

## Enough chat. Let’s code.
let's start by setting up the html file where we will display our three.js. we create html file and add the following codes:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
			canvas { display: block; }
		</style>
	</head>
	<body>
  <script src="https://threejs.org/build/three.js"></script>
		<scrip src="js/app.js"></script> // create folder js and add file app.js
	</body>
</html>
```
all of our three.js codes will go to `js/app.js`.

### The Scene
A scene is the 3D space or stage containing all the objects we want to render. It allows you to set what is going to be rendered. This where you palce the objects, lights and cameras.

```js
var scene = new Three.Scene();
```

### The Camera
a (perspective) Camera simulates the behaviour of a film camera in real life. There are other camera like ArrayCamera, CubeCamera, OrthographicCamera, StereoCamera but we are going to focus on PerspectiveCamera.
The position and direction of your Camera will determine how the scenes will get rendered to the screen.While setting up your camera you need to pass in field of view, an aspect ratio, a near plane, and a far plane. These 4 values dictate the 3D space (viewing frustum) that can be captured by your camera.

***fov:*** The vertical field of view. This dictates the size of the vertical space your camera's view can reach.

***aspect:*** This is the aspect ratio you use to create the horizontal field of view based off the vertical.

***near:*** This is the nearest plane of view (where the camera's view begins).

***far:*** This is the far plane of view (where the camera's view ends).

![Frustrum](./images/frustum.svg "Frustrum")

Where your objects are within the viewing fustrum will effect how they appear rendered in your screen. Speaking of rendering, you'll need to add a Three.js renderer - a view that contains your camera's "picture".

```js
// add a camera
// THREE.PerspectiveCamera(fov, aspect, near, far)
var camera = new THREE.PerspectiveCamera(
  75, // fov
  window.innerWidth/window.innerHeight, // aspect ratio 
  0.1, // near clipping plane
  1000 // far clipping plane
);

// place the camera at z of 100
camera.position.z = 100;

// add a renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
// add the renderer element to the DOM so it is in our page
document.body.appendChild( renderer.domElement );
```

### Lighting
Just like a room the scene also needs the so that the objects can be visible. In THREE.js there are different kinds of lighting, and they're listed below with their description:

***AmbientLight:*** This light globally illuminates all objects in the scene equally. less of a light source and more of a soft color tint for the scene.

```js
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
```

***DirectionalLight:*** A light that gets emitted in a specific direction. This light will behave as though it is infinitely far away and the rays produced from it are all parallel. The common use case for this is to simulate daylight; the sun is far enough away that its position can be considered to be infinite, and all light rays coming from it are parallel.

```js
// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );
```

***HemisphereLight:*** A light source positioned directly above the scene, with color fading from the sky color to the ground color (think of ocean scene).

```js
var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );
```

***PointLight:*** A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb.

```js
var light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );
```

***RectAreaLight:*** RectAreaLight emits light uniformly across the face a rectangular plane. This light type can be used to simulate light sources such as bright windows or strip lighting.

```js
var width = 10;
var height = 10;
var intensity = 1;
var rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
rectLight.position.set( 5, 5, 0 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight )

rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
rectLight.add( rectLightHelper );
```

***SpotLight:*** just as name suggests, This light gets emitted from a single point in one direction, along a cone that increases in size the further from the light it gets.

```js
// white spotlight shining from the side, casting a shadow

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );
```

so after going throught the lighting, we are going to use pointlight:

```js
/* we need to add a light so we can see our cube - its almost
as if we're turning on a lightbulb within the room */
var light = new THREE.PointLight(0xFFFF00);
/* position the light so it shines on the cube (x, y, z) */
light.position.set(10, 0, 25);
scene.add(light);
```

### Geometry
In order to get a long with 3D geometry on WEBGL we need to understand a little 3D modelling terminology.

3D models (or meshes) are made up of vertices, edges and faces.

***Vertices:*** the points of intersection between 3 edges.

***Edges:*** an edge where two faces meet (think of the edges of a cube).

***Faces:*** polygons (triangles) that make up the faces of the model.

![Geometry](./images/geometry.png "Geometry")

All 3D models (also named meshes) can be broken down in to these little triangle polygons. You could construct the model geometry yourself by specifying all of the vertice positions, but the great thing about Three.js is that it provides a bunch of methods for you to create primitive shapes.

*note: I'll be using normal mesh material on the geometry examples but will talk about materials later*

Let's see how you can add some geometry to a 3D scene

```js
// create some geometry - this is how you create some square 
// geometry using the BoxGeometry method
var geometry = new THREE.BoxGeometry( 20, 20, 20);
// create a material
var material = new THREE.MeshNormalMaterial();
// add the geometry to the mesh - and apply the material to it
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
```
If you have tested the code and run, by using scene.add(cube) it has added the mesh we made at the point (0,0,0) in our scene. Just like our camera and lighting, we can update the position of the cube. We can also update the rotation of the cube, which we probably want to do here, since we can't even tell it is a cube when it's facing the camera like above!



