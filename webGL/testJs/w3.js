// 学习矩阵库

/**
 * 复合变换
 * <'平移'后的坐标>= <平移矩阵> x <原始坐标>
 * <'平移后旋转‘后的坐标> = <旋转矩阵> x <平移后的坐标>
 *  <'平移后旋转‘后的坐标> = <旋转矩阵> x （<平移矩阵> x <原始坐标>）
 *                      = （<平移矩阵> x <原始坐标>）x <旋转矩阵>
 * 
 * 一模型可能经过了多次变换，将这些变换全部复合成一个等效的变换，就得到了模型变换(model transformation)
 * 或称建模变换(modeling transformation), 相应地，模型变换的矩形称为模型矩阵(model matrix)
 * 
 */

/**
 * 动画基础
 * 让一个三角形转动起来，你需要做的是：不断擦除和重绘三角形，并且每次重绘时轻微地改变期角度
 */

var Tx = 0.0, Ty = 0.5, Tz = 0.0;
var ANGLE = 90.0;
var Sx = 1.0, Sy = 1.5, Sz = 1.0;
var ANGLE_STEP = 45.0; // 旋转速度(度/秒)
function main() {

    var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        // attribute flaot a_PositionSize;
        attribute float a_PointSize;
        uniform mat4 u_formMatrix;
        void main() {
            gl_Position = u_formMatrix * a_Position;
            // gl_PointSize = a_PositionSize;
            gl_PointSize = a_PointSize;
        }
    `;
    var FSHADER_SOURCE = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed initShader');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed set point');
        return;
    }
    var a_Point = gl.getAttribLocation(gl.program, 'a_PointSize');
    console.log(a_Point);

    var xformMatrix = new Matrix4();
    // 1旋转度数 后面三个确定旋转轴 绕那个轴那个为1
    // xformMatrix.setRotate(ANGLE, 0, 0, 1);
    // xformMatrix.setTranslate(-0.5, -0.5, 0.0); // 重新设置为平移
    // xformMatrix.translate(0.5, 0.8, 0.0); // 在原来的设置上在进行平移
    var u_formMatrix = gl.getUniformLocation(gl.program, 'u_formMatrix'); // getUniformLocation

    var currentAngle = 0.0; // 三角形当前旋转角度

    var triangles_requestAnimationFrame;
    var tick = function() { // 开始绘制三角形
        currentAngle = animate(currentAngle); // 更新旋转角
        draw(gl, n, currentAngle, xformMatrix, u_formMatrix);
        triangles_requestAnimationFrame = requestAnimationFrame(tick); // 请求浏览器调用tick

    }
    tick();
    // cancelAnimationFrame(triangles_requestAnimationFrame); // 关闭动画

    // gl.uniformMatrix4fv(u_formMatrix, false, xformMatrix.elements); // uniformMatrix4fv

    // gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.TRIANGLES, 0, n);

}
function draw(gl, n, currentAngle, xformMatrix, u_formMatrix) {
    // 设置旋转矩阵
    xformMatrix.setRotate(currentAngle, 0, 0, 1);
    gl.uniformMatrix4fv(u_formMatrix, false, xformMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


var g_last = Date.now(); // 记录上次调用函数的时该
function animate(angle) {
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ]);
    var vertices = new Float32Array([
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
    ]);
    // var n = 4;
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('failed to create the buffer object');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;

}