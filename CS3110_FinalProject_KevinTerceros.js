// CS3110
// FINAL PROJECT - Tornado Simulation
// Kevin Terceros
// 5078969

/*********************** SHADERS ***********************/
// Vertex shader program
var VSHADER_SOURCE =                        // String of vertex shader programs
    'attribute vec4 a_Position;\n' +        // a_Position: vec4 - ??? (data is passed from outside the shader)
    'attribute vec4 a_Color;\n' +           // a_Color: vec4 - Receives colour data
    'attribute vec4 a_Normal;\n' +          // Normal for the orientation of surface
    'attribute vec2 a_TexCoord;\n' +        // a_TexCoord: vec2 - Texture coordinates passed
    'attribute float a_whichtex;\n' +       // a_whichtex: float - Determine which image to apply
    
    'uniform mat4 u_MvpMatrix;\n' +         // u_MvpMatrix: mat4 - Allows Matrix4 objects to be created
    'uniform mat4 u_NormalMatrix;\n' +
    'uniform vec3 u_LightColor;\n' +        // Light color
    'uniform vec3 u_LightDirection;\n' +    // Light direction (in the world coordinate, normalized)
    
    'varying vec4 v_Color;\n' +
    'varying vec2 v_TexCoord;\n' +          // v_TexCoord: vec2 - Allows texture coordinates to pass to fshader
    'varying float v_whichtex;\n' +         // v_whichtex: float - Allows image choice to pass to fshader
    
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +                // Apply transformations on mvpMatrix
    '   vec3 normal = normalize(a_Normal.xyz);\n' +                 // Dot product of the light direction and the orientation of a surface (the normal)
    // '   vec4 normal = u_NormalMatrix * a_Normal;\n' +
    '   float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' + // Calculate the color due to diffuse reflection
    '   vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
    '   v_Color = vec4(diffuse, a_Color.a);\n' +
    '   v_TexCoord = a_TexCoord;\n' +       // Value passing - to vshader
    '   v_whichtex = a_whichtex;\n' +       // Value passing - to vshader
    '}\n';

/*****End goal*****/
// float brightness = max(dot(lightDirection, normal), 0.0);
// fragColor = (baseColor * 0.2) + (baseColor * brightness * 0.8);

/*****Built-in functions*****/
// float v3 = dot(vec3 a, vec3 b);
// float v4 = dot(vec4 a, vec4 b);
// vec3 v1 = normalize(vec3 v);

/*****Information*****/
// Normals are a vec3 that have a direction from (0, 0, 0) to (x, y, z).

// Fragment shader program
var FSHADER_SOURCE =                        // String of fragment shader programs
    '#ifdef GL_ES\n' +
    '   precision mediump float;\n' +       // Default precision qualifier
    '#endif\n' +
    
    'uniform vec4 u_color;\n' +             // u_Color: vec4 - Passes value from vshader to fshader
    'uniform sampler2D u_Sampler0;\n' +     // u_Sampler: sampler2D - 2D texture
    'uniform sampler2D u_Sampler1;\n' +
    'uniform sampler2D u_Sampler2;\n' +
    'uniform sampler2D u_Sampler3;\n' +
    'uniform sampler2D u_Sampler4;\n' +
    'uniform sampler2D u_Sampler5;\n' +
    
    'varying vec4 v_Color;\n' +
    'varying vec2 v_TexCoord;\n' +          // v_TexCoord: vec2 - Takes texture coordinates from vshader
    'varying float v_whichtex;\n' +         // v_whichtex: float - Takes image choice from vshader
    
    'void main() {\n' +
    '   vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +   // Retrieving a color of a texel from the texture image 
    '   vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
    '   vec4 color2 = texture2D(u_Sampler2, v_TexCoord);\n' +
    '   vec4 color3 = texture2D(u_Sampler3, v_TexCoord);\n' +
    '   vec4 color4 = texture2D(u_Sampler4, v_TexCoord);\n' +
    '   vec4 color5 = texture2D(u_Sampler5, v_TexCoord);\n' +
    
    '   if (v_whichtex == 0.0)\n' +
    '       gl_FragColor = color0;\n' +
    '   else if (v_whichtex == 1.0)\n' +
    '       gl_FragColor = color1;\n' +
    '   else if (v_whichtex == 2.0)\n' +
    '       gl_FragColor = color2;\n' +
    '   else if (v_whichtex == 3.0)\n' +
    '       gl_FragColor = color3;\n' +
    '   else if (v_whichtex == 4.0)\n' +
    '       gl_FragColor = color4;\n' +
    '   else if (v_whichtex == 5.0)\n' +
    '       gl_FragColor = color5;\n' +
    '   else\n' +
    '       gl_FragColor = v_Color;\n' +
    '}\n';
/******************************************************************/

/*********************** BASIC SHAPE SETTERS ***********************/
/*************** 2D Shapes ***************/
// Square vertices
function setSquare() {
    var square = new Float32Array([   // texture coors added
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
    ]);

    return square;
}

// Square normals
function setSquareNormals(arrayLength) {
    var normals = new Float32Array([    // Normal
        // v0-v1-v2-v3 front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
   ]);

   return normals;
}

