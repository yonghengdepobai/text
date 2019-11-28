/**
 图元函数（primitive function）
    定义系统可以显示的低级对象或者最基本的实体
    图元分成两类：几何图元（geometric primitive）和图像图元（image primitive），图像图元也称为光栅图元

 属性函数（attribute function）
    API控制图元在显示器上显示的方式 用来描述对象如何被绘制的方式称为属性

 观察函数（viewing function）
    指定各种视图

 变换函数（transformation function）
    可以对象进行变换

 输入函数
 控制函数
 查询函数

 用户的坐标系称为世界坐标（world coordinate system）、应用程序坐标系（application coordinate system）
 或对象坐标系（object coordinate system）

 应用程序中度量顶点位置的数值称为顶点坐标（vertex coordinate）大多数应用程序中， 顶点坐标和对象坐标是相同的

 用在显示器上的单位度量出的数值起初叫做物理设备坐标（physical-device coordinate）或者叫做设置坐标（device coordinate）
 对于光栅设备我们使用的术语是窗口坐标（window coordinate）或者屏幕坐标（screen coordinate）
 屏幕坐标总是用某种整数类型来表示，因为帧缓存中任何像素的中心都必须位于固定的网格点上

 在图像生成的某个阶段，顶点坐标必须映射成屏幕坐标，这个过程系统自动执行

 笔画文本（stroke text）:对任何其他对象能够定义的图像对象一样，所以可以像任何其他几何图元那样对它进行标准的变换和观察操作
 光栅文本（raster text）:字符被定义成由0和1组成的矩阵列，这样的比特阵列叫做位块（bit block）

 */


var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        gl_PointSize = 1.0;
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

const numPoints = 50000;
const numTimesToSubdivide = 5;
function main() {
    var canvas = document.getElementById('webgl');

    var gl = canvas.getContext('webgl');
    if (!gl) {console.log('failed init gl'); return;}

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    var n = initVertexBuffers(gl);

    viewProjMatrix = new Matrix4(); // Perspective 透视 setPerspective
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100);
    viewProjMatrix.lookAt(0, 4, 8, 0, 0, 0, 0, 1, 0);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, viewProjMatrix.elements);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    var numVertices = Math.pow(4, numTimesToSubdivide + 1);
    console.log(numVertices);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_LOOP, 0, 4);
    // gl.drawArrays(gl.POINTS, 0, numVertices);
}




function initVertexBuffers(gl) {

    function setTriangle(a, b, c) {
        points.push(...a);
        points.push(...b);
        points.push(...c);
    }

    function tetra(a, b, c, d) {
        setTriangle(a, c, b);
        setTriangle(a, c, d);
        setTriangle(a, b, d);
        setTriangle(b, c, d);
    }
    
    function divideTriangle(a, b, c, count) {
        if (count == 0) {
            setTriangle(a, b, c);
        } else {
            var ab = mixV(a, b, 0.5);
            var ac = mixV(a, c, 0.5);
            var bc = mixV(b, c, 0.5);
            --count;
            divideTriangle(a, ab, ac, count);
            divideTriangle(c, ac, bc, count);
            divideTriangle(b, bc, ab, count);
            
        }
    }

    function divideTetra(a, b, c, d, count) {
        if (count == 0) {
            tetra(a, b, c, d);
        } else {
            var ab = mixV(a, b, 0.5);
            var ac = mixV(a, c, 0.5);
            var ad = mixV(a, d, 0.5);
            var bc = mixV(b, c, 0.5);
            var bd = mixV(b, d, 0.5);
            var cd = mixV(c, d, 0.5);
            count--;

            divideTetra(a, ab, ac, ad, count);
            divideTetra(ab, b, bc, bd, count);
            divideTetra(ac, bc, c, cd, count);
            divideTetra(ad, bd, cd, d, count);
        }
    }

    // 三角形
    // var triangle = [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
    // var triangle = [-1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, -1.0, 0.0];
    var a = [-0.5, -0.5, -0.5], b = [0.5, -0.5, -0.5], c = [0.0, 0.5, 0.0], d = [0.0, -0.5, 0.5];
    // var triangle = [...a, ...b, ...c, ...a, ...b, ...d, ...b, ...c, ...d, ...a, ...c, ...d];
    var triangle = [...a, ...b, ...c, ...d];

    var n = scale(0.5, add(triangle.slice(0, 3), triangle.slice(3, 6)));
    var v = scale(0.5, add(triangle.slice(0, 3), triangle.slice(6, 9)));
    var p = scale(0.5, add(n, v));

    var points = [];
   
    // points.push(...p);
    // points.push(...[0.0, 0.0, 0.0]);

    
    // divideTriangle(triangle.slice(0, 3), triangle.slice(3, 6), triangle.slice(6, 9), numTimesToSubdivide);
    // divideTriangle(n, v, p, numTimesToSubdivide);
        divideTetra(triangle.slice(0, 3), triangle.slice(3, 6), triangle.slice(6, 9),
        triangle.slice(9, 12), numTimesToSubdivide)

    for (let i = 0; i < numPoints; i++) {
        var j = Math.floor(Math.random() * 4);
        // var p = scale(0.5, add(points.slice(i * 3, i * 3 + 3), triangle.slice(j * 3, (j + 1) * 3)));
        var p = mixV(points.slice(i * 3, i * 3 +3), triangle.slice(j * 3, j * 3 + 3), 0.5);
        points.push(...p);
    }
    // console.log(points);

    var vertices = new Float32Array([
         ...points
        // ...triangle
    ]);
    console.log(points.length);
    var cp = [];
    for (let i = 0; i < points.length; i++) {
        cp[i] = (1 + points[i]) / 2;
    }
    var c1= [0.3, 0.7, 0.8], c2 = [0.5, 0.6, 0.7], c3 = [0.9, 0.1, 0.5], c4 = [0.2, 0.6, 0.8];
    var colors = new Float32Array([
        ...cp
        // ...c1, ...c1, ...c1,
        // ...c2, ...c2, ...c2,
        // ...c3, ...c3, ...c3,
        // ...c4, ...c4, ...c4,
    ]);
    // console.log(vertices);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {console.log('failed a_Position'); return;}

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {console.log('failed a_Color'); return}
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);


        //  points
    return points.length / 3;
}

function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);

    gl.useProgram(program);
    gl.program = program;
}

function createProgram(gl, vshader, fshader) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var FragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, FragmentShader);

    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
        console.log(`error linked ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        gl.deleteShader(FragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }

    return program;
}

function loadShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('error shader ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;

}