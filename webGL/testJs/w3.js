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

var Tx = 0.0, Ty = 0.5, Tz = 0.0;
var ANGLE = 90.0;
var Sx = 1.0, Sy = 1.5, Sz = 1.0;
function main() {

    var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        uniform mat4 u_formMatrix;
        void main() {
            gl_Position = u_formMatrix * a_Position;
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

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed set point');
        return;
    }

    var xformMatrix = new Matrix4();
    // 1旋转度数 后面三个确定旋转轴 绕那个轴那个为1
    xformMatrix.setRotate(ANGLE, 0, 0, 1);
    // xformMatrix.setTranslate(0.5, 0.5, 0.0); // 重新设置为平移
    xformMatrix.translate(Tx, 0.0, 0.0); // 在原来的设置上在进行平移
    var u_formMatrix = gl.getUniformLocation(gl.program, 'u_formMatrix'); // getUniformLocation
    gl.uniformMatrix4fv(u_formMatrix, false, xformMatrix.elements); // uniformMatrix4fv

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ]);
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
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