// Triangle vertices
function setTriangle() {
    var triangleVertices = new Float32Array([
         0.0,  1.0, // v0: top corner
         1.0, -1.0, // v1: bottom-right corner
        -1.0, -1.0  // v0: bottom-left corner
    ]);

    return triangleVertices
}

// Textures on 2D shapes
function setTexture() {
    var texCoords = new Float32Array([   // texture coors added
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
    ]);

    return texCoords;
}

// Color of any 2D shape
function set2DColor(arrayLength, r, g, b) {
    var shapeColorData = [];
    for (var i = 0; i < arrayLength; i++)  shapeColorData.push(r, g, b);

    return new Float32Array(shapeColorData);
}
/*****************************************/

/*************** Cubes ***************/
// Builds raw data for cube vertices
function setCube() {
    var cubeVertices = new Float32Array([
        1.0,  1.0,  1.0,    // v0: Right-up-near corner,
       -1.0,  1.0,  1.0,    // v1: Left-up-near corner,
       -1.0, -1.0,  1.0,    // v2: Left-down-near corner,
        1.0, -1.0,  1.0,    // v3: Right-down-near corner,
        1.0,  1.0, -1.0,    // v4: Right-up-far corner,
       -1.0,  1.0, -1.0,    // v5: Left-up-far corner,
       -1.0, -1.0, -1.0,    // v6: Left-down-far corner,
        1.0, -1.0, -1.0,    // v7: Right-down-far corner,
   ]);

   return cubeVertices;
}

// Builds raw data for cube indices
function setCubeIndices() {
    var cubeIndices = new Uint8Array([
        0, 1, 2, 0, 2, 3,   // front
        0, 1, 5, 0, 4, 5,   // up
        0, 3, 4, 3, 4, 7,   // right
        1, 2, 6, 1, 5, 6,   // left
        2, 3, 7, 2, 6, 7,   // down
        4, 6, 5, 4, 6, 7,   // back
    ]);

    return cubeIndices;
}

// Builds raw data for cube colors
function setCubeColor(r, g, b) {
    var cubeColor = [];
    for (var i = 0; i < 8; i++) cubeColor.push(r, g, b);

    return new Float32Array(cubeColor);
}

// Cube normals for lighting
function setCubeNormals() {
    var normals = new Float32Array([    // Normal
         0.0,  0.0,  1.0,    0.0,  0.0,  1.0,    0.0,  0.0,  1.0,    0.0,  0.0,  1.0,   // v0-v1-v2-v3 front
         0.0,  1.0,  0.0,    0.0,  1.0,  0.0,    0.0,  1.0,  0.0,    0.0,  1.0,  0.0,   // v0-v5-v6-v1 up
         1.0,  0.0,  0.0,    1.0,  0.0,  0.0,    1.0,  0.0,  0.0,    1.0,  0.0,  0.0,   // v0-v3-v4-v5 right
        -1.0,  0.0,  0.0,   -1.0,  0.0,  0.0,   -1.0,  0.0,  0.0,   -1.0,  0.0,  0.0,   // v1-v6-v7-v2 left
         0.0, -1.0,  0.0,    0.0, -1.0,  0.0,    0.0, -1.0,  0.0,    0.0, -1.0,  0.0,   // v7-v4-v3-v2 down
         0.0,  0.0, -1.0,    0.0,  0.0, -1.0,    0.0,  0.0, -1.0,    0.0,  0.0, -1.0,   // v4-v7-v6-v5 back
    ]);

    return normals;
}
/*****************************************/

/*************** Cone ***************/
var numSides = 10
// Raw data for cone vertices
function setCone() {
    var x, y = -2.0, z;
    var angle = 0;
    var inc = Math.PI * 2 / numSides;

    var coneData = [];
    for (var i = 0; i <= numSides; i++) {
        x = Math.cos(angle);
        z = Math.sin(angle);

        coneData.push(x, y, z);

        angle += inc;
    }

    return new Float32Array(coneData);
}

// Data for cone indices
function setConeIndices() {
    var coneIData = [];

    for (var i = 0; i < (numSides - 1); i++) {
        coneIData.push(i + 1);
        coneIData.push(i);
        coneIData.push(numSides + i);
        
        coneIData.push(i + 1);
        coneIData.push(numSides + i);
        coneIData.push(numSides + 1);
    }

    coneIData.push(0);
    coneIData.push(numSides - 1);
    coneIData.push(2 * numSides - 1);
    
    coneIData.push(0);
    coneIData.push(2 * numSides - 1);
    coneIData.push(numSides);

    return new Uint8Array(coneIData);
}

// Data for cone color
function setConeColor(r, g, b) {
    var coneColorData = [];
    for (var i = 0; i < (numSides - 1); i++) {
        for (var j = 0; j < 6; j++) {
            coneColorData.push(r, g, b);
        }
    }

    for (var i = 0; i < 6; i++) {
        coneColorData.push(r, g, b);
    }

    return new Float32Array(coneColorData);
}
/*****************************************/

/*************** Spheres ***************/
// I got all information in this subsection from the internet.
// Source: https://www.youtube.com/watch?v=L89lejZKPIk&list=PLPqKsyEGhUnaOdIFLKvdkXAQWD4DoXnFl&index=80

