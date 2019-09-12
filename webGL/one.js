// WebGL Web Graphics Library 是一种3D绘图协议
// shader 着色器 OpenGL Shader Language GLSL

/**
 * WebGL坐标系统
 * 使用三维坐标系统（笛卡尔坐标系）
 * 在WebGL中，当你面向屏幕时 X 轴是水平方向的（正方向为右），Y 轴是垂直的（正方向为上），而 Z 轴垂直于屏幕（正方向为外）
 * 
 * WebGL的坐标系和<canvas>绘图区的坐标不同，对应关系如下
 * <canvase> 的中心点：（0.0, 0.0, 0.0);
 * <canvase> 的上边缘和下边缘：(1.0, 0.0, 0.0) 和 (-1.0, 0.0, 0.0)
 * <canvase> 的左边缘和右边缘：(-1.0, 0.0, 0.0) 和 (1.0, 0.0, 0.0)
 * 
 */


function main() {
    var canvas = document.getElementById('webgl');

    // webgl依赖于着色器(shader) 有两种

    /**
     * 着色器是以字符串的形式‘嵌入’在javascript文件中的，在程序开始前就设置好
     * 1顶点着色器(Vertex shader)：顶点着色器是用来描述顶点特性（如位置、颜色等）的程序。
     * 顶点(Vertex)是指二维或三维空间中的一个点，比如二维或三维图形的端点或交点
     * 2 片元着色器(Fragment shader)：进行逐片元处理过程如光照的程序。
     * 片元(fragment)是一个WebGL术语，可以理解为像素（图片的单元）
     */

    // 顶点着色器程序（GLSL ES语言）
    var VSHADER_SOURCE = `
        // attribute变量传输的是那些与顶点相关的数据 
        // 步骤 1声明 关键词attribute被称为存储限定符(storage qualifier) vec4 类型 a_Position 变量名
        //  2 赋值给gl_Position变量 3向attribute变量传输数据
        attribute vec4 a_Position; // 位置
        attribute float a_PointSize;
        void main() { 
            // vec4 矢量vector 表示由四个浮点数组成的矢量 是一种数据类型
            // 齐次坐标(x, y, z, w) 等价于三维坐标(x/w, y/w, z/w); w必须大于等于0
            // 齐次坐标的存在，使得用矩阵乘法来描述顶点变换成为可能
            // gl_Position = vec4(0.0, 0.0 , 0.0, 1.0); // 设置坐标 这个是必须的
            gl_Position = a_Position;
            // gl_PointSize = 10.0; // 设置尺寸 可选默认为1.0 float类型
            gl_PointSize = a_PointSize;

            // uniform变量传输的是那些对于所有顶点相同（或与顶点无关）的数据。

        }
    `;

    // 片元着色程序
    var FSHADER_SOURCE = `
        precision mediump float; // 指定浮点类型精度
        uniform  vec4 u_FragColor;
        void main() {
            // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 设置颜色
            gl_FragColor = u_FragColor;
        }
    `;

    // 获取webgl绘图上下文
    var gl = getWebGLContext(canvas); // 封装 canvas.getContext('webgl') 闭免浏览器差异
    if (!gl) {
        console.log('failed to get the rendering context for WebGL');
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed to initialize shaders');
        return;
    }

    // 获取attribute变量的存储位置
    /**
     * 第一个参数是一个程序对象(program object), 它包括了顶点着色器和片元着色器 在initShaders之后访问gl..program
     * 因为initShaders()创建了这一个对象
     * 第二个参数是想要获取的存储变量attribute变量的名称
     * 返回值是attribute变量的存储地址
     */
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('failed to get the storge location of a_Position')
        return;
    }
    /**
     * 将顶点位置传输给attribute变量 这里也可传入最一个参数 1.0 
     * 命名规范gl.vertexAttrib 基础函数名 3 矢量元素个数 f参数类型
     */
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    // var position = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    // gl.vertexAttrib4fv(a_Position, position);

    // 获取u_FragColor变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    console.log(u_FragColor);

    // 注册鼠标点击事件响应函数
    canvas.onmousedown = function(ev) {
        // canvas.onmousemove = function(ee) {
        //     console.log(ev);
        //     Mclick(ee, gl, canvas, a_Position);
        // }
        Mclick(ev, gl, canvas, a_Position, u_FragColor);
    }
    // canvas.onmouseup = function(e) {
    //     canvas.removeEventListener('onmousemove');
    // }


    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 5.0);

    // 指定清空<canvas>的颜色 指定后会存在WebGL系统中在下一次调用这个方法前不会变
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // 参数rgba 从0.0到1.0

    // 清空<canvas> gl.clear()用之前指定的背景色清空
    gl.clear(gl.COLOR_BUFFER_BIT); // 传入gl.COLOR_BUFFER_BIT是通知清空颜色缓冲区 它还有其它缓冲区
    // gl.DEPTH_BUFFER_BIT 指定深度缓冲区 gl.STENCIL_BUFFER_BIT 指定模板缓冲区
    // 如果没有指定它会使用默认值

    // 绘制一个点
    /**
     * gl.drawArrays(mode, first, count) 执行顶点着色器， 按照mode参数指定的方式绘制图形
     *  point 点 lines 线 strip 带，条状物 loop 一直 triangle三角形
     * mode                 指定绘制方式，可接收以下常量符号：gl.POINTS, gl.LINES(线段), gl.LINE_STRIP(线条)),
     *                       gl.LINE_LOOP(回路，一系列连接的线段),
     *                      gl.TRIANGLES(三角形，如果点的个数不是三的倍数最后的点会被忽略),
     *                      gl.TRIANGLE_STRIP(三角带),
     *                       gl.TREANGLE_FAN(三角扇);
     * first                指定从哪个顶点开始绘制(整数型)
     * count                指定绘制需要用到多少个顶点（整数型）
     * 
     */
    gl.drawArrays(gl.POINTS, 0, 1);

}

var g_points = []; // 鼠标点击位置数组
var g_colors = []; // 存储点颜色
function  Mclick(ev, gl, canvas, a_Position, u_FragColor) {
    // g_points = [];
    var x = ev.clientX; // 鼠标点处理x坐标
    var y = ev.clientY; // 鼠标点击处理y坐标
    var rect = ev.target.getBoundingClientRect();
    y  = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2); // 将位置转换为对应的0.0到1.0坐标系
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2)

    // 将坐标存储到g_points数组中
    g_points.push([x, y]);
    if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]); // 红
    } else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]); // 绿
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]); // 白
    }

    // 清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0, len = g_points.length; i < len; i++) {
        // 将点的位置传递到变量a_Position中
        var rgba = g_colors[i];
        gl.vertexAttrib3f(a_Position, g_points[i][0], g_points[i][1], 0.0);
        // 设置颜色
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function main_1() {
    // Retrieve(检索) the canvas elemetn
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('failed......');
        return false;
    }

    // Get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    // Draw a blue rectangle(矩形)
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // set a blue color
    ctx.fillRect(120, 60, 150, 150); // Fill a rectangle with the color 参数分别代表位置(相对于原点)，和大小

}
