var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormlMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7)); // 光线方向
    vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
    vec3 normal = normalize((u_NormlMatrix * a_Normal).xyz);
    float nDotL = max(dot(normal, lightDirection), 0.0);
    v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);
}

`;
var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec4 v_Color;
    void main() {
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('failed initShaders');
        return;
    } 

    var n = initVertexBuffers8_2(gl);
    // var n = initVertexBuffers(gl);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormlMatrix = gl.getUniformLocation(gl.program, 'u_NormlMatrix');

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 10, 100.0);
    viewProjMatrix.lookAt(20, 10, 30, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    document.onkeydown = function(ev) {
        keydown8_2(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1,0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix);

}

var ANGLE_STEP = 3.0;     // The increments of rotation angle (degrees)
var g_arm1Angle = 90.0;   // The rotation angle of arm1 (degrees)
var g_joint1Angle = 45.0; // The rotation angle of joint1 (degrees)
var g_joint2Angle = 0.0;  // The rotation angle of joint2 (degrees)
var g_joint3Angle = 0.0;  // The rotation angle of joint3 (degrees)

function keydown8_2(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix) {
    // console.log(ev.keyCode);
    switch (ev.keyCode) {
        case 38: // 上
            if (g_joint1Angle < 135.0) {g_joint1Angle += ANGLE_STEP; }
            break;
        case 40: // 下
            if (g_joint1Angle > -135.0) { g_joint1Angle -= ANGLE_STEP;}
            break;
        case 37: //左
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case 39: //
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case 90: // z键 joint2正方向
            g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
            break;
        case 88: // x键 joint2负方向
            g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
            break;
        case 86: // v键 joint3正方向
            if (g_joint3Angle < 60) { g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;}
            break;
        case 67: // c键 joint3负方向
            if (g_joint3Angle > -60) {g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;}
            break;
        default: return;
    }
    // 
    // draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);
    draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix);
}

var g_baseBuffer = null; // base缓冲区对象
var g_arm1Buffer = null;
var g_arm2Buffer = null;
var g_palmBuffer = null;
var g_fingerBuffer = null;

function initVertexBuffers8_2(gl) {
    // 前0123 后 4567 逆时针
    var baseArr = [ 
            [5.0, 2.0, 5.0], [-5.0, 2.0, 5.0], [-5.0, 0.0, 5.0], [5.0, 0.0, 5.0],
            [5.0, 2.0, -5.0], [-5.0, 2.0, -5.0], [-5.0, 0.0, -5.0], [5.0, 0.0, -5.0],
        ]
    var vertiecs_base = new Float32Array([ // base(10x2x10)
        ...baseArr[0],  ...baseArr[1],  ...baseArr[2],  ...baseArr[3],
        ...baseArr[4],  ...baseArr[5],  ...baseArr[6],  ...baseArr[7],
        ...baseArr[0],  ...baseArr[1],  ...baseArr[5],  ...baseArr[4],
        ...baseArr[3],  ...baseArr[2],  ...baseArr[6],  ...baseArr[7],
        ...baseArr[1],  ...baseArr[2],  ...baseArr[6],  ...baseArr[5],
        ...baseArr[0],  ...baseArr[3],  ...baseArr[7],  ...baseArr[4],
    ]);
    var index = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        4, 5, 6, 4, 6, 7, // 右
        8, 9, 10, 8, 10, 11, // 上
        12, 13, 14, 12, 14, 15, // 左
        16, 17, 18, 16, 18,19, // 下
        20, 21, 22, 20, 22, 23, // 后
    ]);

    var arm1Arr = [
        [1.5, 10.0, 1.5], [-1.5, 10.0, 1.5], [-1.5, 0.0, 1.5], [1.5, 0.0, 1.5],
        [1.5, 10.0, -1.5], [-1.5, 10.0, -1.5], [-1.5, 0.0, -1.5], [1.5, 0.0, -1.5],
    ]
    var vertices_arm1 = new Float32Array([ // Arm1(3x10x3)
        ...arm1Arr[0],  ...arm1Arr[1],  ...arm1Arr[2],  ...arm1Arr[3],
        ...arm1Arr[4],  ...arm1Arr[5],  ...arm1Arr[6],  ...arm1Arr[7],
        ...arm1Arr[0],  ...arm1Arr[1],  ...arm1Arr[5],  ...arm1Arr[4],
        ...arm1Arr[3],  ...arm1Arr[2],  ...arm1Arr[6],  ...arm1Arr[7],
        ...arm1Arr[1],  ...arm1Arr[2],  ...arm1Arr[6],  ...arm1Arr[5],
        ...arm1Arr[0],  ...arm1Arr[3],  ...arm1Arr[7],  ...arm1Arr[4],
    ]);

    var arm2Arr = [
        [2, 10.0, 2], [-2, 10.0, 2], [-2, 0.0, 2], [2, 0.0, 2],
        [2, 10.0, -2], [-2, 10.0, -2], [-2, 0.0, -2], [2, 0.0, -2],
    ]
    var vertices_arm2 = new Float32Array([ // Arm2(4x10x4)
        ...arm2Arr[0],  ...arm2Arr[1],  ...arm2Arr[2],  ...arm2Arr[3],
        ...arm2Arr[4],  ...arm2Arr[5],  ...arm2Arr[6],  ...arm2Arr[7],
        ...arm2Arr[0],  ...arm2Arr[1],  ...arm2Arr[5],  ...arm2Arr[4],
        ...arm2Arr[3],  ...arm2Arr[2],  ...arm2Arr[6],  ...arm2Arr[7],
        ...arm2Arr[1],  ...arm2Arr[2],  ...arm2Arr[6],  ...arm2Arr[5],
        ...arm2Arr[0],  ...arm2Arr[3],  ...arm2Arr[7],  ...arm2Arr[4],
    ]);

    var fingerArr = [
        [0.5, 2.0, 0.5], [-0.5, 2.0, 0.5], [-0.5, 0.0, 0.5], [0.5, 0.0, 0.5],
        [0.5, 2.0, -0.5], [-0.5, 2.0, -0.5], [-0.5, 0.0, -0.5], [0.5, 0.0, -0.5],
    ]
    var vertiecs_finger = new Float32Array([ // Finger(1x2x1)
        ...fingerArr[0],  ...fingerArr[1],  ...fingerArr[2],  ...fingerArr[3],
        ...fingerArr[4],  ...fingerArr[5],  ...fingerArr[6],  ...fingerArr[7],
        ...fingerArr[0],  ...fingerArr[1],  ...fingerArr[5],  ...fingerArr[4],
        ...fingerArr[3],  ...fingerArr[2],  ...fingerArr[6],  ...fingerArr[7],
        ...fingerArr[1],  ...fingerArr[2],  ...fingerArr[6],  ...fingerArr[5],
        ...fingerArr[0],  ...fingerArr[3],  ...fingerArr[7],  ...fingerArr[4],
    ]);

    var palmArr = [
        [1.0, 2.0, 3.0], [-1.0, 2.0, 3.0], [-1.0, 0.0, 3.0], [1.0, 0.0, 3.0],
        [1.0, 2.0, -3.0], [-1.0, 2.0, -3.0], [-1.0, 0.0, -3.0], [1.0, 0.0, -3.0],
    ]
    var vertiecs_palm = new Float32Array([ // palm(2x2x6)
        ...palmArr[0],  ...palmArr[1],  ...palmArr[2],  ...palmArr[3],
        ...palmArr[4],  ...palmArr[5],  ...palmArr[6],  ...palmArr[7],
        ...palmArr[0],  ...palmArr[1],  ...palmArr[5],  ...palmArr[4],
        ...palmArr[3],  ...palmArr[2],  ...palmArr[6],  ...palmArr[7],
        ...palmArr[1],  ...palmArr[2],  ...palmArr[6],  ...palmArr[5],
        ...palmArr[0],  ...palmArr[3],  ...palmArr[7],  ...palmArr[4],
    ]);

    var normalArr = [
        [0.0, 0.0, 1.0], [0.0, 0.0, -1.0], [0.0, 1.0, 0.0],
         [0.0, -1.0, 0.0], [-1.0, 0.0, 0.0], [1.0, 0.0, 0.0], 
    ]
    var normals = new Float32Array([
        ...normalArr[0], ...normalArr[0], ...normalArr[0], ...normalArr[0],
        ...normalArr[1], ...normalArr[1], ...normalArr[1], ...normalArr[1],
        ...normalArr[2], ...normalArr[2], ...normalArr[2], ...normalArr[2],
        ...normalArr[3], ...normalArr[3], ...normalArr[3], ...normalArr[3],
        ...normalArr[4], ...normalArr[4], ...normalArr[4], ...normalArr[4],
        ...normalArr[5], ...normalArr[5], ...normalArr[5], ...normalArr[5],
    ]);

    // var normals = new Float32Array([
    //     0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    //     1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    //     0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    //    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    //     0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    //     0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    //  ]);

    // 将坐标值写入缓冲区对象，但不分配给attrubute变量
    g_baseBuffer = initArrayBufferForLateUse(gl, vertiecs_base, 3, gl.FLOAT);
    g_fingerBuffer = initArrayBufferForLateUse(gl, vertiecs_finger, 3, gl.FLOAT);
    g_palmBuffer = initArrayBufferForLateUse(gl, vertiecs_palm, 3, gl.FLOAT);
    g_arm1Buffer = initArrayBufferForLateUse(gl, vertices_arm1, 3, gl.FLOAT);
    g_arm2Buffer = initArrayBufferForLateUse(gl, vertices_arm2, 3, gl.FLOAT);
    if (!g_baseBuffer || !g_arm1Buffer || !g_arm2Buffer || !g_palmBuffer || !g_fingerBuffer) return -1;

    // 将法线坐标写入缓冲区，并分配 a_Normal
    if(!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT));

    // 将顶点坐标写入缓冲区
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
    
    return index.length;
}

function initArrayBuffer(gl, name, data, num, type) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var attribute = gl.getAttribLocation(gl.program, name);
    gl.vertexAttribPointer(attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
    return true;
}
function initArrayBufferForLateUse(gl, data, num, type) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('failed buffer');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.num = num;
    buffer.type = type;
    return buffer;
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
function draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var arg = [viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix];

    var baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix);
    // console.log(g_baseBuffer, arg);

    var arm1Height = 10.0;
    g_modelMatrix.translate(0.0, baseHeight, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormlMatrix);

    var arm2Height = 10.0;
    g_modelMatrix.translate(0.0, arm1Height, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    drawSegment(gl, n, g_arm2Buffer, ...arg);

    var palmHeight = 2.0;
    g_modelMatrix.translate(0.0, arm2Height, 0.0);
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 0.0, 1.0);
    drawSegment(gl, n, g_palmBuffer, ...arg);

    g_modelMatrix.translate(0.0, palmHeight, 0.0);

    // finger
    pushMatrix(g_modelMatrix);
        g_modelMatrix.translate(0.0, 0.0, 2.0);
        g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);
        drawSegment(gl, n, g_fingerBuffer, ...arg);
    g_modelMatrix = popMatrix();

    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(g_joint3Angle, 0.0, 0.0, 1.0);
    drawSegment(gl, n, g_fingerBuffer, ...arg);
}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

var g_normalMatrix = new Matrix4();
function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // console.log(buffer.num, buffer.type);
    gl.vertexAttribPointer(a_Position, buffer.num, buffer.type, false, 0, 0)
    gl.enableVertexAttribArray(a_Position);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}



// function initVertexBuffers(gl){
//     // Vertex coordinate (prepare coordinates of cuboids for all segments)
//     var vertices_base = new Float32Array([ // Base(10x2x10)
//        5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0,  5.0, 0.0, 5.0, // v0-v1-v2-v3 front
//        5.0, 2.0, 5.0,  5.0, 0.0, 5.0,  5.0, 0.0,-5.0,  5.0, 2.0,-5.0, // v0-v3-v4-v5 right
//        5.0, 2.0, 5.0,  5.0, 2.0,-5.0, -5.0, 2.0,-5.0, -5.0, 2.0, 5.0, // v0-v5-v6-v1 up
//       -5.0, 2.0, 5.0, -5.0, 2.0,-5.0, -5.0, 0.0,-5.0, -5.0, 0.0, 5.0, // v1-v6-v7-v2 left
//       -5.0, 0.0,-5.0,  5.0, 0.0,-5.0,  5.0, 0.0, 5.0, -5.0, 0.0, 5.0, // v7-v4-v3-v2 down
//        5.0, 0.0,-5.0, -5.0, 0.0,-5.0, -5.0, 2.0,-5.0,  5.0, 2.0,-5.0  // v4-v7-v6-v5 back
//     ]);
  
//     var vertices_arm1 = new Float32Array([  // Arm1(3x10x3)
//        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
//        1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
//        1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
//       -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
//       -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
//        1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
//     ]);
  
//     var vertices_arm2 = new Float32Array([  // Arm2(4x10x4)
//        2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0,  0.0, 2.0,  2.0,  0.0, 2.0, // v0-v1-v2-v3 front
//        2.0, 10.0, 2.0,  2.0,  0.0, 2.0,  2.0,  0.0,-2.0,  2.0, 10.0,-2.0, // v0-v3-v4-v5 right
//        2.0, 10.0, 2.0,  2.0, 10.0,-2.0, -2.0, 10.0,-2.0, -2.0, 10.0, 2.0, // v0-v5-v6-v1 up
//       -2.0, 10.0, 2.0, -2.0, 10.0,-2.0, -2.0,  0.0,-2.0, -2.0,  0.0, 2.0, // v1-v6-v7-v2 left
//       -2.0,  0.0,-2.0,  2.0,  0.0,-2.0,  2.0,  0.0, 2.0, -2.0,  0.0, 2.0, // v7-v4-v3-v2 down
//        2.0,  0.0,-2.0, -2.0,  0.0,-2.0, -2.0, 10.0,-2.0,  2.0, 10.0,-2.0  // v4-v7-v6-v5 back
//     ]);
  
//     var vertices_palm = new Float32Array([  // Palm(2x2x6)
//        1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0,  1.0, 0.0, 3.0, // v0-v1-v2-v3 front
//        1.0, 2.0, 3.0,  1.0, 0.0, 3.0,  1.0, 0.0,-3.0,  1.0, 2.0,-3.0, // v0-v3-v4-v5 right
//        1.0, 2.0, 3.0,  1.0, 2.0,-3.0, -1.0, 2.0,-3.0, -1.0, 2.0, 3.0, // v0-v5-v6-v1 up
//       -1.0, 2.0, 3.0, -1.0, 2.0,-3.0, -1.0, 0.0,-3.0, -1.0, 0.0, 3.0, // v1-v6-v7-v2 left
//       -1.0, 0.0,-3.0,  1.0, 0.0,-3.0,  1.0, 0.0, 3.0, -1.0, 0.0, 3.0, // v7-v4-v3-v2 down
//        1.0, 0.0,-3.0, -1.0, 0.0,-3.0, -1.0, 2.0,-3.0,  1.0, 2.0,-3.0  // v4-v7-v6-v5 back
//     ]);
  
//     var vertices_finger = new Float32Array([  // Fingers(1x2x1)
//        0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
//        0.5, 2.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 2.0,-0.5, // v0-v3-v4-v5 right
//        0.5, 2.0, 0.5,  0.5, 2.0,-0.5, -0.5, 2.0,-0.5, -0.5, 2.0, 0.5, // v0-v5-v6-v1 up
//       -0.5, 2.0, 0.5, -0.5, 2.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
//       -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
//        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 2.0,-0.5,  0.5, 2.0,-0.5  // v4-v7-v6-v5 back
//     ]);
  
//     // Normal
//     var normals = new Float32Array([
//        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
//        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
//        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
//       -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
//        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
//        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
//     ]);
  
//     // Indices of the vertices
//     var indices = new Uint8Array([
//        0, 1, 2,   0, 2, 3,    // front
//        4, 5, 6,   4, 6, 7,    // right
//        8, 9,10,   8,10,11,    // up
//       12,13,14,  12,14,15,    // left
//       16,17,18,  16,18,19,    // down
//       20,21,22,  20,22,23     // back
//     ]);
  
//     // Write coords to buffers, but don't assign to attribute variables
//     g_baseBuffer = initArrayBufferForLaterUse(gl, vertices_base, 3, gl.FLOAT);
//     g_arm1Buffer = initArrayBufferForLaterUse(gl, vertices_arm1, 3, gl.FLOAT);
//     g_arm2Buffer = initArrayBufferForLaterUse(gl, vertices_arm2, 3, gl.FLOAT);
//     g_palmBuffer = initArrayBufferForLaterUse(gl, vertices_palm, 3, gl.FLOAT);
//     g_fingerBuffer = initArrayBufferForLaterUse(gl, vertices_finger, 3, gl.FLOAT);
//     if (!g_baseBuffer || !g_arm1Buffer || !g_arm2Buffer || !g_palmBuffer || !g_fingerBuffer) return -1;
  
//     // Write normals to a buffer, assign it to a_Normal and enable it
//     if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;
  
//     // Write the indices to the buffer object
//     var indexBuffer = gl.createBuffer();
//     if (!indexBuffer) {
//       console.log('Failed to create the buffer object');
//       return -1;
//     }
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
//     return indices.length;
//   }

//   function initArrayBufferForLaterUse(gl, data, num, type){
//     var buffer = gl.createBuffer();   // Create a buffer object
//     if (!buffer) {
//       console.log('Failed to create the buffer object');
//       return null;
//     }
//     // Write date into the buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
//     // Store the necessary information to assign the object to the attribute variable later
//     buffer.num = num;
//     buffer.type = type;
  
//     return buffer;
//   }
  
//   function initArrayBuffer(gl, attribute, data, num, type){
//     var buffer = gl.createBuffer();   // Create a buffer object
//     if (!buffer) {
//       console.log('Failed to create the buffer object');
//       return false;
//     }
//     // Write date into the buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
//     // Assign the buffer object to the attribute variable
//     var a_attribute = gl.getAttribLocation(gl.program, attribute);
//     if (a_attribute < 0) {
//       console.log('Failed to get the storage location of ' + attribute);
//       return false;
//     }
//     gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
//     // Enable the assignment of the buffer object to the attribute variable
//     gl.enableVertexAttribArray(a_attribute);
  
//     return true;
//   }