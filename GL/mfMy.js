var π = Math.PI, sin = Math.sin, cos = Math.cos, acos = Math.acos, pow = Math.pow, abs = Math.abs;
var round = Math.round, random = Math.random;
var updateMvpMatrix = function() {
    // this.data.mvpMatrix = new Matrix(this.data.)
}
let rotateF = {}; // 当前进行怎样的旋转
var rotateA = {}; // 已经进行的旋转
var rotateDetail = {}; // 记录每一个方块的旋转情况
<<<<<<< HEAD
var rotateAll = {x: 0, y: 0};
var rotateIsOver = true;
function rotateMF(direction, zIndex) {
    // 旋转90度
    if (rotateIsOver) {
        rotateIsOver = false;
        var angle = 0; AngleMax = 90;
        var requestId;
        // rotateA = {[direction + zIndex]: (rotateA[direction + zIndex]) % 3};
        function setCurrentAngle() {
            angle = animate(angle);
            if (angle < AngleMax) {
                requestAnimationFrame(setCurrentAngle);
                // cancelAnimationFrame(requestId);
            } else {
                // setRotateDetail(direction, zIndex);
                // console.log(rotateDetail, MFArr);
                setMFarr(direction, zIndex);
                setRotateDetail(direction, zIndex);
                console.log(rotateDetail, MFArr);
                rotateF = {};
                // console.log(rotateF);
                rotateA[direction + zIndex] = rotateA[direction + zIndex] || 0;
                rotateA[direction + zIndex] +=1;
                rotateA[direction + zIndex] = rotateA[direction + zIndex] % 4;
                rotateIsOver = true;
                return;
            }
            rotateF = {
                direction,
                zIndex,
                currentAngle: angle,
                isEmp: true,
            }
            
        }
        setCurrentAngle();
    }
=======
function rotateMF(direction, zIndex) {
    // 旋转90度
    var angle = 0; AngleMax = 90;
    var requestId;
    // rotateA = {[direction + zIndex]: (rotateA[direction + zIndex]) % 3};
    function setCurrentAngle() {
        angle = animate(angle);
        if (angle < AngleMax) {
            requestAnimationFrame(setCurrentAngle);
            // cancelAnimationFrame(requestId);
        } else {
            // setRotateDetail(direction, zIndex);
            // console.log(rotateDetail, MFArr);
            setMFarr(direction, zIndex);
            setRotateDetail(direction, zIndex);
            console.log(rotateDetail, MFArr);
            rotateF = {};
            // console.log(rotateF);
            rotateA[direction + zIndex] = rotateA[direction + zIndex] || 0;
            rotateA[direction + zIndex] +=1;
            rotateA[direction + zIndex] = rotateA[direction + zIndex] % 4;
            return;
        }
        rotateF = {
            direction,
            zIndex,
            currentAngle: angle,
            isEmp: true,
        }
        
    }
    setCurrentAngle();
    
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
}
function setRotateDetail(direction, zIndex) {
    switch(direction) {
        case 'y': setYDetail(zIndex); break;
        case  'x': setXDetail(zIndex);break;
        case 'z': setZDetail(zIndex); break;
<<<<<<< HEAD
        case '-y': setYDetail(zIndex, -1); break;
        case  '-x': setXDetail(zIndex, -1);break;
        case '-z': setZDetail(zIndex, -1); break;
        default: break;
    }
    function setYDetail(zIndex, num = 1) {
=======
        default: break;
    }
    function setYDetail(zIndex) {
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        let arr = MFArr.slice(zIndex * 9, (zIndex + 1) * 9);
        console.log(arr);
        for (let kk in arr) {
            let k = arr[kk];
            rotateDetail[k] = rotateDetail[k] || [];
            let len = rotateDetail[k].length -1;
            // if (len > -1 && rotateDetail[k][len].dir == 'y') {
                // rotateDetail[k][len].num = rotateDetail[k][len].num +1;
                // rota/teDetail[k][len].num++;
            // } else {
<<<<<<< HEAD
                rotateDetail[k].push({num: num, dir: 'y'});
=======
                rotateDetail[k].push({num: 1, dir: 'y'});
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
            // }
            
            // rotateDetail[k] = rotateDetail[k] || {};
            // rotateDetail[k]['y'] = rotateDetail[k]['y'] || 0;
            // rotateDetail[k]['y'] = (rotateDetail[k]['y'] + 1) % 4;
        }
    }
<<<<<<< HEAD
    function setXDetail(zIndex, num = 1) {
=======
    function setXDetail(zIndex) {
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        let arr = [];
        for (let i = 0; i < 3; i++) {
            arr[i] = [];
            for (let j = 0; j < 3; j++) {
                arr[i][j] = LevelMF[i][j][zIndex];
            }
        }
        console.log(arr);
        arr = flattenMd(arr);
        // console.log(arr);
        for (let kk in arr) {
            let k = arr[kk];
            rotateDetail[k] = rotateDetail[k] || [];
            let len = rotateDetail[k].length -1;
            // if (len > -1 && rotateDetail[k][len].dir == 'x') {
                // rotateDetail[k][len].num = rotateDetail[k][len].num +1;
                // rotateDetail[k][len].num++;
            // } else {
<<<<<<< HEAD
                rotateDetail[k].push({num: num, dir: 'x'});
=======
                rotateDetail[k].push({num: 1, dir: 'x'});
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
            // }
            // rotateDetail[k] = rotateDetail[k] || {};
            // rotateDetail[k]['x'] = rotateDetail[k]['x'] || 0;
            // rotateDetail[k]['x'] = (rotateDetail[k]['x'] + 1) % 4;
        }
    }
<<<<<<< HEAD
    function setZDetail(zCol, num = 1) {
=======
    function setZDetail(zCol) {
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        let arr = [], len = 3;
        for (let i = 0; i < 3; i++) { // 三行
            arr[i] = LevelMF[i][zCol];
        }
        console.log(arr);
        arr = flattenMd(arr);
        for (let kk in arr) {
            let k = arr[kk];
            rotateDetail[k] = rotateDetail[k] || [];
            let len = rotateDetail[k].length -1;
            // if (len > -1 && rotateDetail[k][len].dir == 'z') {
                // rotateDetail[k][len].num = rotateDetail[k][len].num +1;
                // rotateDetail[k][len].num++;
            // } else {
<<<<<<< HEAD
                rotateDetail[k].push({num: num, dir: 'z'});
=======
                rotateDetail[k].push({num: 1, dir: 'z'});
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
            // }

            // rotateDetail[k]['z'] = rotateDetail[k]['z'] || 0;
            // rotateDetail[k]['z'] = (rotateDetail[k]['z'] + 1) % 4;
        }
    }
}
function setMFarr(direction, zIndex) {
    let ta1 = LevelMF[zIndex];
    switch(direction) {
        case 'y': LevelMF[zIndex] = setYArrLeft(ta1);break;
        case  'x': setXArrDown(zIndex);break;
        case 'z': setZArrRight(zIndex); break;
<<<<<<< HEAD
        case '-y': LevelMF[zIndex] = setXArrRight(ta1);break;
        case  '-x': setXArrUp(zIndex);break;
        case '-z': setZArrLeft(zIndex); break;
=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        default: break;
    }
    MFArr = flattenMd(LevelMF);
    console.log(MFArr, LevelMF);
}
<<<<<<< HEAD
=======
// function setMFarrMatrix(direction, zIndex) {
//     let ta1 = LevelMF[zIndex];
//     switch(direction) {
//         case 'y': LevelMF[zIndex] = setYArrLeft(ta1);break;
//         case  'x': setXArrDown(zIndex);break;
//         case 'z': setZArrRight(zIndex); break;
//         default: break;
//     }
//     MFArr = flattenMd(LevelMF);
//     console.log(MFArr, LevelMF);
// }

// function setArrXR(arr) {

// }
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
function setZArrRight(zCol) { // 饶Z轴旋转
    // 得到数组 在旋转
    let zArr = [];
    let len = 3;
    for (let i = 0; i < 3; i++) { // 三行
        zArr[3 - 1 - i] = LevelMF[i][zCol];
    }
<<<<<<< HEAD
    zArr = setYArrLeft(zArr);
    for (let i = 0; i < 3; i++) {
        LevelMF[3 - 1 - i][zCol] = zArr[i];
    }
}
function setZArrLeft(zCol) {
    let zArr = [];
    let len = 3;
    for (let i = 0; i < 3; i++) { // 三行
        zArr[3 - 1 - i] = LevelMF[i][zCol];
    }
    zArr = setXArrRight(zArr);
=======
    console.log(zArr);
    zArr = setYArrLeft(zArr);
    console.log(zArr);
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    for (let i = 0; i < 3; i++) {
        LevelMF[3 - 1 - i][zCol] = zArr[i];
    }
}
function setXArrDown(zCol) { // 旋转三维数组的列 饶X轴旋转
    // get XArr
    let XArr = [], col = 0;

    let start = 0, end = 3;
    for (let i = start; i < end; i++) {
        XArr[i] = [];
        for (let j = start; j < end; j++) {
            XArr[i][j] = LevelMF[j][i][zCol]
        }
    }
<<<<<<< HEAD
    XArr = TArr(XArr);
    // XArr = setXArrRight(XArr);
    XArr = setYArrLeft(XArr);
    XArr = TArr(XArr);
    // XArr = setYArrLeft(XArr);
=======
    console.log(XArr);
    XArr = TArr(XArr);
    console.log(XArr);
    // XArr = setXArrRight(XArr);
    XArr = setYArrLeft(XArr);
    console.log(XArr);
    XArr = TArr(XArr);
    // XArr = setYArrLeft(XArr);
    console.log(XArr);
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    for (let i = start; i < end; i++) {
        for (let j = start; j < end; j++) {
                // LevelMF[i][j][zCol] = XArr[i - start][j - start];
                LevelMF[j][i][zCol] = XArr[i][j];
        }
    }
<<<<<<< HEAD
}
function setXArrUp(zCol) {
    let XArr = [], col = 0;
    let start = 0, end = 3;
    for (let i = start; i < end; i++) {
        XArr[i] = [];
        for (let j = start; j < end; j++) {
            XArr[i][j] = LevelMF[j][i][zCol]
        }
    }
    XArr = TArr(XArr);
    XArr = setXArrRight(XArr);
    XArr = TArr(XArr);
    for (let i = start; i < end; i++) {
        for (let j = start; j < end; j++) {
                LevelMF[j][i][zCol] = XArr[i][j];
        }
    }
=======
    console.log(LevelMF, XArr);
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
}
function setYArrLeft(arr) { // 向左旋转数组
    let ta = [[],[],[]];
    var temp = [];
    var len = arr.length;
    for(var i = 0; i < len; i++){
        for(var j = 0; j < len; j++){
            var k = len - 1 -j;
            if(!temp[k]){
                temp[k] = [];
            }
            temp[k][i] = arr[i][j];
        }
    }
   return temp;

}
function setXArrRight(arr) { // 向右旋转一个二维数组
    var len = arr.length;
    var newArr = [[1], [2], [3]];
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            newArr[j][len - 1 - i] = arr[i][j];
        }
    }
    return newArr;
}

function TArr(arr) { // 数组转置
    let tarr = [];
    // 得到最大列数
    let maxCol = 0;
    for (let i = 0; i < arr.length; i++) {
        if (maxCol < arr[i].length) {maxCol = arr[i].length}
    }
    // 初始化
    for (let i = 0; i < maxCol; i++) {tarr[i] = [];
        for (let j = 0; j < arr.length; j++) {
            tarr[i][j] = arr[j][i];
        }
    }
    return tarr;
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
<<<<<<< HEAD
    uniform mat4 u_MvpMatrixFromLight; // 顶点基于光源的模型投影矩阵
=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    uniform mat4 u_MvpMatrix;
    uniform vec3 u_lightDirection;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
<<<<<<< HEAD
    varying vec4 v_PositionFromLight; // 将基于光源的顶点位置传递给片元着色器
    void main() {
        vec3 lightDirection = vec3(1.0, 1.0, 1.0);
        // vec3 lightDirection = vec3(u_lightDirection);
=======
    void main() {
        vec3 lightDirection = vec3(1.0, 1.0, 1.0);
        // vec3 lightDirection = vec3(u_lightDirection);
        vec4 lColor = vec4(0.0, 1.0, 1.0, 1.0);
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        // vec3 normal = normalize((u_NormlMatrix * a_Normal).xyz);
        float nDotL = max(dot(normal, lightDirection), 0.0);
<<<<<<< HEAD
        v_PositionFromLight = u_MvpMatrixFromLight * a_Position;
=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        v_Color = vec4((a_Color.rgb * nDotL + vec3(0.1)) , a_Color.a);
    }
`;
var CUBE_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
<<<<<<< HEAD
    uniform sampler2D u_ShadowMap; // 纹理的存储变量
    varying vec4 v_Color;
    varying vec4 v_PositionFromLight;
    float unpackDepth(const in vec4 rgbaDepth) {
      const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
      float depth = dot(rgbaDepth, bitShift);
      return depth;
    }
    void main() {
        vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
        vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
        float depth = unpackDepth(rgbaDepth);
        float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;
        gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
        // gl_FragColor = v_Color;
    }
`;
var OBJ_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrixFromLight; // 顶点基于光源的模型投影矩阵
    uniform mat4 u_MvpMatrix;
    uniform vec3 u_lightDirection;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
    varying vec4 v_PositionFromLight; // 将基于光源的顶点位置传递给片元着色器
    void main() {
        vec3 lightDirection = vec3(1.0, 1.0, 1.0);
        // vec3 lightDirection = vec3(u_lightDirection);
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        // vec3 normal = normalize((u_NormlMatrix * a_Normal).xyz);
        float nDotL = max(dot(normal, lightDirection), 0.0);
        v_PositionFromLight = u_MvpMatrixFromLight * a_Position;
        v_Color = vec4((a_Color.rgb * nDotL + vec3(0.1)) , a_Color.a);
    }
`;
var OBJ_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D u_ShadowMap; // 纹理的存储变量
    varying vec4 v_Color;
    varying vec4 v_PositionFromLight;
    float unpackDepth(const in vec4 rgbaDepth) {
      const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
      float depth = dot(rgbaDepth, bitShift);
      return depth;
    }
    void main() {
        vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
        vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
        float depth = unpackDepth(rgbaDepth);
        float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;
        gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
        // gl_FragColor = v_Color;
    }
`;
var SHADOW_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    void main() {
        vec3 lightDirection = vec3(1.0, 1.0, 1.0);
        // vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        // float nDotL = max(dot(normal, lightDirection), 0.0);
        gl_Position = u_MvpMatrix * a_Position;
    }
`;
var SHADOW_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    void main() {
        const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
        // const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
        const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
        // vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift); // fract 返回小数部分
        vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
        rgbaDepth -= rgbaDepth.gbaa * bitMask;
        gl_FragColor = rgbaDepth;
    }
`;
// 屏幕分辨率
// var OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
var OFFSCREEN_WIDTH = 1024, OFFSCREEN_HEIGHT = 1024;
// var LIGHT_X = 0, LIGHT_Y = 40, LIGHT_Z = 2; // Light positio(x, y, z)
var LIGHT_X = 100, LIGHT_Y = 100, LIGHT_Z = 100;
=======
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {console.log('failed gl'); return}

    var cubeProgram = createProgram(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE);
<<<<<<< HEAD
    if (!cubeProgram) {console.log('failed cubeProgram'); return;};

=======

    if (!cubeProgram) {console.log('failed cubeProgram'); return;};
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    cubeProgram.a_Position = gl.getAttribLocation(cubeProgram, 'a_Position');
    cubeProgram.a_Normal = gl.getAttribLocation(cubeProgram, 'a_Normal');
    cubeProgram.a_Color = gl.getAttribLocation(cubeProgram, 'a_Color');
    cubeProgram.u_MvpMatrix = gl.getUniformLocation(cubeProgram, 'u_MvpMatrix');
    cubeProgram.u_NormalMatrix = gl.getUniformLocation(cubeProgram, 'u_NormalMatrix');
    cubeProgram.u_lightDirection = gl.getUniformLocation(cubeProgram, 'u_lightDirection');
<<<<<<< HEAD
    cubeProgram.u_ShadowMap = gl.getUniformLocation(cubeProgram, 'u_ShadowMap');
    cubeProgram.u_MvpMatrixFromLight = gl.getUniformLocation(cubeProgram, 'u_MvpMatrixFromLight');

    if (cubeProgram.a_Position < 0 || cubeProgram.a_Color < 0 || cubeProgram.a_Normal < 0 ||
        cubeProgram.u_MvpMatrix < 0 || cubeProgram.u_NormalMatrix < 0 || cubeProgram.u_ShadowMap < 0
     || cubeProgram.u_MvpMatrixFromLight < 0) {
            console.log('failed cubeProgram loaction'); return;
    }

    var objProgram = createProgram(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE);
    if (!objProgram) {console.log('failed cubeProgram'); return;};

    objProgram.a_Position = gl.getAttribLocation(objProgram, 'a_Position');
    objProgram.a_Normal = gl.getAttribLocation(objProgram, 'a_Normal');
    objProgram.a_Color = gl.getAttribLocation(objProgram, 'a_Color');
    objProgram.u_MvpMatrix = gl.getUniformLocation(objProgram, 'u_MvpMatrix');
    objProgram.u_NormalMatrix = gl.getUniformLocation(objProgram, 'u_NormalMatrix');
    objProgram.u_lightDirection = gl.getUniformLocation(objProgram, 'u_lightDirection');
    objProgram.u_ShadowMap = gl.getUniformLocation(objProgram, 'u_ShadowMap');
    objProgram.u_MvpMatrixFromLight = gl.getUniformLocation(objProgram, 'u_MvpMatrixFromLight');

    if (objProgram.a_Position < 0 || objProgram.a_Color < 0 || objProgram.a_Normal < 0 ||
        objProgram.u_MvpMatrix < 0 || objProgram.u_NormalMatrix < 0 || objProgram.u_ShadowMap < 0
     || objProgram.u_MvpMatrixFromLight < 0) {
            console.log('failed objProgram loaction'); return;
    }

    var shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
    if (!shadowProgram) {console.log('falied shadowProgram'); return;}

    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');
    shadowProgram.u_NormalMatrix = gl.getUniformLocation(shadowProgram, 'u_NormalMatrix');
    if (shadowProgram.a_Position < 0 || shadowProgram.u_MvpMatrix < 0){
        console.log('falied shadowProgram location'); return;
    }


=======

    if (cubeProgram.a_Position < 0 || cubeProgram.a_Color < 0 || cubeProgram.a_Normal < 0 ||
        cubeProgram.u_MvpMatrix < 0 || cubeProgram.u_NormalMatrix < 0) {
            console.log('failed loaction'); return;
        }
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    
    

    var cube = setCube(gl);
<<<<<<< HEAD
    if (!cube) {console.log('failed cube'); return;}
    var plane = initVertexBuffersForPlane(gl);
    if (!plane) {console.log('failed plane'); return;}

    var fbo = initFramebufferObject(gl);
    if (!fbo) {console.log('failed fbo'); return};

    var iObj = importObj(gl, objProgram);
    if (!iObj) {return}
    readOBJFile('../webGL/WebGL_Guide_Code/ch10/cube.obj', gl, iObj, 60, true);

    gl.activeTexture(gl.TEXTURE0); // 激活指定纹理单元
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    var viewProjMatrixFromLight = new Matrix4();
    // LIGHT_X = 0, LIGHT_Y = 200, LIGHT_Z = 0;
    viewProjMatrixFromLight.setPerspective(80, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 200);
    viewProjMatrixFromLight.lookAt(0, -10, -10, 0, 0, 0, 0, 1, 0);

=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100); // Perspective 透视图
    viewProjMatrix.lookAt(9, 20, 20, 0, 0, 0, 0, 1, 0); // 视点 ，注视点， 上方向
<<<<<<< HEAD
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    var currentAngle = 30;
    var mvpMatrix_Light_c = new Matrix4(); // 光源（mf）的模型投影矩阵
    var mvpMatrix_Light_p = new Matrix4(); // 光源（平面）的模型投影矩阵
    var tick = function() {
        currentAngle = animate(currentAngle);
        
        // gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        // gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.useProgram(shadowProgram);
        // // 绘制cube和plane（用于生成阴影贴图）
        // setDraw(gl, shadowProgram, cube, viewProjMatrixFromLight, currentAngle);
        // mvpMatrix_Light_c.set(g_mvpMatrix); //
        // drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);
        // // drawPlane(gl, program, plane, viewProjMatrix)
        // mvpMatrix_Light_p.set(g_mvpMatrix); // 

        // // 解阶乘帧缓冲区绑定， 绘制成常颜色缓冲区
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(cubeProgram);
        gl.uniform1i(cubeProgram.u_ShadowMap, 0);

        // gl.uniformMatrix4fv(cubeProgram.u_MvpMatrixFromLight, false, mvpMatrix_Light_c.elements);
        setDraw(gl, cubeProgram, cube, viewProjMatrix, currentAngle);

        // gl.viewport(0, 0, canvas.width, canvas.height);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(objProgram);
        drawObj(gl, objProgram, iObj, viewProjMatrix);
        // gl.uniformMatrix4fv(cubeProgram.u_MvpMatrix, false, mvpMatrix_Light_p.elements);
        // drawPlane(gl, cubeProgram, plane, viewProjMatrix);
=======
    // console.log(cubeProgram.u_lightDirection);
    var lightDirection = new Vector3([1, 1, 1]);
    lightDirection.normalize(); // 归一化
    // console.log(lightDirection.elements);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    var currentAngle = 30;
    var tick = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        currentAngle = animate(currentAngle);
        setDraw(gl, cubeProgram, cube, viewProjMatrix, currentAngle);
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        requestAnimationFrame(tick, canvas);
        // tick();
    };
    tick();
<<<<<<< HEAD

    canvas.onmousedown = function(ev) {
        mouseMove = true;
        mouseInit = ev;
        var x = ev.clientX, y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
       //  console.log(rect, x, y);
        if (rect.left <= x && x < rect.right && rect.top <=y && y < rect.bottom) {
            mouseInit.lastX = x; mouseInit.lastY = y;
           //  console.log(rect, y);
           var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;

        }
    }
    canvas.onmouseup = function(ev) {
        mouseMove = false;
        mouseInit = {};
    }
    canvas.onmousemove = function(ev) {
        let speend = 1; // 放大倍数
        if (mouseMove && rotateIsOver) { // 点击了并称到了鼠标 并且对mf的操作停止
            // 只能判断出在x,y轴上称动的距离
            var x = ev.clientX, y = ev.clientY;
             var factor = 200 / canvas.height;
             var dx = factor * (x - mouseInit.lastX);
             var dy = factor * (y - mouseInit.lastY);

             currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
             currentAngle[1] = currentAngle[1] + dx;

             rotateAll.x = Math.max(Math.min(rotateAll.x + dy, 90.0), -90.0);
             rotateAll.y = rotateAll.y + dx;
            //  console.log(rotateAll);

             mouseInit.lastX = x; mouseInit.lastY = y;
        }
    }
    
}
var mouseMove = false; // 用鼠标移动mf整体
var mouseInit = {}; // 点击时鼠标的状态
=======
    
}
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e

