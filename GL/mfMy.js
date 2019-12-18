var π = Math.PI, sin = Math.sin, cos = Math.cos, acos = Math.acos, pow = Math.pow, abs = Math.abs;
var round = Math.round, random = Math.random;
var updateMvpMatrix = function() {
    // this.data.mvpMatrix = new Matrix(this.data.)
}
var rotateF = {}
function rotateMF(direction, zIndex) {
    // 旋转90度
    var angle = 0; AngleMax = 90;
    var requestId;
    
    function setCurrentAngle() {
        angle = animate(angle);
        if (angle < AngleMax) {
            requestAnimationFrame(setCurrentAngle);
            // cancelAnimationFrame(requestId);
        } else {
            setMFarr(direction, zIndex);
            rotateF = {};
        }
        rotateF = {
            direction,
            zIndex,
            currentAngle: angle,
        }
        
    }
    setCurrentAngle();
    
}
function setMFarr(direction, zIndex) {
    let ta1 = LevelMF[zIndex];
    switch(direction) {
        case 'y': LevelMF[zIndex] = setXArr(ta1);break;
        default: break;
    }
    MFArr = flattenMd(LevelMF);
    console.log(MFArr, LevelMF);
}
function setXArr(arr) {
    let ta = [[],[],[]];

    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].length; j++) {
            ta[j][i] = arr[i][j];
        }
    }
    // arr = ta;
    let ta2 = [[], [], []];
    let temp = ta[0].slice(0);
    ta2[0] = ta[2]; ta2[1] = ta[1]; ta2[2] = temp;
    // for(let i = 0; i < arr.length; i++) {
    //     for(let j = 0; j < arr[i].length; j++) {
    //         ta2[j][i] = arr[i][j];
    //     }
    // }
    
    arr = ta2;
    console.log(ta, ta2, arr);
    return ta2;
}

function flattenMd(arr){
    var result=[]
    function flatten(arr){
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                flatten(arr[i]);
            }else{
                result.push(arr[i]);
            }        
        }
    }
    flatten(arr);
    return result;
}

var CUBE_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    uniform vec3 u_lightDirection;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
    void main() {
        // vec3 lightDirection = vec3(0.0, 0.0, 1.0);
        vec3 lightDirection = u_lightDirection;
        vec4 lColor = vec4(0.0, 1.0, 1.0, 1.0);
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        float nDotL = max(dot(normal, lightDirection), 0.0);
        v_Color = vec4(a_Color.rgb * nDotL, a_Color.a);
    }
