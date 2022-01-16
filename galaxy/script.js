var rocket;
const loadModel = fetch("https://megifalko.github.io/rr.obj")
  .then((r) => r.text())
  .then((text) => {
    console.log(text);
    rocket = new OBJ.Mesh(text);
    console.log(rocket);
    return rocket;
  });

var galaxy;
const loadGalaxyModel = fetch("https://megifalko.github.io/star.obj")
  .then((r) => r.text())
  .then((text) => {
    console.log(text);
    galaxy = new OBJ.Mesh(text);
    console.log(galaxy);
    return galaxy;
  });

window.onload = async () => {
  let someData = await loadModel;
  let someData2 = await loadGalaxyModel;
  console.log("Models downloaded");
  main();
};
var lightPower = 1.0;
var decrease = true;
var stop = true;
var body = document.querySelector("body");
function stopLight(){
  if(!stop) {
    lightPower = 1.0;
    body.style.backgroundImage = "linear-gradient(rgb(0 0 0 / 0%), rgb(0 0 0 / 0%)), url(galaxy.jpg)";
  }
  stop = !stop;
}

function adjustLight() {
  if(stop) return;
  if (decrease) {
    lightPower -= lightPower > 0.7 ? 0.0005 : 0.001;
    if (lightPower <= 0.0) decrease = false;
  } else {
    lightPower += lightPower > 0.7 ? 0.001 : 0.0005;
    if (lightPower >= 1.0) decrease = true;
  }
  body.style.backgroundImage = "linear-gradient(rgb(0 0 0 / " +parseInt(lightPower*100.0).toString() +"%), rgb(0 0 0 / " +parseInt(lightPower*100.0).toString() +"%)), url(galaxy.jpg)";
}

var reflectorPos = [
  $("#slider-x").val(),
  $("#slider-y").val(),
  $("#slider-z").val(),
];
("use strict");

var lightingModel = 1;
// document.querySelector(
//   'input[name="lightingModel"]:checked'
// ).value;

function updateLightingModel() {
  // lightingModel = document.querySelector(
  //   'input[name="lightingModel"]:checked'
  // ).value;
  lightingModel = $("#select_lighting").val();
  console.log(lightingModel);
}

function updateLight() {
  var x = $("#slider-x").val();
  var y = $("#slider-y").val();
  var z = $("#slider-z").val();
  reflectorPos = [x, y, z];
  console.log(reflectorPos);
  $("#slider-x-v").html(x);
  $("#slider-y-v").html(y);
  $("#slider-z-v").html(z);
}

var refPos = [0, 0, 0];
function updateMovingLight() {
  var rx = $("#slider-rx").val();
  var ry = $("#slider-ry").val();
  var rz = $("#slider-rz").val();
  refPos = [rx, ry, rz];
  console.log(reflectorPos);
  $("#slider-x-rv").html(rx);
  $("#slider-y-rv").html(ry);
  $("#slider-z-rv").html(rz);
}

var shadingMode = $("#select_shading").val();
console.log(shadingMode);

const shadingChanged = () => {
  shadingMode = $("#select_shading").val();
  console.log(shadingMode);
  programInfo = webglUtils.createProgramInfo(gl, [
    "vertex-shader-3d-" + shadingMode.toString(),
    "fragment-shader-3d-" + shadingMode.toString(),
  ]);
  main();
};

const getShading = () => {
  return parseFloat(shadingMode);
};

var cameraMode = $("#select_camera").val();
console.log(cameraMode);
const cameraChanged = () => {
  cameraMode = $("#select_camera").val();
};

var Node = function () {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
};

Node.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

