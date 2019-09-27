
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
`

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('failed initShaders');
        return;
    }

    var n = initViewBuffers8(gl);
    // var n = initVertexBuffersss(gl);
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormlMatrix = gl.getUniformLocation(gl.program, 'u_NormlMatrix');

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    document.onkeydown = function(ev) {
        keydown8(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1,0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);

}

var ANGLE_STEP = 3.0; // 每次按键转动的角度
var g_arm1Angle = 90.0; // arm1当前角铳
var g_joint1Angle = 45.0; // joint1的当前角度
var g_joint2Angle = 0.0; // joint2
var g_joint3Angle = 0.0; // 

function keydown8(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix) {
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
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);
}

function initViewBuffers8(gl) {
    var v0 = [1.5, 10, 1.5], v1 = [-1.5, 10, 1.5], v2 = [-1.5, 0, 1.5], v3 = [1.5, 0, 1.5];
    var v4 = [1.5, 10, -1.5], v5 = [-1.5, 10, -1.5], v6 = [1.5, 0, -1.5], v7 = [-1.5, 0, -1.5];
    var v0 = [1.0, 1.0, 1.0], v1 = [-1.0, 1.0, 1.0], v2 = [-1.0, 0, 1.0], v3 = [1.0, 0, 1.0];
    var v4 = [1.0, 1.0, -1.0], v5 = [-1.0, 1.0, -1.0], v6 = [1.0, 0, -1.0], v7 = [-1.0, 0, -1.0];
    var vertex = new Float32Array([
        ...v0, ...v1, ...v2, ...v3,
        ...v4, ...v5, ...v7, ...v6,
        ...v1, ...v2, ...v7, ...v5,
        ...v0, ...v3, ...v6, ...v4,
        ...v0, ...v1, ...v4, ...v5,
        ...v0, ...v2, ...v6, ...v7,
    ]);
    
    var index = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        4, 5, 6, 4, 6, 7,// 后
        8, 9, 10, 8, 10, 11, // 左
        12, 13, 14, 12, 14, 15, //右
        16, 17, 18, 16, 18, 19, // 上
        20, 21, 22, 20, 22, 23, // 下

    ]);

    var indexs = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
     ]);

    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
      ]);

    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
       -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
       -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
      ]);
    console.log(vertex, vertices);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6,   0);
    gl.enableVertexAttribArray(a_Position);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);


    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index,  gl.STATIC_DRAW);
    // gl.vertexAttribPointer()
    return index.length;
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix) {
    // arm1
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 基座
    var baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);

    var arm1Length = 10.0; // arm1的长度
    g_modelMatrix.translate(0.0, baseHeight, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // 绕y旋转
    // drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);

    // arm2
    var arm2Length = 10.0; //
    g_modelMatrix.translate(0.0, arm1Length, 0.0); // 移到joint1处
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0); 
    g_modelMatrix.scale(1.3, 1.0, 1.3); // 放大立方体
    // drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);
    drawBox(gl, n, 3.0, arm2Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);

    // apalm
    var palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0);
    drawBox(gl, n, 2.0, palmLength, 4.0, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);

    // 移到palm一端的中点
    g_modelMatrix.translate(0.0, palmLength, 0.0);

    // finger1
    pushMatrix(g_modelMatrix);
        g_modelMatrix.translate(0.0, 0.0, 2.0);
        g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0); //
        drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);
    g_modelMatrix = popMatrix();

    // finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormlMatrix);

}

var g_matrixStack = []; // 存储矩阵的栈
function pushMatrix(m) {
    var m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}
function popMatrix() {
    return g_matrixStack.pop();
}

var g_normalMatrix = new Matrix4(); // 法线的旋转矩阵
function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormlMatrix) {
    // 计算模型视图矩阵并传给u_MvpMatrix变量
    // g_mvpMatrix.scale(width, height, depth);
    pushMatrix(g_modelMatrix);
    // console.log(width, height, depth, g_modelMatrix.elements);
    g_modelMatrix.scale(width, height, depth);
    // tg.scale(3.0, 3.0, 3.0);
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // 
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormlMatrix, false, g_normalMatrix.elements);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
    g_modelMatrix = popMatrix();
}

