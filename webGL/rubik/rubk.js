var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    uniform mat4 u_VpMatrix;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_MaxRotateMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_VpMatrix * u_MaxRotateMatrix * u_MvpMatrix * a_Position;
        // gl_Position = u_MaxRotateMatrix * u_MvpMatrix * a_Position;
        // gl_Position = a_Position;
        // gl_PointSize = 1.0;

        vec3 lightDirection = vec3(0.0, 0.0, 1.0);
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        float nDotL = max(dot(normal, lightDirection), 0.0);
        // v_Color = vec4(vec3(a_Color * nDotL), a_Color.a);
        v_Color = a_Color;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        gl_FragColor = v_Color;
    }
`;



function main() {
    var canvas = document.getElementById('webgl');

    var gl = canvas.getContext('webgl');
    if (!gl) {console.log('failed init gl'); return;}

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);


    var n = initVertexBuffers(gl);

    viewProjMatrix = new Matrix4()
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1, 200);
    // viewProjMatrix.lookAt(0, 7, 30, 0, 0, 0, 0, 1, 0);
    viewProjMatrix.lookAt(4, 20, 50, 0, 0, 0, 0, 1, 0);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_MaxRotateMatrix = gl.getUniformLocation(gl.program, 'u_MaxRotateMatrix');
    var u_VpMatrix = gl.getUniformLocation(gl.program, 'u_VpMatrix');

    gl.uniformMatrix4fv(u_VpMatrix, false, viewProjMatrix.elements);

    gl.clearColor(0, 0, 0, 1);
    // gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);

    var mouseSet = false;
    var lastX, lastY;
    canvas.onmouseup = function() {
        mouseSet = false; 
    }

    canvas.onmousedown = function(ev) {
        mouseSet = true;
        lastX = ev.clientX;
        lastY = ev.clientY;
    }

    canvas.onmousemove = function(ev) {
        var xs = 0.01; // 移动系数
        if (mouseSet) {
            currentAngle[0] = (currentAngle[0] + (ev.clientY - lastY) * xs) % 360;
            currentAngle[1] = (currentAngle[1] + (ev.clientX - lastX) * xs) % 360;
        }
    }

    var currentAngle = [0, 0];

    var tick = function() {
        draw(gl, n, u_MvpMatrix, u_NormalMatrix,u_MaxRotateMatrix, currentAngle);
        requestAnimationFrame(tick, canvas);
    }
    tick();
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var g_RotateMatrix4 = new Matrix4();
function draw(gl, n,u_MvpMatrix, u_NormalMatrix, u_MaxRotateMatrix, currentAngle) {
    var num = 27;
    var p = 0.2;
    // console.log(n, '???')
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

        // g_mvpMatrix.set(viewProjMatrix);
        // gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

        // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    for (let i = 0; i < 27; i++) {
        // console.log(i);
        var x = (i % 3) * 2, y = Math.floor(i / 9) * 2, z = (Math.floor(i / 3) % 3) * 2;
        // console.log(x, y, z);
        var x1 = x + (p * x), y1 = y + p * y, z1 = z + p * z;
        // console.log(x, y, z, x1, y1, z1);
        g_modelMatrix.setTranslate(x1, y1, z1);
        // g_modelMatrix.setTranslate(i * 2.2, y1, z1);
        g_modelMatrix.translate(-3, -3, -3);

        // g_mvpMatrix.set(viewProjMatrix);
        g_mvpMatrix.set(g_modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

        g_normalMatrix.setInverseOf(g_modelMatrix); // setInverseOf
        g_normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
        // console.log(i);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }

        g_RotateMatrix4.setRotate(currentAngle[0], 1, 0, 0);
        g_RotateMatrix4.rotate(currentAngle[1], 0, 1, 0);
        gl.uniformMatrix4fv(u_MaxRotateMatrix, false, g_RotateMatrix4.elements);

    // console.log('------------------')
}

function initVertexBuffers(gl) {

    // Create a cube
  //    v5----- v4
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v6---|-|v7
  //  |/      |/
  //  v2------v3

    var oneVertix = [ 
        [1.0, 1.0, 1.0], [-1.0, 1.0, 1.0], [-1.0, -1.0, 1.0], [1.0, -1.0, 1.0],
        [1.0, 1.0, -1.0], [-1.0, 1.0, -1.0], [-1.0, -1.0, -1.0], [1.0, -1.0, -1.0],
    ]
    var vertices = new Float32Array([ //
    ...oneVertix[0],  ...oneVertix[1],  ...oneVertix[2],  ...oneVertix[3], // 1
    ...oneVertix[4],  ...oneVertix[5],  ...oneVertix[6],  ...oneVertix[7],
    ...oneVertix[0],  ...oneVertix[1],  ...oneVertix[5],  ...oneVertix[4],
    ...oneVertix[3],  ...oneVertix[2],  ...oneVertix[6],  ...oneVertix[7],
    ...oneVertix[1],  ...oneVertix[2],  ...oneVertix[6],  ...oneVertix[5],
    ...oneVertix[0],  ...oneVertix[3],  ...oneVertix[7],  ...oneVertix[4],


    ]);

    var color = [
        [40 / 255 , 0, 202 / 255], [246 / 255, 119 / 255, 29 / 255],
        [248 / 255, 253 / 255, 45 / 255], [25 / 255,153 / 255,19 / 255],
        [206 / 255, 0, 18 / 255], [1, 1, 1]
    ];
    var colors = new Float32Array([
        ...color[0], ...color[0], ...color[0], ...color[0],
        ...color[3], ...color[3], ...color[3], ...color[3],
        ...color[1], ...color[1], ...color[1], ...color[1],
        ...color[5], ...color[5], ...color[5], ...color[5],
        ...color[2], ...color[2], ...color[2], ...color[2],
        ...color[4], ...color[4], ...color[4], ...color[4],
    ]);

    var index = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
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

    setVertBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
    setVertBuffer(gl, 'a_Color', colors, 3, gl.FLOAT);
    setVertBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

    return index.length;
    

}

function setVertBuffer(gl, a_Name, data, num, type) {
    var buffer = gl.createBuffer();

    console.log(gl.program, a_Name);
    var a_attribute =  gl.getAttribLocation(gl.program, a_Name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return buffer;

}