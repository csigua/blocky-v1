// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements

let g_globalAngle = 0;
let g_globalAngles = [0,0];
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_rotationOrigin = [0,0];
let stored_color = [0.0, 0.0, 0.0, 0.0];

function addActionsForHtmlUI() {
  // Clear button event
  document.getElementById('animateOn').onclick = function() {g_yellowAnimation = true};
  document.getElementById('animateOff').onclick = function() {g_yellowAnimation = false};

  // // Drawing mode events
  // document.getElementById('pointButton').onclick = function() {g_chosen_type = POINT};
  // document.getElementById('triangleButton').onclick = function() {g_chosen_type = TRIANGLE};
  // document.getElementById('circleButton').onclick = function() {g_chosen_type = CIRCLE};

  // // Color slider events
  // document.getElementById('redSlide').addEventListener('mouseup',    function() {g_chosen_color[0] = this.value/100; previewPanel()});
  // document.getElementById('greenSlide').addEventListener('mouseup',  function() {g_chosen_color[1] = this.value/100; previewPanel()});
  // document.getElementById('blueSlide').addEventListener('mouseup',   function() {g_chosen_color[2] = this.value/100; previewPanel()});
  document.getElementById('yellowSlide').addEventListener('mousemove', function() {g_yellowAngle = this.value; renderAllShapes()});
  document.getElementById('magentaSlide').addEventListener('mousemove', function() {g_magentaAngle = this.value; renderAllShapes()});

  // Property Slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
}

function main() {

  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev) {g_rotationOrigin = convertCoordinatesEventToGL(ev)};
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) }}

  // // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;

  // update animation angles
  updateAnimationAngles();

  // draw everything
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function click(ev) {
  // Extract event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  // rotate canvas
  g_globalAngles = [(g_rotationOrigin[1] - y)*100, -(g_rotationOrigin[0] - x)*100]

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45*Math.sin(g_seconds));
  }
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  var globalRotMat = new Matrix4()
  globalRotMat.rotate(g_globalAngles[0], 1, 0, 0);
  globalRotMat.rotate(g_globalAngles[1], 0, 1, 0);

  globalRotMat.rotate(g_globalAngle, 0,1,0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Draw the body cube
  var body = new Cube();
  body.color = [1.0,1.0,0.0,1.0];
  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5, 0.5, 0.5);
  body.render();

  // // draw a left arm
  // var leftArm = new Cube();
  // leftArm.color = [1,1,0,1];
  // leftArm.matrix.setTranslate(0.0, -0.5, 0.0);
  // leftArm.matrix.rotate(-5,1,0,0);

  // leftArm.matrix.rotate(-g_yellowAngle, 0,0,1);

  // var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  // leftArm.matrix.scale(0.25, 0.7, 0.5);
  // leftArm.matrix.translate(-0.5, 0.0, 0.0);
  // leftArm.render();

  // // test box
  // var box = new Cube();
  // box.color = [1,0,1,1];
  // box.matrix = yellowCoordinatesMat;
  // box.matrix.translate(0, 0.65, 0);
  // box.matrix.rotate(g_magentaAngle,0,0,1);
  // box.matrix.scale(0.3,0.3,0.3);
  // box.matrix.translate(-0.5,0,0);
  // box.matrix.translate(0,0,-0.001);
  // // box.matrix.rotate(-30,1,0,0);
  // // box.matrix.scale(0.2,0.4,0.2);
  // box.render();
}