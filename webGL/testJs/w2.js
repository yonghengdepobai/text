/**
 * 缓冲区对象(buffer object), 它可以一次性地向着色器传入多个顶点数据。
 * 缓冲区对象是WebGL系统中的块内存区域，我们可以一次性地向缓冲区对象填充大量的顶点数据，
 * 然后将这些数据保存在其中，供顶点着色器使用
 */

 /**
  * 类型化数组 大量元素都是同一种类型 Float32Array是其中一种
  * 类型            每个元素所占字节数        描述(c语言中的数据类型)
  * Int8Array       1                   8位整型数(signed char)
  * UInt8Array      1                   8位无符号整型数(unsigned char)
  * Int16Array      2                   16位整型数 short
  * Uint16Array     2                   unsigned short
  * Int32Array      4                   int
  * UInt32Array     4                   unsigned int
  * Float32Array    4                   float
  * Float64Array    8                   双精度64位浮点数(double)
  * 
  * 与普通Array不同，类型化数组不支持push()和pop()方法
  * 方法属性和常量                          描述
  * get(index)                            获取第index个元素
  * set(index,value)                      设置第index个元素值为value
  * set(array, offset)                    从第offset个元素开始将数组array中的值填充进去
  * length                                数组长度
  * BYTES_PER_ELEMENT                     数组中第个元素所占的字节数
  * 创建类型数组的唯一方法就是用new
  * 
  */

  /**
   * 旋转
   * 旋转轴（图形将围绕旋转轴旋转）
   * 旋转方向（方向：顺时针或逆时针）
   * 旋转角度（图形旋转经过的角度） 不会传入一表示旋转方向的参数，默认遵循右手法则，如果旋转的角度是正值就是逆时针旋转
   */

   /**
    * 变换矩阵(transformation matrix)
    * 矩阵是一个二维数组，数字按照行（水平方向）和列（垂直方向排列
    * 矩阵和矢量的乘法
    * 矢量就是由多个分量组成的对象，比如顶点坐标(0.0, 0.5, 1.0)
    * [cosb -sinb 0]
    * [sinb cosb  0]
    * [0    0     1] ==> 旋转矩阵(3x3)
    * 
    * [cosb -sinb 0 0]
    * [sinb cosb  0 0]
    * [0    0     1 0]
    * [0    0     0 1] ==> 旋转矩阵(4x4)
    * 
    * [1 0 0 Tx]
    * [0 1 0 Ty]
    * [0 0 1 Tz]
    * [0 0 0 1] ==> 平移矩阵
    * 
    *   缩放 Sx, Sy, Sz 缩放因子
    * x' = Sx * x;
    * y' = Sy * y;
    * z' = Sz * z;
    * 
    * [Sx 0 0 0]
    * [0 Sy 0 0]
    * [0 0 Sz 0]
    * [0 0 0  1] ==> 缩放矩阵
    * 
    */