`;
var CUBE_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;


function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {console.log('failed gl'); return}

    var cubeProgram = createProgram(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE);

    if (!cubeProgram) {console.log('failed cubeProgram'); return;};
    cubeProgram.a_Position = gl.getAttribLocation(cubeProgram, 'a_Position');
    cubeProgram.a_Normal = gl.getAttribLocation(cubeProgram, 'a_Normal');
    cubeProgram.a_Color = gl.getAttribLocation(cubeProgram, 'a_Color');
    cubeProgram.u_MvpMatrix = gl.getUniformLocation(cubeProgram, 'u_MvpMatrix');
    cubeProgram.u_NormalMatrix = gl.getUniformLocation(cubeProgram, 'u_NormalMatrix');
    cubeProgram.u_lightDirection = gl.getUniformLocation(cubeProgram, 'u_lightDirection');

    if (cubeProgram.a_Position < 0 || cubeProgram.a_Color < 0 || cubeProgram.a_Normal < 0 ||
        cubeProgram.u_MvpMatrix < 0 || cubeProgram.u_NormalMatrix < 0) {
            console.log('failed loaction'); return;
        }
    
    

    var cube = setCube(gl);

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100); // Perspective 透视图
    viewProjMatrix.lookAt(0, 20, 20, 0, 0, 0, 0, 1, 0); // 视点 ，注视点， 上方向
    console.log(cubeProgram.u_lightDirection);
    var lightDirection = new Vector3([0, 0, 1]);
    // lightDirection.normalize(); // 归一化
    console.log(lightDirection.elements);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    var currentAngle = 30;
    var tick = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        currentAngle = animate(currentAngle);
        setDraw(gl, cubeProgram, cube, viewProjMatrix, currentAngle, rotateF || {});
        requestAnimationFrame(tick, canvas);
        // tick();
    };
    tick();
    
}

var g_mvpMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var MFArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17,18,19,20,21,22,23,24,25,26];
var LevelMF = [
    [[0, 1, 2], [3, 4, 5], [6, 7, 8]],
    [[9, 10, 11], [12, 13, 14], [15, 16, 17]],
    [[18, 19, 20], [21, 22, 23], 24]
]
function setDraw(gl, program, cube, viewProjMatrix, currentAngle, rotateF) { //  用小方块组成大方块
    var p = 0.2;
    
    for(let i = 0; i < 27; i++) {
        var x = (i % 3) * 2, y = Math.floor(i / 9) * 2, z = (Math.floor(i / 3) % 3) * 2;
        // var x1 = x + (p * x), y1 = y + p * y, z1 = z + p * z;
        var x1 = x, y1 = y, z1 = z;
        // console.log(i, x, y, z);
        g_modelMatrix.setTranslate(x1, y1, z1);
        g_modelMatrix.translate(-3, -3, -3);
        drawCube(gl, program, cube, viewProjMatrix, currentAngle, MFArr[i], rotateF);
    }
}
var oldcurrentAngle = 0;
function drawCube(gl, program, cube, viewProjMatrix, currentAngle, index, rotateF) {
    gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, cube.vertexBuffer);
    initAttributeVariable(gl, program.a_Color, cube.colorBuffer);
    initAttributeVariable(gl, program.a_Normal, cube.normalBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);


    if (rotateF.direction) {
        // console.log(rotateF);
        switch(rotateF.direction) {
            case 'x':
                setXRotate(rotateF.zIndex - 0, rotateF.currentAngle, index);
            break;
            case 'y':
                setYRotate(rotateF.zIndex - 0, rotateF.currentAngle, index);
            break;
            case 'z':
                setZRotate(rotateF.zIndex - 0, rotateF.currentAngle, index);
            break;
                default: break;
        }
    }
    
    
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
    gl.uniform3fv(program.u_lightDirection, new Float32Array([0, 1, 1]));

    gl.drawElements(gl.TRIANGLES, cube.numIndex, cube.indexBuffer.type, 0);
}

function setZRotate(zI, currentAngle, index) { // 饶Z轴转动
    rotateArr = [[0, 1, 2, 9, 10, 11, 18, 19, 20],
     [3, 4, 5, 12, 13, 14, 21, 22, 23], [6, 7, 8, 15, 16, 17, 24, 25, 26]];
    oldcurrentAngle = currentAngle;
    let aindex = index;
    let r = 2 * Math.sqrt(2);
    let arr = [1, 9, 11, 19, 4, 12, 14, 22, 7, 15, 17, 25];
    if (arr.indexOf(aindex) > -1) {r = 2};
    if (aindex == 10 || aindex == 13 || aindex == 16) {r = 0};
    let initAng = 0;
    let snum = index;
    if (zI !== 3) {
        snum = rotateArr[zI].indexOf(index);
    } else {
        snum = [...rotateArr[0], ...rotateArr[1], ...rotateArr[2]].indexOf(index) % 9;
    }
    switch(snum) {

        case 0:initAng = -135;break; // 一
        case 1:initAng = -90;break;
        case 2:initAng = -45;break;
        case 3:initAng = 180;break;
        case 4:initAng = 0;break;
        case 5:initAng = 0;break;
        case 6:initAng = 135;break;
        case 7:initAng = 90;break;
        case 8:initAng = 45;break;

        default : break;
    }
    let oldx = r * Math.cos(initAng * π / 180), oldy = r * Math.sin(initAng * π / 180);
    let angle = (currentAngle + initAng) % 360;
    // 得到原坐标所在点
    let x = r * Math.cos((angle / 180) * π) - oldx;
    let y = r * Math.sin((angle / 180) * π) - oldy ;
    if (zI !== 3) {
        if (rotateArr[zI].indexOf(index) > -1) {
            g_modelMatrix.translate(x, y, 0); 
            g_modelMatrix.rotate(currentAngle, 0, 0, 1);
        }
    } else {
            g_modelMatrix.translate(x, y, 0); 
            g_modelMatrix.rotate(currentAngle, 0, 0, 1);
            
    }
}
function setXRotate(zI, currentAngle, index) { // 饶X轴转动
    // 传入的index会不一样 从左到右列一个数组
    rotateArr = [[0, 3, 6, 9, 12, 15, 18, 21, 24],
     [1, 4, 7, 10, 13, 16, 19, 22, 25], [2, 5, 8, 11, 14, 17, 20, 23, 26]];
    oldcurrentAngle = currentAngle;
    let aindex = index;
    let r = 2 * Math.sqrt(2);
    let arr = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23];
    if (arr.indexOf(aindex) > -1) {r = 2};
    if (aindex == 13 || aindex == 12 || aindex == 14) {r = 0};
    // let zindex = Math.floor(index / 9);
    let initAng = 0;
    let snum = index;
        snum = Math.floor(index / 3);
    switch(snum) {
        case 0:initAng = 45;break;
        case 1:initAng = 90;break;
        case 2:initAng = 135;break;
        case 3:initAng = 0;break;
        case 4:initAng = 0;break;
        case 5:initAng = 180;break;
        case 6:initAng = -45;break;
        case 7:initAng = -90;break;
        case 8:initAng = -135;break;
        default : break;
    }
    let oldz = r * Math.cos(initAng * π / 180), oldy = r * Math.sin(initAng * π / 180);
    let angle = (currentAngle + initAng) % 360;
    // 得到原坐标所在点
    let z = r * Math.cos((angle / 180) * π) - oldz;
    let y = r * Math.sin((angle / 180) * π) - oldy ;
    if (zI !== 3) {
        if (rotateArr[zI].indexOf(index) > -1) {
            g_modelMatrix.rotate(currentAngle, 1, 0, 0);
            g_modelMatrix.translate(0, y, z); 
        }
    } else {
            g_modelMatrix.rotate(currentAngle, 1, 0, 0);
            g_modelMatrix.translate(0, y, z); 
    }
}
function setYRotate(zI, currentAngle, index) { // 饶Y轴转动
    oldcurrentAngle = currentAngle;
    let aindex = index % 9;
    let r = 2 * Math.sqrt(2);
    let arr = [1, 3, 5, 7];
    if (arr.indexOf(aindex) > -1) {r = 2};
    if (aindex == 4) {r = 0};
    let zindex = Math.floor(index / 9);
    let initAng = 0;
    switch(aindex) {
        case 0:initAng = 45;break;
        case 1:initAng = 90;break;
        case 2:initAng = 135;break;
        case 3:initAng = 0;break;
        case 4:initAng = 0;break;
        case 5:initAng = 180;break;
        case 6:initAng = -45;break;
        case 7:initAng = -90;break;
        case 8:initAng = -135;break;
        // case 9:initAng = 45;break;
        default : break;
    }
    let oldx = r * Math.cos(initAng * π / 180), oldz = r * Math.sin(initAng * π / 180);
    let angle = currentAngle + initAng;
    // 得到原坐标所在点
    let x = r * Math.cos((angle / 180) * π) - oldx;
    let y = r * Math.sin((angle / 180) * π) - oldz;
    if ((zI === 0 && index < 9) || (zI === 1 && index < 18 && index > 8) ||
        (zI === 2 && index < 27 && index > 17) || (zI === 3 && index < 27)) { // 转第一层次
        g_modelMatrix.rotate(currentAngle, 0, 1, 0);
        g_modelMatrix.translate(x, 0, y); 
    }
}


function setCube(gl) {
    var i, j, k, p, n, position = [], normal, color = [];
    var a = 1, b = 0.9, ctab = [[1, 1, 0], [0, 0, 1], [1, 0, 0], [1, 1, 1], [0, 1, 0], [1, 0.5, 0] ];
    var point = {
        // 8个共点 1，2，3，4，5，6，7，8
        v1: [-1, 1, 1], v2: [1, 1, 1], v3: [1, -1, 1], v4: [-1, -1, 1], v5: [-1, 1, -1,], v6: [1, 1, -1],
        v7: [1, -1, -1],v8: [-1, -1, -1]
    }
    // 计算面 六个面内点 a, b, c, d, e, f 24个
    var face = {
        va1: [-1, 1, 1], va2: [1, 1, 1], va3: [1, -1, 1], va4: [-1, -1, 1],
        fa1: [-0.9, 0.9, 1], fa2: [0.9, 0.9, 1], fa3: [0.9, -0.9, 1], fa4: [-0.9, -0.9, 1], // 前
        fca1: [-0.9, 0.9, 1], fca2: [0.9, 0.9, 1], fca3: [0.9, -0.9, 1], fca4: [-0.9, -0.9, 1], // 前
        vb1: [-1, 1, -1],vb2: [1, 1, -1], vb3: [1, -1, -1], vb4: [-1, -1, -1],
        fb1: [-0.9, 0.9, -1],fb2: [0.9, 0.9, -1], fb3: [0.9, -0.9, -1], fb4: [-0.9, -0.9, -1], // 后
        fcb1: [-0.9, 0.9, -1],fcb2: [0.9, 0.9, -1], fcb3: [0.9, -0.9, -1], fcb4: [-0.9, -0.9, -1], // 后
        vc1: [-1, 1, 1], vc2: [-1, -1, 1], vc3: [-1, -1, -1], vc4: [-1, 1, -1],
        fc1: [-1, 0.9, 0.9], fc2: [-1, -0.9, 0.9], fc3: [-1, -0.9, -0.9], fc4: [-1, 0.9, -0.9], //左
        fcc1: [-1, 0.9, 0.9], fcc2: [-1, -0.9, 0.9], fcc3: [-1, -0.9, -0.9], fcc4: [-1, 0.9, -0.9], //左
        vd1: [1, 1, 1], vd2: [1, -1, 1], vd3: [1, -1, -1], vd4: [1, 1, -1],
        fd1: [1, 0.9, 0.9], fd2: [1, -0.9, 0.9], fd3: [1, -0.9, -0.9], fd4: [1, 0.9, -0.9], // 右
        fcd1: [1, 0.9, 0.9], fcd2: [1, -0.9, 0.9], fcd3: [1, -0.9, -0.9], fcd4: [1, 0.9, -0.9], // 右
        ve1: [-1, 1, 1], ve2: [1, 1, 1], ve3: [1, 1, -1], ve4: [-1, 1, -1],
        fe1: [-0.9, 1, 0.9], fe2: [0.9, 1, 0.9], fe3: [0.9, 1, -0.9], fe4: [-0.9, 1, -0.9], // 上
        fce1: [-0.9, 1, 0.9], fce2: [0.9, 1, 0.9], fce3: [0.9, 1, -0.9], fce4: [-0.9, 1, -0.9], // 上
        vf1: [-1, -1, 1], vf2: [1, -1, 1], vf3: [1, -1, -1], vf4: [-1, -1, -1],
        ff1: [-0.9, -1, 0.9], ff2: [0.9, -1, 0.9], ff3: [0.9, -1, -0.9], ff4: [-0.9, -1, -0.9], //下
        fcf1: [-0.9, -1, 0.9], fcf2: [0.9, -1, 0.9], fcf3: [0.9, -1, -0.9], fcf4: [-0.9, -1, -0.9], //下
}

var normalArr = [
    [0.0, 0.0, 1.0], [0.0, 0.0, -1.0],[-1.0, 0.0, 0.0],[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, -1.0, 0.0],
]
var normal = [];

// 将点排序
    var cVertiers = [];
    for (let i = 0; i < 6; i++) {
        let arr = [];
        for (let j = 0; j < 8; j++) {
            arr.push(...[0.5, 0.5, 0.5])
        }
        for (let k = 0; k < 4; k++) {
            arr.push(...ctab[i]);
        }
        for (let l = 0; l < 12; l++) {
            normal.push(...normalArr[i]);
        }
        cVertiers.push(...arr);
    }
    
    // 先设计一个小的
    var vertiers = [];
    for (var key in face) {
        vertiers.push(...face[key])
    }
    var baseIndex = [
        0, 1, 4, 1, 4, 5, 1, 5, 6, 1, 6, 2, 2, 3, 6, 3, 6, 7, 7, 3, 4, 3, 4, 0,
        // 4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
    ];
    var baseArr = []
    for (let i = 0; i < 6; i++) {
        let temp = [];
        for (let j = 0; j < baseIndex.length; j++){
            temp[j] = baseIndex[j] + i * 12;
        }
        baseArr.push(...temp);
    }
    var indexVertiers = [
        // 0, 1, 4, 1, 4, 5, 1, 5, 6, 1, 6, 2, 2, 3, 6, 3, 6, 7, 7, 3, 4, 3, 4, 0,
        // 4, 5, 6, 4, 6, 7, // 第一个面
        ...baseArr
    ];

    var vertiersV = new Float32Array(vertiers);
    var colorVertex = new Float32Array(cVertiers);
    var normalV = new Float32Array(normal);
    var indexV = new Int8Array(baseArr);

    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertiersV, 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colorVertex, 3, gl.FLOAT);
    o.normalBuffer = initArrayBufferForLaterUse(gl, normalV, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLateUse(gl, indexV, gl.UNSIGNED_BYTE);
    console.log(vertiersV);
    console.log(colorVertex);
    console.log(normalV);
    console.log(indexV);

    o.numIndex = indexV.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    console.log(o);
    return o;
}

/**
 * 工具函数
 */
function initArrayBufferForLaterUse(gl, data, num, type) {
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.num = num;
    buffer.type = type;
    return buffer;
}
function initElementArrayBufferForLateUse(gl, data, type) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.type = type;
    return buffer;
}
function initAttributeVariable(gl, attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}
var ANGLE_STEP = 30;
var last = Date.now(); 
function animate(angle) {
    var now = Date.now();
    var elapsed = now -last;
    last = now;

    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
    return newAngle % 360;
}