// Data for sphere vertices
var sphere_div = 15;
function setSphere() {
    var ax, sinx, cosx;
    var ay, siny, cosy;

    // Vertices
    var sphereVData = [];
    for (var y = 0; y <= sphere_div; y++) {
        ay = y * Math.PI / sphere_div;
        siny = Math.sin(ay);
        cosy = Math.cos(ay);
        
        for (var x = 0; x <= sphere_div; x++) {
            ax = x * 2 * Math.PI / sphere_div;
            sinx = Math.sin(ax);
            cosx = Math.cos(ax);

            sphereVData.push(sinx * siny);  // x-coor
            sphereVData.push(cosy);         // y-coor
            sphereVData.push(cosx * siny);  // z-coor
            
        }
    }

    return new Float32Array(sphereVData);
}

// Data for sphere indices
function setSphereIndices() {
    var p1, p2;

    var sphereIData = [];
    for (var y = 0; y < sphere_div; y++) {
        for (var x = 0; x < sphere_div; x++) {
            p1 = y * (sphere_div + 1) + x;
            p2 = p1 + (sphere_div + 1);

            sphereIData.push(p1);
            sphereIData.push(p2);
            sphereIData.push(p1 + 1);

            sphereIData.push(p1 + 1);
            sphereIData.push(p2);
            sphereIData.push(p2 + 1);
        }
    }

    return new Uint8Array(sphereIData);
}

// Data for sphere color
function setSphereColor(r, g, b) {
    var selColor = [];
    for (var y = 0; y <= sphere_div; y++) {
        for (var x = 0; x <= sphere_div; x++) {
            selColor.push(r, g, b);
        }
    }

    return new Float32Array(selColor);
}
/*****************************************/
/******************************************************************/

/*********************** INITIALIZATION ***********************/
/*************** Dynamically Changing Variables ***************/
var eyeX = 0, eyeY = 0.5, eyeZ = 0; // Eye position
var atX = 0, atY = 0.5, atZ = eyeZ - 1;   // Focal point
const upX = 0, upY = 1, upZ = 0;    // Some weird camera rotation variables
var fov = 50, aspectRatio = 1, near = 0.1, far = 500;

var angle = 0, rX = 1, rY = 0, rZ = 0;
var sX = 1.0, sY = 1.0, sZ = 1.0;
var r = 0.0, g = 0.0, b = 0.0;
/*****************************************/

// Sets up current view (mvpMatrix)
// Effective for starting over with an identity matrix * view variables
function initMvpMatrix(gl, u_MvpMatrix) {
    // Instantiate a new matrix for transforming, view, and projection
    var mvpMatrix = new Matrix4();
    
    // Matrix4.setPerspective(fov, aspectRatio, near, far)
    mvpMatrix.setPerspective(fov, aspectRatio, near, far);    // Set the eye point and the viewing volume

    // Matrix4.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
    mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
    
    // Pass the model-view-projection matrix to the vertex shader
    // gl.uniformMatrix4fv(u_location, doTranspose, array)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    return mvpMatrix;
}

