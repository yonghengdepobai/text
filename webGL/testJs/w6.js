// 三维图形也是二维图形（特别是三角形）构成的
// 绘制三维图形时，还得考虑他们的深度信息（depth information）

// 我们最后还是得把三维场绘制到二维的屏幕上，即绘制观察者看到的世界，而观察可以处在任意位置观察
/**
 * 定义观察者
 * 观察方向，即观察者自已所处的位置，在看场景的哪一部分
 * 可视距离，即观察者能看多远
 * 将观察者所处的位置称为视点（eye point）,从视点出发沿着观察者方向的射线称作视线（viewing direction）
 * 
 * 观察者状态
 * 一、 视点 观察者所在的三维空间中位置，视线的起点。(eyeX, eyeY, eyeZ)
 * 二、观察目标点 look-at point, 即被观察目标所在的点，它可以用来确定视线
 * 视线从视点出发，穿过观察目标点并继续延伸。 注意 观察目标点是一个点，而不是视线的方向，只有同时知道观察目标点和视点，
 * 才能算出视线方向。观察点坐标用(atX, atY, atZ)表示
 * 三、上方向 最终绘制在屏上的影像中的向上的方向。 试想，如果仅仅确定了视点和观察点，观察者还是可能以视线为轴旋转的
 * （头部偏移会导致观察到的场景也偏移）。所以为了将观察者固定，我们要指定上方向 用(upX, upY, upZ)表示
 * 
 * 在WebGL中 我们可以用上述三个矢量创建一个视图矩阵（view matrix）, 然后将该矩阵传到顶点着色器。
 * 视图矩阵可以表示观察者的状态，它最终影响显示在屏幕上的视图，也就观察者观察到的场景
 * cuon-matrix.js 提供Matrix4.setLookAt() 可以根据上述三个矢量 来创建出视图矩阵
 * 
 * 在WebGL中，观察者的默认状态
 * 视点位于坐标系统原点(0, 0, 0)
 * 视线为z轴负方向，观察点为(0, 0, -1)
 * 上方向为y轴负方向即(0, 1, 0)
 * var initViewMatrix = new Matrix4();
 * initViewMatrix.setLookAt(0, 0, 0, 0, 0, -1, 0, 1, 0);
 */

 /**
  * 模型矩阵：平移、旋转、缩放等基本变换矩阵或它们的组合
  * 视图矩阵 和模型矩阵的顺序
  * <新坐标> = <视图矩阵> x <模型矩阵> x <原始顶点的坐标>
  */

  /**
   * 可视空间
   * 长方体可视空间，也称盒状空间，由正射投影（orthographic projection）产生
   * 盒状可视空间由前后两个矩形表面确定，分别称 近裁减面（near clipping plance）和 远裁减面（far clipping plance)
   * 前者的四个顶点为（right, top, -near）,(-left, top, -near), (-left, -bottom, -naer), (right, -bottom, -near)
   * 后者的四个顶点为（right, top, far), (-left, top, far), (-left, -bottom, far), (right, -bottom, far).
   * 
   * 定义盒状可视空间 又称为规范立方体（canonical View Volume）
   * cuon-matrix.js 提供 Matrix4.setOrtho() 方法用来设置投影矩阵
   * Matrix4.setOrtho(left, right, bottom, top, near, far)
   * 通过合参数计算正射投影，注意left和right可以不相等
   * left,right     指定近裁剪面的左边界和右边界
   * bottom, top    指定近裁剪面的下边和上边界
   * near, far      指定近裁剪面的和远裁剪面的位置，即可视空间的近边界和远边界
   * 这个矩阵被称为正投影矩阵（orthographic progjection matrix）
   * 
   * 四棱锥 / 金字塔可视空间，由透视投影（perspective projection）产生
   * 透视投影也有视点，视线、近裁面和远裁面
   * Matrix4.setPerspective(fov, aspect, near, far);
   * fov            指定垂直视角，即可视空间顶面和底面的夹角，必须大于0
   * aspect         指定近裁面的高宽比（宽度 / 高度）
   * near, far      远，近裁面的位置
   * 透视投影矩阵（perspective projection matrix）
   * 
   * 
   */