Node.prototype.updateWorldMatrix = function (parentWorldMatrix) {
  if (parentWorldMatrix) {
    // a matrix was passed in so do the math
    m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
  } else {
    // no matrix was passed in so just copy local to world
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

var programInfo;
var gl;

// window.onload = function(){
//   OBJ.downloadMeshes({
//     'rocket': 'https://store2.gofile.io/download/f233ccd8-2b64-49b8-b4c8-926c10f37518/rocket.obj'
//   }, main());
// }
// function loadModel(script)
// {
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET",script.src)
//   xhr.onreadystatechange = function () {
//     if(xhr.status !== 200){
//       console.log(xhr)
//     }
//     if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

//       // console.log("the script text content is",xhr.responseText);
//       rocket = new OBJ.Mesh(xhr.responseText);
//       console.log(rocket);

//     }
//     main();
//   };
//   xhr.send();
// }

// Array.prototype.slice.call(document.querySelectorAll("script[src='https://megifalko.github.io/spaceShuttle.obj']")).forEach(loadModel);
function initBkgnd() {
    backTex = gl.createTexture();
    backTex.Img = new Image();
    backTex.Img.onload = function() {
        handleBkTex(backTex);
    }
    backTex.Img.src = "https://megifalko.github.io/galaxy.jpg";
}

function handleBkTex(tex) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.Img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  var ext = gl.getExtension("OES_element_index_uint");

  const sphereBufferInfo = primitives.createSphereWithVertexColorsBufferInfo(
    gl,
    12,
    36,
    36
  );
  console.log(sphereBufferInfo);

  let arrays = {
    position: rocket.vertices,
    texcoord: rocket.textures,
    normal: rocket.vertexNormals,
    indices: rocket.indices,
  };
  rocketBuffer = webglUtils.createBufferInfoFromArrays(gl, arrays);

  console.log(rocketBuffer);

  let arraysGalaxy = {
    position: galaxy.vertices,
    texcoord: galaxy.textures,
    normal: galaxy.vertexNormals,
    indices: galaxy.indices,
  };
  var galaxyBuffer = webglUtils.createBufferInfoFromArrays(gl, arraysGalaxy);

  console.log(galaxyBuffer);

  // var atr = rocketBuffer.attribs;
  // atr.a_color = sphereBufferInfo.attribs.a_color;
  // rocketBuffer.attribs = atr;

  // setup GLSL program
  programInfo = webglUtils.createProgramInfo(gl, [
    "vertex-shader-3d-" + shadingMode.toString(),
    "fragment-shader-3d-" + shadingMode.toString(),
  ]);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function emod(x, n) {
    return x >= 0 ? x % n : (n - (-x % n)) % n;
  }

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(60);
  var cameraHeight = 50;

  var objectsToDraw = [];
  var objects = [];

  // Let's make all the nodes
  var solarSystemNode = new Node();
  var earthOrbitNode = new Node();
  earthOrbitNode.localMatrix = m4.translation(200, 0, 0); // earth orbit 100 units from the sun
  var moonOrbitNode = new Node();
  moonOrbitNode.localMatrix = m4.translation(30, 0, 0); // moon 30 units from the earth
  var rocketOrbitNode = new Node();
  rocketOrbitNode.localMatrix = m4.translation(-250, 0, 50);
  var galaxyOrbitNode = new Node();
  galaxyOrbitNode.localMatrix = m4.translation(150, 0, 0);
  
  var mercuryOrbitNode = new Node();
  mercuryOrbitNode.localMatrix = m4.translation(90, 0, 0);
  
  var venusOrbitNode = new Node();
  venusOrbitNode.localMatrix = m4.translation(150, 0, 0);
  
  var marsOrbitNode = new Node();
  marsOrbitNode.localMatrix = m4.translation(-300, 0, 0);

  var sunNode = new Node();
  sunNode.localMatrix = m4.scaling(5, 5, 5); // sun a the center
  sunNode.drawInfo = {
    uniforms: {
      u_color: [0.6, 0.6, 0, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  var earthNode = new Node();
  earthNode.localMatrix = m4.scaling(2, 2, 2); // make the earth twice as large
  earthNode.drawInfo = {
    uniforms: {
      u_color: [0.0, 0.0, 1.0, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  var moonNode = new Node();
  moonNode.localMatrix = m4.scaling(0.4, 0.4, 0.4);
  moonNode.drawInfo = {
    uniforms: {
      u_color: [0.6, 0.6, 0.6, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  var rocketNode = new Node();
  rocketNode.localMatrix = m4.multiply(
    m4.xRotation(degToRad(-90)),
    m4.scaling(5.0, 5.0, 5.0)
  );

  rocketNode.drawInfo = {
    uniforms: {
      u_color: [1.0, 1.0, 1.0, 1.0],
    },
    programInfo: programInfo,
    bufferInfo: rocketBuffer,
  };

  var galaxyNode = new Node();
  galaxyNode.localMatrix = m4.scaling(0.5, 0.5, 0.5);
  galaxyNode.drawInfo = {
    uniforms: {
      u_color: [1.0, 1.0, 1.0, 1.0],
    },
    programInfo: programInfo,
    bufferInfo: galaxyBuffer,
  };
  
  var mercuryNode = new Node();
  mercuryNode.localMatrix = m4.scaling(0.6, 0.6, 0.6); // make the earth twice as large
  mercuryNode.drawInfo = {
    uniforms: {
      u_color: [1.0, 0.0, 0.3, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };
  
  var venusNode = new Node();
  venusNode.localMatrix = m4.scaling(1.2, 1.2, 1.2); // make the earth twice as large
  venusNode.drawInfo = {
    uniforms: {
      u_color: [1.0, 1.0, 0.3, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };
  
  var marsNode = new Node();
  marsNode.localMatrix = m4.scaling(1.4, 1.4, 1.4); // make the earth twice as large
  marsNode.drawInfo = {
    uniforms: {
      u_color: [1.0, 0.0, 0.0, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  // connect the celetial objects
  sunNode.setParent(solarSystemNode);
  earthOrbitNode.setParent(solarSystemNode);
  earthNode.setParent(earthOrbitNode);
  moonOrbitNode.setParent(earthOrbitNode);
  moonNode.setParent(moonOrbitNode);
  rocketOrbitNode.setParent(solarSystemNode);
  rocketNode.setParent(rocketOrbitNode);
  galaxyOrbitNode.setParent(solarSystemNode);
  galaxyNode.setParent(galaxyOrbitNode);
  mercuryOrbitNode.setParent(solarSystemNode);
  venusOrbitNode.setParent(solarSystemNode);
  marsOrbitNode.setParent(solarSystemNode);
  mercuryNode.setParent(mercuryOrbitNode);
  venusNode.setParent(venusOrbitNode);
  marsNode.setParent(marsOrbitNode);

  var objects = [sunNode, earthNode, moonNode, rocketNode, mercuryNode, venusNode, marsNode];

  var objectsToDraw = [
    sunNode.drawInfo,
    earthNode.drawInfo,
    moonNode.drawInfo,
    rocketNode.drawInfo,
    mercuryNode.drawInfo,
    venusNode.drawInfo,
    marsNode.drawInfo,
  ];

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.0005;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    //initBkgnd();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var earthPos = [
      earthNode.worldMatrix[12],
      earthNode.worldMatrix[13],
      earthNode.worldMatrix[14],
    ];
    var sunPos = [
      sunNode.worldMatrix[12],
      sunNode.worldMatrix[13],
      sunNode.worldMatrix[14],
    ];
    var cameraMatrix;
    var cameraPosition;
    if (cameraMode == 1) {
      //from above
      cameraPosition = [0, -300, 120];
      var target = [0, 0, 0];
      var up = [0, 0, 1];
      cameraMatrix = m4.lookAt(cameraPosition, target, up);
    }
    if (cameraMode == 2) {
      //from sun
      cameraPosition = [0, 0, 0];
      var target = earthPos;
      var up = [0, 0, 1];
      cameraMatrix = m4.lookAt(cameraPosition, target, up);
    }
    if (cameraMode == 3) {
      //observing earth
      cameraPosition = [
        earthPos[0] * 1.8,
        earthPos[1] * 1.8,
        earthPos[2] + 200,
      ];
      var target = [0, 0, 0];
      var up = [0, 0, 1];
      cameraMatrix = m4.lookAt(cameraPosition, target, up);
    }
    if (cameraMode == 4) {
      //observing earth
      cameraPosition = [
        earthPos[0] * 2.5,
        earthPos[1] * 2.5,
        earthPos[2] + 200,
      ];
      var target = [0, 0, 0];
      var up = [0, 0, 1];
      cameraMatrix = m4.lookAt(cameraPosition, target, up);
    }

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // update the local matrices for each object.
    m4.multiply(
      m4.zRotation(-0.01),
      earthOrbitNode.localMatrix,
      earthOrbitNode.localMatrix
    );
    m4.multiply(
      m4.zRotation(-0.01),
      moonOrbitNode.localMatrix,
      moonOrbitNode.localMatrix
    );
    // spin the earth
    m4.multiply(
      m4.zRotation(-0.05),
      earthNode.localMatrix,
      earthNode.localMatrix
    );
    m4.multiply(
      m4.zRotation(-0.015),
      mercuryOrbitNode.localMatrix,
      mercuryOrbitNode.localMatrix
    );
     m4.multiply(
      m4.zRotation(-0.013),
      venusOrbitNode.localMatrix,
      venusOrbitNode.localMatrix
    );
     m4.multiply(
      m4.zRotation(-0.008),
      marsOrbitNode.localMatrix,
      marsOrbitNode.localMatrix
    );
  
    m4.multiply(m4.zRotation(0.01), moonNode.localMatrix, moonNode.localMatrix);
    
    
    
    m4.multiply(
      m4.zRotation(-0.01),
      rocketOrbitNode.localMatrix,
      rocketOrbitNode.localMatrix
    );
    
    // m4.translate(rocketOrbitNode.localMatrix, [0, Math.sin(time)*50, 0], rocketOrbitNode.localMatrix);
    m4.multiply(
      m4.yRotation(0.01),
      rocketNode.localMatrix,
      rocketNode.localMatrix
    );
    
    //console.log(lightingModel)
    // 
    var rp = m4.multiply(
        m4.translation(refPos[0], refPos[1], refPos[2]),
        rocketNode.worldMatrix
      );
    var rocketPos = [0.9 * rp[12], 0.9 * rp[13], 0.9 * rp[14]];
    // rocketPos = [rocketNode.worldMatrix[12], rocketNode.worldMatrix[13],rocketNode.worldMatrix[14]];
    // Update all world matrices in the scene graph
    solarSystemNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function (object) {
      var viewModelMatrix = m4.multiply(viewMatrix, object.worldMatrix);
      object.drawInfo.uniforms.u_matrix = m4.multiply(
        viewProjectionMatrix,
        object.worldMatrix
      );
      object.drawInfo.uniforms.Mmatrix = object.worldMatrix;
      object.drawInfo.uniforms.Vmatrix = viewMatrix;
      object.drawInfo.uniforms.MVmatrix = viewModelMatrix;
      object.drawInfo.uniforms.Pmatrix = projectionMatrix;
      object.drawInfo.uniforms.NMmatrix = m4.transpose(
        m4.inverse(viewModelMatrix)
      );
      object.drawInfo.uniforms.u_reflectorPos = reflectorPos;
      object.drawInfo.uniforms.u_fogColor = [0, 0, 0, 1];
      object.drawInfo.uniforms.u_fogDensity = 0.003;
      object.drawInfo.uniforms.u_viewPos = cameraPosition;
      object.drawInfo.uniforms.u_worldPos = [object.worldMatrix[12], object.worldMatrix[13], object.worldMatrix[14]];
      object.drawInfo.uniforms.u_blinn = lightingModel == 1 ? 0.0 : 1.0;
      object.drawInfo.uniforms.u_power = lightPower;
      object.drawInfo.uniforms.u_rocketPos = rocketPos;
      object.drawInfo.uniforms.u_shadingMode = getShading();
    });
    // ------ Draw the objects --------

    var lastUsedProgramInfo = null;
    var lastUsedBufferInfo = null;

    objectsToDraw.forEach(function (object) {
      var programInfo = object.programInfo;
      var bufferInfo = object.bufferInfo;
      var bindBuffers = false;

      if (programInfo !== lastUsedProgramInfo) {
        lastUsedProgramInfo = programInfo;
        gl.useProgram(programInfo.program);
        bindBuffers = true;
      }

      // Setup all the needed attributes.
      if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
        lastUsedBufferInfo = bufferInfo;
        webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      }

      // Set the uniforms.
      webglUtils.setUniforms(programInfo, object.uniforms);

      // Draw
      if (bufferInfo.numElements != 7776) {
        gl.drawElements(
          gl.TRIANGLES,
          bufferInfo.numElements,
          gl.UNSIGNED_SHORT,
          0
        );
      } else gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    });

    requestAnimationFrame(drawScene);
    adjustLight();
  }
}