// Sets up buffers and attribute values for Float32Array
// ONLY works for Float32Arrays
function arrayAttribBuffer(gl, array, shader_aVar, size, stride) {
    // Create a buffer object (memory) to hold vertices to be drawn
    var arrayBuffer = gl.createBuffer();
    if (!arrayBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    
    // Write the vertex coordinates and color to the buffer object (object-binding code)
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    
    // Allocate storage; hat the program is going to do with the data
    // gl.bufferData(gl.target, vertexData, usage)
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    
    // Assign the buffer object to a_Position and enable it
    // Get the storage location of a_Position, assign and enable buffer
    // Pass data from program to vertex shader
    var a_Variable = gl.getAttribLocation(gl.program, shader_aVar);
    if (a_Variable < 0) {
        console.log('Failed to get the storage location of ' + shader_aVar);
        return false;
    }
    
    // Assign a reference to a buffer object to attribute variable
    // Assign vertices (an array of values) to attribute variable
    // gl.vertexAttribPointer(storageLocation, size, dataType, isNormalized, stride, offset)
    gl.vertexAttribPointer(a_Variable, size, gl.FLOAT, false, stride, 0);
    
    // Enable assignment of buffer object to attribute variable
    // Allows access to buffer object in vertex shader
    // gl.enableVertexAttribArray(storageLocation);
    gl.enableVertexAttribArray(a_Variable);

    return true;
}

// Initialize 2D vertices, textures, and normals
function initVertexBuffers2D(gl, vertices, texture) {// Create a buffer object (memory) to hold vertices to be drawn
    // var FSIZE = vertices.BYTES_PER_ELEMENT;

    var checkInitVertices = arrayAttribBuffer(gl, vertices, 'a_Position', size_vertices = 2, stride_vertices = 0);
    var checkInitTexture = arrayAttribBuffer(gl, texture, 'a_TexCoord', size = 2, stride = 0);
    var checkInitLighting = arrayAttribBuffer(gl, squareNormals, 'a_Normal', size = 3, stride = 0);
    if (!((checkInitVertices && checkInitTexture) && checkInitLighting)) {    // Check initialization of triangle vertices
        console.log('Failed to set the positions of the vertices');
        return false;
    }

    return true;
}

// Initialize 2D vertices, colors, and normals
function initVertexBuffers2DNoTex(gl, vertices, shapeColor) {// Create a buffer object (memory) to hold vertices to be drawn
    // var FSIZE = vertices.BYTES_PER_ELEMENT;

    var checkInitVertices = arrayAttribBuffer(gl, vertices, 'a_Position', size_vertices = 2, stride_vertices = 0);
    var checkInitTexture = arrayAttribBuffer(gl, shapeColor, 'a_Color', size = 2, stride = 0);
    var checkInitLighting = arrayAttribBuffer(gl, squareNormals, 'a_Normal', size = 3, stride = 0);
    if (!((checkInitVertices && checkInitTexture) && checkInitLighting)) {    // Check initialization of triangle vertices
        console.log('Failed to set the positions of the vertices');
        return false;
    }

    return true;
}

// Initiallize 3D vertices, indices, and colors
function initVertexBuffers3D(gl, vertices, indices, colors) {
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var checkInitVertices = arrayAttribBuffer(gl, vertices, 'a_Position', size = 3, strides = FSIZE *3);
    var checkInitColors = arrayAttribBuffer(gl, colors, 'a_Color', size = 3, stride = FSIZE *3);
    var checkInitLighting = arrayAttribBuffer(gl, cubeNormals, 'a_Normal', size = 3, stride = 0);
    if (!((checkInitVertices && checkInitColors) && checkInitLighting)) {    // Check initialization of triangle vertices
        console.log('Failed to set the positions of the vertices');
        return false;
    }
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    
    return true;
}

// Binds the texture, u_sampler, and image together
function loadTexture(gl, texture, u_Sampler, image, texUnit) {
    // gl.pixelStorei(pname, parameter)
    // parameter - numerical true/false
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the y axis for the image
    
    // Activate a texture unit
    var g_texUnit0 = false, g_texUnit1 = false, g_texUnit2 = false;
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else if (texUnit == 1) {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    } else {
        gl.activeTexture(gl.TEXTURE2);
        g_texUnit2 = true;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);     // Bind texture object to target

    // Set parameters, specify how image will be processed
    // gl.texParameteri(target, pname, parameter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Set texture image
    // gl.texImage2D(target, level, inFormat, texelFormat, type, image, optN)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Pass texture image to fshader
    gl.uniform1i(u_Sampler, texUnit);       // Set texture unit to sampler
}

// Prepare a texture to bind to u_sampler and image object
function initTexture(gl, imgSrcName, texUnit) {
    var texture = gl.createTexture();  // Create a texture object to manage texture image and hold in WebGL system
    if (!texture) {
        console.log('Failed to create texture object');
        return false;
    }

    var u_Sampler;
    if (texUnit == 0) u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler0');      // Pass Sampler to fragment shader
    else if (texUnit == 1) u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler1'); // See above
    else if (texUnit == 2) u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler2'); // See above
    else if (texUnit == 3) u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler3'); // See above
    else if (texUnit == 4) u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler4'); // See above
    else if (texUnit == 5) u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler5'); // See above

    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }
    
    var image = new Image();   // Create an object that handles images
    if (!image) {
        console.log('Failed to create image object');
        return false;
    }

    // Register the event handler to be called when image is finished loading
    image.onload = function() {
        // loadTexture(renderContext, n_Vertices, texObject, u_SampLoc, imObject, n2);
        loadTexture(gl, texture, u_Sampler, image, texUnit);
    };

    // Tell browser to load an image by name
    image.src = imgSrcName;

    return true;
}

// Function that deals with all the lighting functionality
function initLighting(gl) {
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    if (!u_LightColor || !u_LightDirection) { 
        console.log('Failed to get the storage location for lighting');
        return false;
    }

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);  // Set the light color (white)
    var lightDirection = new Vector3([1.0, 2.0, 3.0]);
    lightDirection.normalize();     // Normalize
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    return true;
}
/******************************************************************/

/*********************** SHAPE DRAWING FUNCTIONS ***********************/
// Apply a transformation (shape appears roughly as expected)
function transform(
    gl, Matrix4, u_Matrix4,     // General - web_context, matrix, uVar_Shader
    tX, tY, tZ,                 // Translation coordinates
    angle, rX, rY, rZ,          // Rotation coordinates
    sX, sY, sZ                  // Scale coordinates
) {
    Matrix4.translate(tX, tY, tZ);
    Matrix4.rotate(angle, rX, rY, rZ);
    Matrix4.scale(sX, sY, sZ);    // Matrix4.rotate(angle (degrees), x, y, z)

    // Pass the model-view-projection matrix to the vertex shader
    // Apply transformations defined previously
    gl.uniformMatrix4fv(u_Matrix4, false, Matrix4.elements);
}