/**
 * 共冶一炉（模型矩阵、视图矩阵和投影矩阵）
 * <视图矩阵> x <模型矩阵> x <顶点的坐标>
 * <投影矩阵> x <视图矩阵> x <顶点坐标>
 * <投影矩阵> x <视图矩阵> x <模型矩阵> x <顶点的坐标>
 */

 /**
  * 隐藏面消除
  * WebGL提供了 隐藏面消除（hidden surface removal）功能。 这个功能会帮助我们消除那些被遮挡的表面，
  * 这样就可以放心绘制场景不必担心物体在缓冲区的顺序
  * 1.开启隐藏面消除功能
  * gl.enable(gl.DEPTH_TEST);
  * 参数 gl.DEPTH_TEST              隐藏面消除
  *     gl.BLEND                   混合
  *     gl.POLYGON_OFFSET_FILL      多边形位移
  * 
  * 2.在绘制之前，清除深度缓冲区（depth buffer）
  * 深度缓冲区是一个中间对象，其作用是帮助WebGL进行隐藏面消除
  * WebGL在颜色缓冲区绘制几何图形，绘制完成后将颜色缓冲显示到<canvas>上
  * gl.clear(gl.DEPTH_BUFFER_BIT);
  */

  /**
   * 深度冲突（Z fighting）
   * 当几何图形或物体的两个表面极为接近时，就会出现新的问题，使得表面看上去斑斑驳驳的
   * 之所以会产生深度冲突，是因为两个表面过于接近，深度缓冲区有限的精度已经不能区分哪个在前，哪个在后了
   * WebGL 提供一种被称为 多边形偏移（polygon offset）的机制来解决这个问题。
   * 该机制将自动在z值加上一个偏移量，偏移量的值由物体表面相对于观察者视线的角度来确定。
   * 启用该机制：
   * 1.启用多边形偏移
   * gl.enable(gl.POLYGON_OFFSET_FILL);
   * 2.在绘制之前指定用来计算偏移量的参数
   * gl.polygonOffset(1.0, 1.0);
   *   gl.polygonOffset(factor, units);// 指定加到每个顶点绘制后z值上的偏移量
   * 偏移量按照公式 m * factor + r * units 计算 m表示顶点所在表面相对于观察者的视线的角度，
   * 而r 表示硬件能够分两个z值这差的最小值
   * 
   */

