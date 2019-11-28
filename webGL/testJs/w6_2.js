// 立方体
/**
 * gl.drawElements(mode, count, type, offset)
 * 参数
 * mode                     指定绘制的方式，可以接收以下常量符号gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP
 *                          gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN;
 * count                    指定绘制顶点的个数(整型) 顶点索引数组的长度
 * type                     指定索引值数据类型：gl.UNSIGNED_BYTE 或 gl.UNSIGNED_SHORT
 * offset                   指定索引数组中开始数组绘制的位置，以字节为单位
 * 
 * 我们需要将顶点索引（也就是三角形列表中的内容）写入到缓冲区中，并绑定到 gl.ELEMENT_ARRAY_BUFFER上，
 * 其过程类似于调用gl.drawArrays()时将顶点坐标写入缓冲区并将其绑定gl.ARRAY_BUFFER上的过程。也就是说
 * 可以继续使用gl.bindBuffer() 和 gl.bufferData() 来进行上述操作, 只不过参数targe要改为gl.ELEMENT_ARRAY_BUFFER
 * 
 * 
 */
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_MvpMatrix;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
    }
`;
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failde initShader');
        return;
    }

    var n = initVertexBuffers6_2(gl);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    var viewMatrix = new Matrix4();
    var modeMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    mvpMatrix.setPerspective(30, 1, 1, 100); // 设置透视投影
    mvpMatrix.lookAt(4, 4, 10, 0, 0, 0, 0, 1, 0); // 设置视图矩阵

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    /**
     * 调用gl.drawElements()时，WebGL首先从绑定gl.ELEMENT_ARRAY_BuFFER的缓冲区中获取顶点的索引值，
     * 然后根据该索引值，从绑定到gl.ARRAY_BUFFER的缓冲区中获取顶点的坐标，颜色等信息，然后传递给attribute变量
     */
}

function initVertexBuffers6_2(gl) {
    var verticesColor = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 白
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 白
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 白
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3 白
        1.0, -1.0, -1.0, 0.0, 0.0, 1.0, // v4 白
        1.0, 1.0, -1.0, 0.0, 1.0, 0.0, // v5 白
        -1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v6 白
        -1.0, -1.0, -1.0, 0.5, 0.5, 0.5, // v7 白
    ]);

    var vertices = new Float32Array([
        1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,   -1.0, -1.0, 1.0,   1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,   1.0, -1.0, 1.0,   1.0, -1.0, -1.0,   1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,   1.0, 1.0, -1.0,   -1.0, 1.0, -1.0,   -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,   -1.0, 1.0, -1.0,   -1.0, -1.0, -1.0,   -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,   1.0, -1.0, 1.0,   -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,   -1.0, -1.0, -1.0,   -1.0, 1.0, -1.0,   1.0, 1.0, -1.0,
    ]);
    // var vertices = new Float32Array([
    //     1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,   -1.0, -1.0, 1.0,   1.0, -1.0, 1.0,
    //     1.0, -1.0, -1.0,  1.0, 1.0, -1.0,  -1.0, 1.0, -1.0,  -1.0, -1.0, -1.0,
        
    // ]);
    var colors = new Float32Array([
        1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0,
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    ]);

    var colors = new Float32Array([
        1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0,
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    ]);

    // var colors = new Float32Array([
    //     1.0, 0.5, 1.0,
    //     1.0, 0.0, 1.0,
    //     1.0, 0.0, 0.0,
    //     1.0, 1.0, 0.0,
    //     0.0, 0.0, 1.0,
    //     0.5, 0.5, 0.5,
    // ]);

    // 顶点索引
    // var indices = new Uint8Array([
    //     0, 1, 2, 0, 2, 3, // 前 0123
    //     0, 3, 4, 0, 4, 5, // 右  0345
    //     0, 5, 6, 0, 6, 1, // 上  0561
    //     1, 6, 7, 1, 7, 2, // 左  1672
    //     7, 4, 3, 7, 3,2, // 下   7432
    //     4, 7, 6, 4, 6, 5, // 后  4765
    // ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        4, 5, 6, 4, 6, 7, // 右
        8, 9, 10, 8, 10, 11, // 上
        12, 13, 14, 12, 14, 15, // 左
        16, 17, 18, 16, 18,19, // 下
        20, 21, 22, 20, 22, 23, // 后
    ]);

    var vertexColorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();

    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) { return -1}
    if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) { return -1}

    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);

    var FSIZE = verticesColor.BYTES_PER_ELEMENT;

    // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6,   0);
    // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    // gl.enableVertexAttribArray(a_Position);
    // gl.enableVertexAttribArray(a_Color);

    // 将顶点索引数据写入缓冲区对象
    // gl.ELEMENT_ARRAY_BUFFER 三角列表索引(顶点索引值数据)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW); // enableVertexAttribArray
    return indices.length;

}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return true;

}