// Draw any 2D object with transformations applied
function draw2D(
    gl, Matrix4, u_Matrix4, shapeVertices,  // General - web_context, matrix, uVar_Shader, 2D Shape arrays
    tX, tY, tZ,                             // Translation coordinates
    angle, rX, rY, rZ,                      // Rotation coordinates
    sX, sY, sZ,                             // Scale coordinates
    r, g, b,
    texUnit,
) {
    transform(
        gl, Matrix4, u_Matrix4,     // General - web_context, matrix, uVar_Shader
        tX, tY, tZ,                 // Translation coordinates
        angle, rX, rY, rZ,          // Rotation coordinates
        sX, sY, sZ,                 // Scale coordinates
    );

    var vertexBuffers;
    if (texUnit == -1) {
        var shapeColor = set2DColor(shapeVertices.length / 2, r, g, b)
        vertexBuffers = initVertexBuffers2DNoTex(gl, shapeVertices, shapeColor);
    } else vertexBuffers = initVertexBuffers2D(gl, shapeVertices, texture);

    if (!vertexBuffers) {    // check initialization of triangle vertices
        console.log('Failed to set the positions of the square vertices');
        return;
    }
    
    var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
    gl.vertexAttrib1f(a_whichtex, texUnit);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, shapeVertices.length / 2);
}

function set3DColor(r, g, b, type) {
    if (type == "sphere")    return setSphereColor(r, g, b);
    else if (type == "cube") return setCubeColor(r, g, b);
    else if (type == "cone") return setConeColor(r, g, b);
    
    return null;
}

// Draw a general 3D shape with transformations applied
function draw3D(
    gl, Matrix4, u_Matrix4,         // General - web_context, matrix, uVar_Shader
    shapeVertices, shapeIndices,    // Sphere
    tX, tY, tZ,                     // Translation coordinates
    angle, rX, rY, rZ,              // Rotation coordinates
    sX, sY, sZ,                     // Scale coordinates
    r, g, b,                        // Color
    texUnit, type                   // Define how to draw
) {
    transform(
        gl, Matrix4, u_Matrix4,     // General - web_context, matrix, uVar_Shader
        tX, tY, tZ,                 // Translation coordinates
        angle, rX, rY, rZ,          // Rotation coordinates
        sX, sY, sZ,                 // Scale coordinates
    );

    // Set the vertex coordinates and color
    var shapeColor = set3DColor(r, g, b, type);
    if (!shapeColor) {
        console.log('Failed to set the ' + type + ' colors.');
        return;
    }
    if (!initVertexBuffers3D(gl, shapeVertices, shapeIndices, shapeColor)) {    // check initialization of triangle vertices
        console.log('Failed to set the positions of the ' + type + ' vertices.');
        return;
    }
    
    var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
    gl.vertexAttrib1f(a_whichtex, texUnit);
    
    // gl.drawElements(shape, len_shapeIdxArray, usignDataTyepe, offset)
    gl.drawElements(gl.TRIANGLE_STRIP, shapeIndices.length, gl.UNSIGNED_BYTE, 0);
}

/*************** Easy Reset Functions ***************/
// Resets shape drawing back to a previous scale (usually the default scaling)
function resetScale(matrix4, sX, sY, sZ) {
    matrix4.scale((1 / sX), (1 / sY), (1 / sZ));
    return matrix4;
}

// Resets shape drawing back to a previous orientation (usually the default orientation)
function resetRotate(matrix4, angle, rX, rY, rZ) {
    matrix4.rotate((angle * -1), rX, rY, rZ);
    return matrix4;
}
/*****************************************/
/******************************************************************/

/*********************** SPECIFIED DRAWINGS ***********************/
// Draw ground and sky
function drawEnvironment(gl, mvpMatrix, u_MvpMatrix) {
    mvpMatrix = initMvpMatrix(gl, u_MvpMatrix);
    // var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
    
    // Draw ground
    draw2D(
            gl, mvpMatrix, u_MvpMatrix, square,
            tX = 0.0, tY = 0.0, tZ = 0.0,
            angle = -90, rX = 1, rY = 0, rZ = 0,
            sX = 100.0, sY = 100.0, sZ = 1.0,
            r = 0.5, g = 0.5, b = 0.5,
            texUnit = 0.0
        );
    

    // Draw sky
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 0.0, tY = 0.0, tZ = 20.0,
        angle = 0, rX = 1, rY = 0, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 0.5, g = 0.5, b = 0.5,
        texUnit = 1.0
    );
}

// Draw moving, rotating tornado
var newAngle = 0.0;
var new_tornadoLoc = 90;
function drawTornado(gl, mvpMatrix, u_MvpMatrix) {
    mvpMatrix = initMvpMatrix(gl, u_MvpMatrix);

    // Get angle of rotation
    newAngle = (newAngle + 3) % 360;
    
    // Tornado moves only if in bounds
    if (new_tornadoLoc > -92) new_tornadoLoc = (new_tornadoLoc - 0.05);
    
    mvpMatrix.rotate(180, 1, 0, 0,);
    draw3D(
        gl, mvpMatrix, u_MvpMatrix,
        coneVertices, coneIndices, 
        tX = new_tornadoLoc, tY = 15.0, tZ = new_tornadoLoc,
        angle = newAngle, rX = 0, rY = 1, rZ = 0,
        sX = 7.0, sY = 20.0, sZ = 7.0,
        r = 0.5, g = 0.5, b = 0.5,
        texUnit = 2, type = 'cone' 
    );
}