// precision mediump float;
 var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ModelViewMatrix; // 将矩阵在外面处理好
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main() {
        // gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
        // gl_Position = u_ModelViewMatrix * a_Position;
        // gl_Position = u_ProjMatrix * u_ModelViewMatrix * a_Position;
        // gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
    }
 `;

 var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor =  v_Color;
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
 `

 function main() {
    var canvas = document.getElementById('webgl');
    var nf = document.getElementById('nearFar');
    console.log(nf);
    var gl = getWebGLContext(canvas); //
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed initShaders')
        return;
    }

    var n = initVertexBuffers6(gl);

    // 获取 u_ViewMatrix地址
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); // u_ModelViewMatrix
    var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    // 设置视点、观察点、上方向
    var viewMatrix = new Matrix4();
    var modelMatrix = new Matrix4();
    var modelViewMatrix = new Matrix4();
    var projMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    // 视图
    // viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    
    // 模型
    // modelMatrix.setRotate(-10, 0, 0, 1);
    modelMatrix.setTranslate(0.75, 0, 0); // 平移

    // 视图 + 模型
    // var modelViewMatrix = viewMatrix.multiply(modelMatrix);
    modelViewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);

    // 投影 
    // projMatrix.setOrtho(-1.0, 1.0, -1.0, 0.0, 0.0, 2.0);
    // projMatrix.setOrtho(-1.0, 1.0, -1.0, 0.0, 0.0, 0.5);
    // projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, 0.0, 0.5);
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);

    // 投影 + 视图 + 模型
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // document.onkeydown = function(ev) {
    //     keydown(ev, gl, n, modelViewMatrix, u_ModelViewMatrix, nf);
    // }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, n); // triangles

    modelMatrix.setTranslate(-0.75, 0, 0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n); // triangles


 }

 function initVertexBuffers6(gl) {
     var verticesColors = new Float32Array([
         0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角 最后面
         -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
         0.5, -0.5, -0.4, 0.4, 1.0, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 黄色中间
        -0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        0.0, -0.6, -0.2, 1.0, 0.4, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 蓝色 最前面
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
     ]);

     var verticesColors = new Float32Array([

        0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // 绿色三角 最后面
       1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
       0.25, -1.0, -4.0, 0.4, 1.0, 0.4,

       0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // 黄色中间
       0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
       1.25, -1.0, -2.0, 1.0, 1.0, 0.4,

       0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // 蓝色 最前面
       0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
       1.25, -1.0, 0.0, 0.4, 0.4, 1.0,

       -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // 绿色三角 最后面
       -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
       -0.25, -1.0, -4.0, 0.4, 1.0, 0.4,

       -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // 黄色中间
       -0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
      -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,

       -0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // 蓝色 最前面
       -0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
       -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,

    ]);

    var verticesColors = new Float32Array([
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // 绿色三角 最后面
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
 
        0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // 黄色中间
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
 
        0.0, 1.0, 0.0, 0.4, 0.4, 1.0, // 蓝色 最前面
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
    ]);

    var verticesColors = new Float32Array([

        0.0, 1.0, 0.0, 0.4, 0.4, 1.0, // 蓝色 最前面
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 0.4, 0.4, 1.0,

        0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // 黄色中间
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 1.0, 0.4,

        0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // 绿色三角 最后面
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
    ]);
    var verticesColors = new Float32Array([

        0.0, 1.0, 0.5, 0.4, 0.4, 1.0, // 蓝色 最前面
        -0.5, -1.0, 0.5, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.5, 0.4, 0.4, 1.0,

        0.0, 1.0, 0.5, 1.0, 1.0, 0.4, // 黄色中间
        -0.5, -1.0, 0.5, 1.0, 1.0, 0.4,
        0.5, -1.0, 0.5, 1.0, 1.0, 0.4,

        0.0, 1.0, 0.5, 0.4, 1.0, 0.4, // 绿色三角 最后面
        -0.5, -1.0, 0.5, 0.4, 1.0, 0.4,
        0.5, -1.0, 0.5, 0.4, 1.0, 0.4,
    ]);

     var n = 9;
    //  var n = 18;
     var FSIZE = verticesColors.BYTES_PER_ELEMENT;
     var vertexColorbuffer = gl.createBuffer();

     gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
     gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
     var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
     var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
     console.log(a_Color);
     gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
     gl.enableVertexAttribArray(a_Position);
     gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
     gl.enableVertexAttribArray(a_Color);

     return n;
 }

 var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // 视点
 var g_near = 0.0, g_far = 0.5;
 function keydown(ev, gl, n, modelViewMatrix, u_ModelViewMatrix, nf) {
    if (ev.keyCode == 39) { // 按下右键
        g_eyeX += 0.01;
    } else
    if (ev.keyCode == 37) { // 按下左键
        g_eyeX -= 0.01;
    } else { return; };
    // switch(ev.keyCode) {
    //     case 39: g_near += 0.01; break;
    //     case 37: g_near -= 0.01; break;
    //     case 38: g_far += 0.01; break;
    //     case 40: g_far -= 0.01; break;
    //     default: return; //
    // }
    draw(gl, n, u_ModelViewMatrix, modelViewMatrix, nf);
 }

 function draw(gl, n, u_ModelViewMatrix, modelViewMatrix, nf) {
    //  设置视点视线
    modelViewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

    // 使用矩阵设置可视空间
    // modelViewMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);

    nf.innerHTML = `near: ${Math.round(g_near * 100) / 100}, far: ${Math.round(g_far * 100) / 100} `

    // 将数据传入顶点着色器
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n); // triangles

 }