var g_mvpMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var MFArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17,18,19,20,21,22,23,24,25,26];
var LevelMF = [
    [[0, 1, 2], [3, 4, 5], [6, 7, 8]],
    [[9, 10, 11], [12, 13, 14], [15, 16, 17]],
    [[18, 19, 20], [21, 22, 23], [24, 25, 26]]
]
<<<<<<< HEAD
function drawPlane(gl, program, plane, viewProjMatrix) { // 画一个方块
    g_modelMatrix.setRotate(0, 0, 1, 1);
    // g_modelMatrix.setScale(1, 1, 1);
    // g_modelMatrix.translate(0, -20, 0);
    initAttributeVariable(gl, program.a_Position, plane.vertexBuffer);
    drawCanvase(gl, program, plane, viewProjMatrix);
}
function drawObj(gl, program, obj, viewProjMatrix) {
    if (g_objDoc != null && g_objDoc.isMTLComplete()){ // OBJ and all MTLs are available
        g_drawingInfo = onReadComplete(gl, obj, g_objDoc);
        g_objDoc = null;
      }
      console.log(g_drawingInfo);
      if (!g_drawingInfo) {console.log('????');return};
    // initAttributeVariable(gl, program.a_Position, obj.vertexBuffer);
    console.log('???', g_drawingInfo);
    // g_modelMatrix.set
    g_modelMatrix.setRotate(0, 0, 1, 1);
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  // Draw
  // console.log(g_drawingInfo);
  gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
    // drawCanvase(gl, program, obj, viewProjMatrix);
}
=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
function setDraw(gl, program, cube, viewProjMatrix, currentAngle) { //  用小方块组成大方块
    var p = 0.2;
    // console.log(MFArr);
    // [2, 5, 8, 1, 4, 7, 6, 15, 24, 3, 10, 11, 12, 13, 14, 21, 16, 17, 0, 19, 20, 9, 22, 23, 18, 25, 26]
    for(let i = 0; i < 27; i++) {
        // var coord = MFArr[i];
        var coord = i;
        var x = (coord % 3) * 2, y = Math.floor(coord / 9) * 2, z = (Math.floor(coord / 3) % 3) * 2;
        // var x1 = x + (p * x), y1 = y + p * y, z1 = z + p * z;
        var x1 = x, y1 = y, z1 = z;
        // console.log(i, x, y, z);
        g_modelMatrix.setTranslate(x1, y1, z1);
        g_modelMatrix.translate(-3, -3, -3);
        // drawCube(gl, program, cube, viewProjMatrix, currentAngle, MFArr[i], i);
        drawCube(gl, program, cube, viewProjMatrix, currentAngle, i, MFArr[i]);
    }
}
var oldcurrentAngle = 0;
function drawCube(gl, program, cube, viewProjMatrix, currentAngle, index, MIdex) {
<<<<<<< HEAD
    // gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, cube.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, cube.normalBuffer);

    if (rotateAll.x) {setXRotate(3, rotateAll.x, index, MIdex);}
    if (rotateAll.x) {setYRotate(3, rotateAll.y, index, MIdex);}
=======
    gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, cube.vertexBuffer);
    initAttributeVariable(gl, program.a_Color, cube.colorBuffer);
    initAttributeVariable(gl, program.a_Normal, cube.normalBuffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);

    
    // if (!rotateF.isEmp) {
        let x0Arr = [0, 3, 6, 9, 12, 15, 18, 21, 24], x1Arr = [1, 4, 7, 10, 13, 16, 19, 22, 25];
        let x2Arr = [2, 5, 8, 11, 14, 17, 20, 23, 26];
        let z0Arr = [0, 1, 2, 9, 10, 11, 18, 19, 20], z1Arr = [3, 4, 5, 12, 13, 14, 21, 22, 23];
        let z2Arr = [6, 7, 8, 15, 16, 17, 24, 25, 26];

        // setCubeRotate(index, MIdex);
        // drawCanvase(gl, program, cube, viewProjMatrix, currentAngle, index, MIdex);
        // for (let k in rotateA) {
            // console.log(k);
            // switch(k) {
            //     case 'y0': if (index < 9) {g_modelMatrix.rotate(rotateA[k] * 90, 0, 1, 0);} break;
            //     case 'y1': if (index < 18 && index > 8){g_modelMatrix.rotate(rotateA[k] * 90, 0, 1, 0);} break;
            //     case 'y2': if (index > 17) {g_modelMatrix.rotate(rotateA[k] * 90, 0, 1, 0);} break;
            //     case 'x0': if (x0Arr.indexOf(index) > -1) {
            //                     g_modelMatrix.rotate(rotateA[k] * 90, 1, 0, 0);} break;
            //     case 'x1': if (x1Arr.indexOf(index) > -1) {
            //                     g_modelMatrix.rotate(rotateA[k] * 90, 1, 0, 0);} break;
            //     case 'x2': if (x2Arr.indexOf(index) > -1) {
            //                     g_modelMatrix.rotate(rotateA[k] * 90, 1, 0, 0);} break;
            //     case 'z0': if (z0Arr.indexOf(index) > -1) {
            //                     g_modelMatrix.rotate(rotateA[k] * 90, 0, 0, 1);} break;
            //     case 'z1': if (z1Arr.indexOf(index) > -1) {
            //                     g_modelMatrix.rotate(rotateA[k] * 90, 0, 0, 1);} break;
            //     case 'z2': if (z2Arr.indexOf(index) > -1) {
            //                     g_modelMatrix.rotate(rotateA[k] * 90, 0, 0, 1);} break;
            // }
            // // switch(k) {
            // //     case 'y0': if (MIdex < 9) {g_modelMatrix.rotate(rotateA[k] * 90, 0, 1, 0);} break;
            // //     case 'y1': if (MIdex < 18 && MIdex > 8){g_modelMatrix.rotate(rotateA[k] * 90, 0, 1, 0);} break;
            // //     case 'y2': if (MIdex > 17) {g_modelMatrix.rotate(rotateA[k] * 90, 0, 1, 0);} break;
            // //     case 'x0': if (x0Arr.indexOf(MIdex) > -1) {
            // //                     g_modelMatrix.rotate(rotateA[k] * 90, 1, 0, 0);} break;
            // //     case 'x1': if (x1Arr.indexOf(MIdex) > -1) {
            // //                     g_modelMatrix.rotate(rotateA[k] * 90, 1, 0, 0);} break;
            // //     case 'x2': if (x2Arr.indexOf(MIdex) > -1) {
            // //                     g_modelMatrix.rotate(rotateA[k] * 90, 1, 0, 0);} break;
            // //     case 'z0': if (z0Arr.indexOf(MIdex) > -1) {
            // //                     g_modelMatrix.rotate(rotateA[k] * 90, 0, 0, 1);} break;
            // //     case 'z1': if (z1Arr.indexOf(MIdex) > -1) {
            // //                     g_modelMatrix.rotate(rotateA[k] * 90, 0, 0, 1);} break;
            // //     case 'z2': if (z2Arr.indexOf(MIdex) > -1) {
            // //                     g_modelMatrix.rotate(rotateA[k] * 90, 0, 0, 1);} break;
            // // }
        // }
    // }
   
    // setXRotate(3, currentAngle ,index, MIdex);
    // setYRotate(3, currentAngle ,index, MIdex);
    // setZRotate(3, currentAngle ,index, MIdex);
    // setZRotate(3, 90 ,index, MIdex);
    // setYRotate(3, -90 ,index, MIdex);
    // setXRotate(3, 90 ,index, MIdex);
    // setZRotate(3, 90 ,index, MIdex);
    // let arrNew = [{dir: 0, key: true}, {dir: 1, key: true}, {dir: 2, key: true}];
    // for (let i = 0; i < allTT.length; i++) {
    //     setCoord(arrNew);
    // }
    
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    if (rotateF.direction) {
        // console.log(rotateF);
        switch(rotateF.direction) {
            case 'x':
                setXRotate(rotateF.zIndex - 0, rotateF.currentAngle, index, MIdex);
            break;
            case 'y':
                setYRotate(rotateF.zIndex - 0, rotateF.currentAngle, index, MIdex);
            break;
            case 'z':
                setZRotate(rotateF.zIndex - 0, rotateF.currentAngle, index, MIdex);
            break;
<<<<<<< HEAD
            case '-x':
                setXRotate(rotateF.zIndex - 0, -rotateF.currentAngle, index, MIdex);
            break;
            case '-y':
                setYRotate(rotateF.zIndex - 0, -rotateF.currentAngle, index, MIdex);
            break;
            case '-z':
                setZRotate(rotateF.zIndex - 0, -rotateF.currentAngle, index, MIdex);
            break;
=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
                default: break;
        }
        // drawCanvase(gl, program, cube, viewProjMatrix, currentAngle, index, MIdex);
    }
    // setXRotate(3, currentAngle ,index, MIdex);
    setCubeRotate(index, MIdex);