// Draw the sun in the distance
function drawSun(gl, mvpMatrix, u_MvpMatrix) {
    mvpMatrix = initMvpMatrix(gl, u_MvpMatrix);
    draw3D(
        gl, mvpMatrix, u_MvpMatrix,
        cubeVertices, cubeIndices,
        tX = -300.0, tY = 40.0, tZ = -50.0,
        angle = 90, rX = 0, rY = 1, rZ = 0,
        sX = 10.0, sY = 10.0, sZ = 0.1,
        r = 1.5, g = 1.5, b = 1.5,      // 1.0 blended a bit too well with the canvas color
        texUnit = -1, type = "cube"
    );
}

// Draw house
function drawHouse(gl, mvpMatrix, u_MvpMatrix) {
    mvpMatrix = initMvpMatrix(gl, u_MvpMatrix);

    // Draw main building part
    mvpMatrix.rotate(-90, 0, 1, 0);
    draw3D(
        gl, mvpMatrix, u_MvpMatrix,
        cubeVertices, cubeIndices,
        tX = houseX, tY = houseY, tZ = houseZ,
        angle = houseRX, rX = 1, rY = 0, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 1.0, g = 0.75, b = 0.0,
        texUnit = -1, type = "cube"
    );
    mvpMatrix = resetRotate(mvpMatrix, angle = 90, rX = 0, rY = 1, rZ = 0);

    // Draw roof
    mvpMatrix.rotate(90, 0, 1, 0);
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 0.0, tY = 1.25, tZ = -0.8,
        angle = 50, rX = 1, rY = 0, rZ = 0,
        sX = 1.1, sY = 1.0, sZ = 1.0,
        r = 0.0, g = 0.0, b = 1.0,
        texUnit = 3.0
    );

    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 0.0, tY = 1.2, tZ = 1.0,
        angle = 80, rX = 1, rY = 0, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 0.0, g = 0.0, b = 1.0,
        texUnit = 3.0
    );

    mvpMatrix = resetScale(mvpMatrix, sX = 1.2, sY = 0.9, sZ = 1.0);
    // mvpMatrix = resetRotate(mvpMatrix, angle = 45, rX = 1, rY = 0, rZ = 0);
    mvpMatrix.rotate(-132.5, 1, 0, 0);
    mvpMatrix.scale(1.35, 1.35, 1.35);

    // Triangle parts of roof (front and back)
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, triangle,
        tX = -0.75, tY = 0.1, tZ = -0.5,
        angle = 90, rX = 0, rY = 1, rZ = 0,
        sX = 0.75, sY = 0.3, sZ = 1.0,
        r = 1.0, g = 1.0, b = 1.0,
        texUnit = 3.0
    );

    draw2D(
        gl, mvpMatrix, u_MvpMatrix, triangle,
        tX = 0.0, tY = 0, tZ = 1.5,
        angle = 0, rX = 1, rY = 0, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 1.0, g = 1.0, b = 1.0,
        texUnit = 3.0
    );

    // Draw windows
    mvpMatrix = resetScale(mvpMatrix, sX = 0.75, sY = 0.3, sZ = 1.0,);
    mvpMatrix.rotate(90, 0, 1, 0);
    // Back window
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 1.6, tY = -0.7, tZ = -0.2,
        angle = 90, rX = 0, rY = 1, rZ = 0,
        sX = 0.2, sY = 0.2, sZ = 0.2,
        r = 0.0, g = 0.0, b = 1.0,
        texUnit = 5.0
    );

    // Front window
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 0.0, tY = 0.0, tZ = -8.5,
        angle = 0, rX = 1, rY = 0, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 0.0, g = 0.0, b = 1.0,
        texUnit = 5.0
    );

    // Left window
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 2.2, tY = 0.0, tZ = 4.0,
        angle = 90, rX = 0, rY = 1, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 0.0, g = 0.0, b = 1.0,
        texUnit = 5.0
    );
    // Right window
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = 0.0, tY = 0.0, tZ = -7.3,
        angle = 5, rX = 1, rY = 0, rZ = 0,
        sX = 1.0, sY = 1.0, sZ = 1.0,
        r = 0.0, g = 0.0, b = 1.0,
        texUnit = 5.0
    );
    
    // Draw door
    mvpMatrix = resetScale(mvpMatrix, sX = 0.2, sY = 0.2, sZ = 0.2,);
    mvpMatrix.rotate(90, 0, 1, 0);
    draw2D(
        gl, mvpMatrix, u_MvpMatrix, square,
        tX = -0.6, tY = -0.6, tZ = 0.8,
        angle = 90, rX = 0, rY = 0, rZ = 1,
        sX = 0.3, sY = 0.2, sZ = 1.0,
        r = 1.0, g = 0.0, b = 0.0,
        texUnit = 4.0
    );
}
/******************************************************************/

