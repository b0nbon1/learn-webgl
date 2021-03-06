var vertexShaderText = 
[
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  ' gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}'
].join('\n');

var fragmentShaderText = 
[
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  ' gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');


var InitDemo = function() {
  console.log("this is working");

  var canvas = document.getElementById("game-surface");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Your browser does not support WEBGL')
  }

  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // sets color on the canvas
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //...............................
  // create shaders
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // set shaders now
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  // compile shaders
  gl.compileShader(vertexShader);
  // debugging a shader if its working
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
    return;
  }
  gl.compileShader(fragmentShader);

  // debugging a shader if its working
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // debug the linking of the program
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking the program!', gl.getProgramInfoLog(program));
    return;
  }

  // Debugging the whole program by validating
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validatin program!', gl.getProgramInfoLog(program));
    return;
  }

  //
  // Create a buffer
  //
  var triangleVertices =
  [ // x, y       R,G,B
    0.0, 0.5,   1.0, 1.0, 0.0,
    -0.5, -0.5,  0.7, 0.0, 1.0,
    0.5, -0.5,     0.1, 1.0, 0.6,
  ];

  // active buffer is an array buffer
  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');

  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // attribute location
    2, // Number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // offset from the beginning of a single vertex to this attribute
    )

    gl.vertexAttribPointer(
      colorAttribLocation, // attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // type of elements
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
      2 * Float32Array.BYTES_PER_ELEMENT, // offset from the beginning of a single vertex to this attribute
      )

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    // Main render loop
    //

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