<<<<<<< HEAD
    drawCanvase(gl, program, cube, viewProjMatrix);
=======
    drawCanvase(gl, program, cube, viewProjMatrix, currentAngle, index, MIdex);
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    
    
    
}

<<<<<<< HEAD
function drawCanvase(gl, program, cube, viewProjMatrix) {
    if (program.a_Color != undefined) {
        initAttributeVariable(gl, program.a_Color, cube.colorBuffer);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);


=======
function drawCanvase(gl, program, cube, viewProjMatrix, currentAngle, index, MIdex) {
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
    gl.uniform3fv(program.u_lightDirection, new Float32Array([0, 1, 1]));

    gl.drawElements(gl.TRIANGLES, cube.numIndex, cube.indexBuffer.type, 0);
}

function setCubeRotate(zIndex, MIdex) { // 设置各个方块的朝向

    let coord = null;
    let rDir = {x: 'x', y: 'y', z: 'z'};
    let arrNew = [{dir: 0, key: true}, {dir: 1, key: true}, {dir: 2, key: true}];
    // {z:1, x:1}
    for (let keyw in rotateDetail[MIdex]) {
        let obj = ['x', 'y', 'z'];
        let obj2 = {x: 0, y: 1, z: 2};
        let key = rotateDetail[MIdex][keyw].dir;
        let keyNum = rotateDetail[MIdex][keyw].num;
        let angle = keyNum * 90;
        let cd = rDir[key]; coord = cd;
<<<<<<< HEAD
=======
        // if (cd.indexOf('-') > -1) {coord = cd.substring(1); angle = -angle;}
        // if (rotateDetail[MIdex] && rotateDetail[MIdex].length > 1 && keyw > 0 && MIdex == 26) {
        //     // coord = 'y'; angle = -90;
        //     console.log(coord);}
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
        let rotate = arrNew[obj2[key]];
        if (!rotate.key) {angle = -angle}
        switch(obj[rotate.dir]) {
            case 'x':  g_modelMatrix.rotate(angle, 1, 0, 0); break;
            case 'y':  g_modelMatrix.rotate(angle, 0, 1, 0); break;
            case 'z':  g_modelMatrix.rotate(angle, 0, 0, 1); break;
            case '-x':  g_modelMatrix.rotate(-angle, 1, 0, 0); break;
            case '-y':  g_modelMatrix.rotate(-angle, 0, 1, 0); break;
            case '-z':  g_modelMatrix.rotate(-angle, 0, 0, 1); break;
            default: break;
        }
<<<<<<< HEAD
            // rDir = getDir(keyNum, coord);
            arrNew = setCoord(arrNew, key, keyNum);
=======
        // if (rotateDetail[MIdex][keyw -1] && rotateDetail[MIdex][keyw] == rotateDetail[MIdex][keyw -1]) {
        //     console.log(rotateDetail[MIdex]);
        // } else {
            rDir = getDir(keyNum, coord);
            arrNew = setCoord(arrNew, key, keyNum);
            // console.log(arrNew);
        // }
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
    }
    function setCoord(arr, coord, num, dir = 1) { // coord 当前所饶之轴, dir 顺逆时针, num 轴动多少
        // x => 0, y => 1, z => 2
        // dir 两个方向 另外两个 1 -1
        // x -x y -y z -z
        // let x = ang % 4
        // 0, 1 变更轴（两轴交换）, 2 轴换向, 3 变更轴 
        // 先默认顺时针
        let obj = {x: 0, y: 1, z: 2};
        let c = obj[coord];
        for (let i = 0; i < arr.length; i++) {
            if (i != c) {
                if (dir == 1) {
                    if (arr[c].key) {
                        arr[i].dir = (arr[i].dir - num + 3) % 3;
                    } else {
                        arr[i].dir = (arr[i].dir + num + 3) % 3;
                    }
                    
                }
            }
        }
        for (let i = 0; i <arr.length; i++) {
            if (i != c) {
                if (arr[i].dir == arr[c].dir) {
                    arr[i].key = !arr[i].key;
                    // console.log(i, c)
                    arr[i].dir = 3 - arr[3 - i - c].dir - arr[c].dir;
                }
            }
        }
        return arr;
    }

    // 找到变化后对应的转轴
    function getDir(num, dir) {
        // console.log(num, dir);
        let rDir = {x: 'x', y: 'y', z: 'z'};
        if (num == 3) { // 90 逆时针
            switch(dir) {
                case 'x': rDir = {x: 'x',y: 'z', z: '-y'}; break;
                case '-x': rDir = {x: '-y',y: '-x', z: 'y'}; break;
                case 'y': rDir = {y: 'y',z: 'x', x: '-z'}; break;
                case '-y': rDir = {y: '-x',z: '-y', x: 'z'}; break;
                case 'z': rDir = {z: 'z',x: 'y', y: '-x'}; break;
                case '-z': rDir = {z: '-y',x: '-z', y: 'x'}; break;
                default: break;
            }
        }
        if (num == 1) { // -90 逆时针
            switch(dir) {
                case 'x': rDir = {x: 'x',y: '-z', z: 'y'}; break;
                case '-x': rDir = {x: '-y',y: 'z', z: '-x'}; break;
                case 'y': rDir = {y: 'y',z: '-x', x: 'z'}; break;
                case '-y': rDir = {y: '-z',z: 'x', x: '-y'}; break;
                case 'z': rDir = {z: 'z',x: '-y', y: 'x'}; break;
                case '-z': rDir = {z: '-x',x: 'y', y: '-z'}; break;
                default: break;
            }
        }
        if (num == 2) { // -90 逆时针
            switch(dir) {
                case 'x': rDir = {x: 'x',y: '-y', z: '-z'}; break;
                case '-x': rDir = {x: '-x',y: '-y', z: '-x'}; break;
                case 'y': rDir = {y: 'y',z: '-z', x: '-x'}; break;
                case '-y': rDir = {y: '-y',z: '-z', x: '-y'}; break;
                case 'z': rDir = {z: 'z',x: '-x', y: '-y'}; break;
                case '-z': rDir = {z: '-z',x: '-x', y: '-y'}; break;
                default: break;
            }
        }
        return rDir;
    }
<<<<<<< HEAD
=======
    // x ->y
    // x coord = null => coord = x => 旋转 => {x: 'x',y: '-z', z: 'y'}
    // y coord = x => coord = -z => 旋转 => {}
    // z -> x -> z  => z -y x
    // z coord = null => coord = z => 旋转 => {z: 'z',x: '-y', y: 'x'}
    // x coord = z => coord = -y => 旋转 => {z: x}
    // z coord = -y => coord => x
    // let keys = Object.keys(rotateDetail[MIdex]);
    // if (keys.indexOf('z')) {
    //     let angle = (rotateDetail[MIdex]['z'] || 0) * 90;
    //     g_modelMatrix.rotate(angle, 0, 0, 1);
    // }
    // if (keys.indexOf('y')) {
    //     let angle = (rotateDetail[MIdex]['y'] || 0) * 90;
    //     g_modelMatrix.rotate(angle, 0, 1, 0);
    // }
    // if (keys.indexOf('x')) {
    //     let angle = (rotateDetail[MIdex]['x'] || 0) * 90;
    //     g_modelMatrix.rotate(angle, 0, 1, 0);
    // }
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
}
function setCoord(arr, coord, num, dir = 1) { // coord 当前所饶之轴, dir 顺逆时针, num 轴动多少
    // x => 0, y => 1, z => 2
    // dir 两个方向 另外两个 1 -1
    // x -x y -y z -z
    // let x = ang % 4
    // 0, 1 变更轴（两轴交换）, 2 轴换向, 3 变更轴 
    // 先默认顺时针
    let obj = {x: 0, y: 1, z: 2};
    let c = obj[coord];
    for (let i = 0; i < arr.length; i++) {
        if (i != c) {
            if (dir == 1) {
                arr[i].dir = (arr[i].dir - num + 3) % 3;
            }
        }
    }
    for (let i = 0; i <arr.length; i++) {
        if (i != c) {
            if (arr[i].dir == arr[c].dir) {
                arr[i].key = !arr[i].key;
                // console.log(i, c)
                arr[i].dir = 3 - arr[3 - i - c].dir - arr[c].dir;
            }
        }
    }
    return arr;
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
    // let Rarr = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    // let oldAng = rotateA['z' + zI] || 0;
    // for (let i = 0; i < oldAng; i++) {
    //     // Rarr = setYArrLeft(Rarr);
    //     Rarr = setXArrRight(Rarr);
    // }
    // Rarr = flattenMd(Rarr);
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
function setXRotate(zI, currentAngle, index, MIdex) { // 饶X轴转动
    // 传入的zI会不一样 从左到右列一个数组
    rotateArr = [[0, 3, 6, 9, 12, 15, 18, 21, 24],
     [1, 4, 7, 10, 13, 16, 19, 22, 25], [2, 5, 8, 11, 14, 17, 20, 23, 26]];
    oldcurrentAngle = currentAngle;
    let aindex = index;
    // let aindex = MIdex;
    let r = 2 * Math.sqrt(2);
    let arr = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23];
    if (arr.indexOf(aindex) > -1) {r = 2};
    if (aindex == 13 || aindex == 12 || aindex == 14) {r = 0};
    // let zindex = Math.floor(index / 9);
    let initAng = 0;
    let snum = index;
        snum = Math.floor(index / 3);
    let Rarr = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    let oldAng = rotateA['x' + zI] || 0;
    // for (let i = 0; i < oldAng; i++) {
    //     Rarr = setYArrLeft(Rarr);
    // }
    // Rarr = flattenMd(Rarr);

    // [6, 1, 2] // 先设置坐标 在旋转 在设置坐标在旋转
    // [15, 4, 5]
    // [24, 7, 8]
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
    // oldcurrentAngle = currentAngle;
    // console.log(MFArr);
    let aindex = index % 9;
    let r = 2 * Math.sqrt(2);
    let arr = [1, 3, 5, 7];
    if (arr.indexOf(aindex) > -1) {r = 2};
    if (aindex == 4) {r = 0};
    let zindex = Math.floor(index / 9);
    let initAng = 0;
    let Rarr = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    let oldAng = rotateA['y' + zI] || 0;
    // for (let i = 0; i < oldAng; i++) {
    //     Rarr = setYArrLeft(Rarr);
    // }
    // Rarr = flattenMd(Rarr);
    // // console.log(Rarr);
    // let aind = MFArr.indexOf(index) % 9;
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

<<<<<<< HEAD
function importObj(gl, program) {
    var o = new Object();
    o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
    o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
    o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
    o.indexBuffer = gl.createBuffer();
    console.log(o);
    if (!o.vertexBuffer || !o.normalBuffer || !o.colorBuffer || !o.indexBuffer) {
        console.log('import failed '); return null};
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return o;
}
=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e

function setCube(gl) { // 建立模型
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
    // console.log(vertiersV);
    // console.log(colorVertex);
    // console.log(normalV);
    // console.log(indexV);

    o.numIndex = indexV.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // console.log(o);
    return o;
}

<<<<<<< HEAD
function initVertexBuffersForPlane(gl) { // 建立平面
    // Create a plane
    //  v3------v2
    //  |        | 
    //  |        |
    //  |        |
    //  v0------v1
        
        var arr = [-30, -45, -20, 10, -45, -20, 10, -45, -70, -30, -45, -70];
        var arr = [-50, -50, 20, 20, -50, 20, 20, -50, -60, -50, -50, -60];
    var vertices = new Float32Array([
        -9, -18, 0, 5, -18, 0, 5, -18, -15, -9, -18, -15
        // ...arr
    ]);
    var colors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
    ]);
    var normal = new Float32Array([
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
    ]);
    var indices = new Int8Array([0, 1, 2, 0, 2, 3]);
    var o = new Object();

    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    o.normalBuffer = initArrayBufferForLaterUse(gl, normal, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLateUse(gl, indices, gl.UNSIGNED_BYTE);
    
    o.numIndex = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return o;
}

function initFramebufferObject(gl) { // 建立fbo 帧缓冲
    var framebuffer, texture, depthBuffer;
    
    var error = function() {// 失败后销毁方法
        if (framebuffer) { gl.deleteFramebuffer(framebuffer)}
        if (texture) {gl.deleteTexture(texture);}
        if (depthBuffer) {gl.deleteRenderbuffer(depthBuffer)};
    }

    framebuffer = gl.createFramebuffer(); // 帧缓冲
    if (!framebuffer) {console.log('Failed frame buffer'); return error();};

    texture = gl.createTexture(); // 纹理
    if (!texture) {console.log('Failed texture object'); return error();}
    gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理
    // 指定二维纹理图像 0 border
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA /** internalformat 指定纹理中的颜色组件 */,
         OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT,
         0, /** boder 必需为0 */
         gl.RGBA, /** format 指定texel(纹理影像元件)数据格式 */
         gl.UNSIGNED_BYTE, /** type 指定texel 数据类型 */ null);
    // 设置纹理参数 gl.gl.TEXTURE_MAX_FILTER 纹理放大滤波器  TEXTURE_MIN_FILTER纹理缩小滤波器
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    depthBuffer = gl.createRenderbuffer(); // 深度缓冲 渲染缓冲
    if(!depthBuffer) { console.log('Failed depthBuffer'); return error();}

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // 绑定渲染缓冲区
    // 建和初始化一个渲染缓冲区对象的数据存储.
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16 /** internalFormat 渲染缓冲区的内部格式 */,
         OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // 绑定帧缓冲区
    // 将纹理设置到帧缓冲区
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    // 将渲染缓冲区设置到帧缓冲区
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER); // 检查 帧缓冲区状态 checkFramebufferStatus
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        console.log('frame buffer object is incomplete:' + e.toString());
        return error();
    }

    framebuffer.texture = texture;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;

}

=======
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
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
var ANGLE_STEP = 60;
var last = Date.now(); 
function animate(angle) {
    var now = Date.now();
    var elapsed = now -last;
    last = now;

    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
    return newAngle % 360;
}