/*********************** TORNADO PICKING UP THINGS ***********************/
// Check if the house is in the tornado or not
var houseX = -15.0, houseY = 1.0, houseZ = 0.0;
var houseRX = 0.0;
var houseState = "ground";    // Can be "ground", "lift", "float", "fall"
function checkHouseState() {
    if  (houseState == "ground") {    // House is grounded
        if ((new_tornadoLoc <= 18) && (new_tornadoLoc >= 17)) { // House lifts up if tornado gets too close
            houseState = "lift";
        }
    } else if (houseState == "lift") {  // House is picked up by tornado
        houseY += 0.2;
        if (houseY >= 15) houseState = "float";
    } else if (houseState == "float") { // House is in the air from the tornado
        if (Math.abs(houseZ - new_tornadoLoc) >= 27) {
            houseState = "fall";
        }
    } else if ((houseState == "fall") && (houseY >= 1.0)) { // House is falling to the ground
        houseY -= 0.2;
    } else houseState = "ground";
    
    if (houseState != "ground") {
        houseZ -= 0.1;
        houseRX -= 5.0;
        houseRX %= 360;
    }

    // console.log(houseState);
    // console.log(houseZ - new_tornadoLoc);
}

// Check if "player" is in the tornado or not
// Very similar to checkHouse state, but too many variables to be passed efficiently
// houseX = -15.0, houseY = 1.0, houseZ = 0.0;
// houseRX = 0.0;
var playerState = "ground";    // Can be "ground", "lift", "float", "fall"
function checkPlayerState() {
    if  (playerState == "ground") {    // Player is grounded
        if ((Math.abs(new_tornadoLoc - eyeX) <= 18) && (Math.abs(new_tornadoLoc - (eyeZ * -1)) <= 18)) {  // player lifts up if tornado gets too close
            playerState = "lift"
        }

    } else if (playerState == "lift") {  // Player is picked up by tornado
        
        atX = new_tornadoLoc;
        atZ = new_tornadoLoc * -1;
        eyeY += 0.2;
        atY += 0.2;
        
        angleFacing = Math.atan((atZ - eyeZ) / (atX - eyeX));
        // radius -= 0.2
        eyeX += 0.2 * Math.cos(angleFacing);
        eyeZ += 0.2 * Math.sin(angleFacing);

        if (eyeY >= 15) playerState = "float";
    } else if (playerState == "float") { // Player is in the air from the tornado
        atX = new_tornadoLoc;
        atZ = new_tornadoLoc * -1;
        eyeX += 0.2 * Math.cos(angleFacing);
        eyeZ += 0.2 * Math.sin(angleFacing);

        if ((Math.abs(eyeZ - new_tornadoLoc) >= 27) || (Math.abs(eyeX - new_tornadoLoc))) {
            playerState = "fall";
        }
    } else if ((playerState == "fall") && (eyeY >= 0.5)) { // Player is falling to the ground
        eyeX += 0.2 * Math.cos(angleFacing);
        eyeZ += 0.2 * Math.sin(angleFacing);
        eyeY -= 0.1;
        atY -= 0.1;
    } else {    // Back to ground - reset to default (it's easier that way)
        playerState = "ground";
        angleFacing = Math.PI / 2;
        atX = eyeX;
        atZ = eyeZ - 1;
    }
}

/*********************** CRUCIAL FUNCTIONS ***********************/
// "Master function to draw everything"
function drawAll(gl, mvpMatrix, u_MvpMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!initLighting(gl)) {
        console.log('Failed to set the lighting.');
        return;
    }
    
    drawEnvironment(gl, mvpMatrix, u_MvpMatrix);
    drawTornado(gl, mvpMatrix, u_MvpMatrix);
    drawSun(gl, mvpMatrix, u_MvpMatrix);
    drawHouse(gl, mvpMatrix, u_MvpMatrix);
}