var Tx = 0.0, Ty = 0.5, Tz = 0.0;
var ANGLE = 90.0;
var Sx = 1.0, Sy = 1.5, Sz = 1.0;
  function main() {
    
    // 顶点着色器
    var VSHADER_SOURCE = `
    // x' = xcosb - ysinb; // b为旋转的角度 x'为旋转后的位置 x为原来的位置
    // y' = xsinb + ycosb;
    // z' = z;
        attribute vec4 a_Position;
        uniform vec4 u_Translation; // 控制平移的变量
        uniform float u_CosB, u_SinB;
        uniform mat4 u_xformMatrix;
        void main() {
            // gl_Position = a_Position + u_Translation;
            // gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
            // gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
            // gl_Position.z = a_Position.z;
            gl_Position = u_xformMatrix * a_Position;
            gl_Position.w = 1.0;
            // gl_PointSize = 10.0;
        }
    `;
    // 片元着色器
    var FSHADER_SOURCE =`
        precision mediump float;
        uniform vec4 u_FragColor;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE )) {
        console.log('failed initshader');
        return;
    }

    // 设置平移量 getUniformLocation getUniformLocation
    // var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    // gl.uniform4f(u_Translation, 0.5, 0.5, 0.0, 0.0);
    // 设置顶点
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed set point');
        return;
    }

    var radian = Math.PI * ANGLE / 180; // 转为弧度制
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    // 将旋转图形所需的数据传输给顶点着色器
    // var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    // var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    // gl.uniform1f(u_CosB, cosB);
    // gl.uniform1f(u_SinB, sinB);

    // 创建旋转矩阵
    // 注意WebGL和OpenGL一样其中矩阵是列主序的 js中没有专门的矩阵类型，所以用FLoat32Array来表示
    var xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    var xformMatrix2 = new Float32Array([ // 平移矩阵
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        Tx, Ty, Tz, 1.0,
    ]);
    var xformMatrix3 = new Float32Array([ // 缩放矩阵
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0,
    ])
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    // gl.uniform1f(u_xformMatrix, xformMatrix);
    /**
     * 1.location
     * 2.Transpose          在WebGL中必须指定为false
     * 3.array              待传输的类型化数组，4x4按列主序存在其中
     */
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix2);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个顶点
    // gl.drawArrays(gl.POINTS, 0, n); // n=3
    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // gl.drawArrays(gl.LINES, 0, n);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 四个点画矩形 
    

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
    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    // gl.deleteBuffer(vertexBuffer); 将创建的缓冲区对象删除
    if (!vertexBuffer) {
        console.log('failed to create the buffer object');
        return;
    }

    /**
     * 将缓冲区对象绑定WebGL系统中已经存在的‘目标(target)’上
     * 这个目标表示缓冲区对象的用途(在这里，就是向顶点着色器提供传给attribute变量的数据)，这样WebGL才能正确的处理其中的内容
     * 第一个参数target 参数可以是以下中的一个
     * gl.ARRAY_BUFFER          表示缓冲区对象中包含了顶点的数据
     * gl.ELEMENT_ARRAY_BUFFER  表示缓冲区对象中包含了顶点的索引值
     * 第二个buffer 创建的缓冲区对象
     * 帮助数据写入缓冲区
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    /**
     * 向缓冲区对象中写入数据
     * 第三个参数 表示程序将如何使用存储在缓冲区对象中的数据。该参数将帮助WebGL优化操作， 就算传错了值，也不会终止程序
     * gl.STATIC_DRAW           只会向缓冲区对象中写入一次数据，但需要绘制很多次
     * gl.STREAM_DRAW           只会向缓冲区对象中写入一次数据，然后绘制若干次
     * gl.DYNAMIC_DRAW          会向缓冲区对象中多次写入数据，并绘制很多次
     */
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    /**
     * 将缓冲区对象分配(实际上是缓冲区对象的引用或指针)给a_Position变量
     * 第一个参数 location              指定待分配attribute变量的存储位置
     * 第二个参数 size                  指定缓冲区中每个顶点的分量个数（1到4），如果不足其余自动补全
     * 第三个    type                   用以下类型之一来指定数据格式
     * gl.UNSIGNED_BYTE                 无符号字节，Uint8Array
     * gl.SHORT                         短整型，Int16Array
     * gl.UNSIGNED_SHORT                无符号短整型，Uint16Array
     * gl.Int                           整型，Int32Array
     * gl.UNSIGNED_INT                  无符号整型Uint32Array
     * gl.FLOAT                         浮点 Float32Array
     * 第四人参数 normalize              传入true或false,表明是否将非浮点型的数据归一化到[0,1]或[-1,1]区间
     * 第五个 stride                    指定相邻两个顶点间的字节数，默认为0
     * 第六个 offset                    指定缓冲区对象中的偏移量（以字节为单位）即attrbute变量从缓冲区的何处开始存储
     *                                 ，起始位置为0
     * 
     */
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量与分配给它的缓冲区对象 开启该变量
    gl.enableVertexAttribArray(a_Position);
    // gl.disableVertexArray(location) // 关闭分配

    return n;

}