// Event handler for eye coordnates (screen view)
var angleFacing = Math.PI / 2;
function keydown(event) {
    // Change Eye coors - arrow keys
    switch (event.key) {
        // Typical "w-a-s-d" configuration
        // User moves forward
        case 'w':
            // Boundary check
            if (((atX + 0.2 * Math.cos(angleFacing) <= 100) &&
                 (atX + 0.2 * Math.cos(angleFacing) >= -100)) &&
                ((atZ - 0.2 * Math.cos(angleFacing) <= 100) &&
                 (atZ - 0.2 * Math.cos(angleFacing) >= -100))) {            

                eyeZ -= 0.2 * Math.sin(angleFacing);
                atX += 0.2 * Math.cos(angleFacing);
                atZ -= 0.2 * Math.sin(angleFacing);
                eyeX += 0.2 * Math.cos(angleFacing);
            }
            break;

        // User moves left
        case 'a':
            // Boundary check
            if (((atX + 0.2 * Math.sin(angleFacing + (Math.PI / 2))  <= 100) &&
                 (atX + 0.2 * Math.cos(angleFacing + (Math.PI / 2)) >= -100)) &&
                ((atZ - 0.2 * Math.sin(angleFacing + (Math.PI / 2))  <= 100) &&
                 (atZ - 0.2 * Math.cos(angleFacing + (Math.PI / 2)) >= -100))) {

                eyeZ -= 0.2 * Math.sin(angleFacing + (Math.PI / 2));
                atX += 0.2 * Math.cos(angleFacing + (Math.PI / 2));
                atZ -= 0.2 * Math.sin(angleFacing + (Math.PI / 2));
                eyeX += 0.2 * Math.cos(angleFacing + (Math.PI / 2));
            }
            break;

        // User moves down
        case 's':
            // Boundary check
            if (((atX + 0.2 * Math.sin(angleFacing + Math.PI)  <= 100) &&
                 (atX + 0.2 * Math.cos(angleFacing + Math.PI) >= -100)) &&
                ((atZ - 0.2 * Math.sin(angleFacing + Math.PI)  <= 100) &&
                 (atZ - 0.2 * Math.cos(angleFacing + Math.PI) >= -100))) {

                eyeZ -= 0.2 * Math.sin(angleFacing + Math.PI);
                atX += 0.2 * Math.cos(angleFacing + Math.PI);
                atZ -= 0.2 * Math.sin(angleFacing + Math.PI);
                eyeX += 0.2 * Math.cos(angleFacing + Math.PI);
            }
            break;

        // User moves right
        case 'd':
            // Boundary check
            if (((atX + 0.2 * Math.sin(angleFacing + (3 * Math.PI / 2))  <= 100) &&
                 (atX + 0.2 * Math.cos(angleFacing + (3 * Math.PI / 2)) >= -100)) &&
                ((atZ - 0.2 * Math.sin(angleFacing + (3 * Math.PI / 2))  <= 100) &&
                 (atZ - 0.2 * Math.cos(angleFacing + (3 * Math.PI / 2)) >= -100))) {

                eyeZ -= 0.2 * Math.sin(angleFacing + (3 * Math.PI / 2));
                atX += 0.2 * Math.cos(angleFacing + (3 * Math.PI / 2));
                atZ -= 0.2 * Math.sin(angleFacing + (3 * Math.PI / 2));
                eyeX += 0.2 * Math.cos(angleFacing + (3 * Math.PI / 2));
            }
            break;

        // User view rotates left
        case "ArrowLeft":
            atX -= (Math.PI / 180) * Math.sin(angleFacing);
            atZ -= (Math.PI / 180) * Math.cos(angleFacing);
            angleFacing += Math.PI / 180;
            angleFacing %= (Math.PI * 2) ;
            break;

        // User view rotates right
        case "ArrowRight":
            atX += (Math.PI / 180) * Math.sin(angleFacing);
            atZ += (Math.PI / 180) * Math.cos(angleFacing);
            angleFacing -= Math.PI / 180;
            angleFacing %= (Math.PI * 2);
            break;

        // User view rotates up
        case "ArrowUp":
            atY += (Math.PI / 180);
            break;

        // User view rotates down
        case "ArrowDown":
            atY -= (Math.PI / 180);
            break;

        default: return false;  // Prevent unnecessary redrawing
    }

    return true;
}

/*************** Shape globals ***************/
var square = setSquare();
var squareNormals = setSquareNormals();
var triangle = setTriangle();
var texture = setTexture();

var cubeVertices = setCube();
var cubeIndices = setCubeIndices();
var cubeColor = setCubeColor();
var cubeNormals = setCubeNormals();

var coneVertices = setCone();
var coneIndices = setConeIndices();

var sphereVertices = setSphere();
var sphereIndices = setSphereIndices();
/*****************************************/
/*************************************************************/

/*************************************************************/
/*************************************************************/
/*********************** MAIN FUNCTION ***********************/
/*************************************************************/
/*************************************************************/

function main() {
    // Retrieve <canvas> element from HTML file (argument)
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // getWebGLContext(element, [debug]) - Supports drawing features
    // Defined in "cuon-utils.js"
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    
    // Initialize and set up shaders (check)
    // initShaders(renderContext, vshader: string, fshader: string)
    // Defined in "cuon-util.js"
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders');
        return;
    }

    // uVar_Shader - uniform variable from v- or f- Shader
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {   // Check initialization of mvpMatrix
        console.log('Failed to get the storage location of u_xformMatrix');
        return;
    }
    
    // Instantiate a new matrix that can be transformed with translation, rotation, and scaling
    var mvpMatrix = initMvpMatrix(gl, u_MvpMatrix);

    // Setting up textures
    var initImg0 = initTexture(gl, './field.jpg', texUnit = 0);
    var initImg1 = initTexture(gl, './skyCloud.jpg', texUnit = 1);
    
    var initImg3 = initTexture(gl, './roof.jpg', texUnit = 3);
    var initImg4 = initTexture(gl, './door.jpg', texUnit = 4);
    var initImg5 = initTexture(gl, './window.jpg', texUnit = 5);
    var initImg2 = initTexture(gl, './tornado.jpg', texUnit = 2);
    if (!(initImg0 && initImg1 && initImg2 && initImg3 && initImg4 && initImg5 )) {   // check initialization of image
        console.log('Failed to set the textures.');
        return;
    }
    
    // clearColor(r, g, b, a (transparency))
    gl.clearColor(r = 0.9, g = 0.75, b = 0.5, a = 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    var tick = function() {
        checkHouseState();
        drawAll(gl, mvpMatrix, u_MvpMatrix);
        checkPlayerState();

        requestAnimationFrame(tick, canvas); // Request that the browser calls tick
        document.onkeydown = function(event) {
            keydown(event);
        };
    }
    tick();

}