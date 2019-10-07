/**
 
渲染到纹理 将WebGL渲染的三维图形作作为纹理贴到别一个三维物体上去

帧缓冲区对象和渲染缓冲区对象
帧缓冲区对象（framebuffer object）可以用来代替颜色缓冲区或深度缓冲区
绘制在帧缓冲区并不会直接显示在<canvas>上,
绘制操作并不是直接发生在帧缓冲区中的，而是发生在帧缓冲区所关联的对象（attachment）上
一个帧缓冲区有三个关联对象：颜色关联对象（color attachment）、深度关联对象（depth attachment）和
模板关联对象（stencil attachment），分别用来替代颜色缓冲区、深度缓冲区和模板缓冲区
 可以先对帧缓冲区中的内容进行一些处理再显示，或者直接用内容作为纹理图像。
在帧缓冲区中进行绘制的过程又称为离屏绘制（offscreen drawing)

经过一些设置，WebGL就可以向帧缓冲区的关联对象中写入数据，就像写入颜色缓冲区或深度缓冲区
每个关联对象又可以是两种类型：纹理对象或渲染缓冲区对像（renderbuffer object）。
当我们把纹理对象作为颜色关联对象到帧缓冲区对象后，WebGL就可以在纹理对象中绘图
渲染缓冲区对象表示一种更加通用的的绘图区域，可以向其中写入多种类型的数据

如何实现渲染到纹理
我们希望把WebGL 渲染出来的图像作为纹理使用，那么就需要将纹理对像作为颜色关联对象关联到帧缓冲区对象上
然后在帧缓冲区中进行绘制，些时颜色关联对象（即纹理对象）就替代了颜色缓冲区。此时仍然需要进行隐藏面消除
所以又创建一个渲染缓冲区对象来作为帧缓冲区的深度关联对象，以替代深度缓冲区

分8个步骤
1.创建帧缓冲区对象（gl.createFramebuffer()）

2.创建纹理对象并设置其尺寸和参数（gl.createTexture(), gl.bindTexture(), gl.texImage2D(),
gl.Parameteri()）

3.创建渲染缓冲区对象（gl.createRenderbuffer()）

4.绑定渲染缓冲区对象并设置其尺寸（gl.bindRenderbuffer(), gl.renderbufferStroage()）

5.将帧缓冲区的颜色关联对象指定为一个纹理（gl.framebufferTexture2D()）

6.将帧缓冲区的深度关联对象指定为一个渲染缓冲区对象（gl.framebufferRenderbuffer()）

7.检查帧缓冲区是否正确配置（gl.checkFramebufferStatus()）

8.在帧缓冲区中进行绘制（gl.bindFramebuffer()）.


 */

 var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    uniform mat4 u_MvpMatrix;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_TexCoord = a_TexCoord;
    }
 `;
 var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D u_Sampler;
    uniform float isFrist;
    varying vec2 v_TexCoord;
    void main() {
        vec4 color = texture2D(u_Sampler, v_TexCoord);
        if (isFrist == 1.0) {
            // color = vec4(1.0, 0.3, 0.4, 1.0);
        } else {
            // color = vec4(0.4, 0.8, 0.7, 1.0);
        }
        gl_FragColor = color;
    }
 `

 var OFFSCREEN_WIDTH = 256;
 var OFFSCREEN_HEIGHT = 256;
 function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) { console.log('failed gl'); return;   }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed initShader'); return;
    }

    var program = gl.program;
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    program.isFrist = gl.getUniformLocation(program, 'isFrist');

    // var cube = initVertexBuffers_9_2(gl);
    var cube = initVertexBuffersForCube(gl);
    var plane = initVertexBuffersForPlane(gl);


    var texture = initTextures(gl);

    var fbo = initFramebufferObject(gl); 

    gl.enable(gl.DEPTH_TEST);

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100);
    viewProjMatrix.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    var viewProjMatrixFBO = new Matrix4();
    viewProjMatrixFBO.setPerspective(30, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100);
    viewProjMatrixFBO.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    var currentAngle = 0.0;
    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, canvas, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO);
        requestAnimationFrame(tick, canvas);
    }
    tick()
 }

 function initVertexBuffersForCube(gl) {
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
    ...oneVertix[0],  ...oneVertix[1],  ...oneVertix[2],  ...oneVertix[3],
    ...oneVertix[4],  ...oneVertix[5],  ...oneVertix[6],  ...oneVertix[7],
    ...oneVertix[0],  ...oneVertix[1],  ...oneVertix[5],  ...oneVertix[4],
    ...oneVertix[3],  ...oneVertix[2],  ...oneVertix[6],  ...oneVertix[7],
    ...oneVertix[1],  ...oneVertix[2],  ...oneVertix[6],  ...oneVertix[5],
    ...oneVertix[0],  ...oneVertix[3],  ...oneVertix[7],  ...oneVertix[4],
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


    var texCoordArr = [ [1.0, 1.0],   [0.0, 1.0],   [0.0, 0.0],   [1.0, 0.0],]
    var texCoords = new Float32Array([   // Texture coordinates
        ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
        ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
        ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
        ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
        ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
        ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    ]);

    var index = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
     ]);

     var o = new Object();

     o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
     o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
     o.indexBuffer = initElementArrayBufferForLaterUse(gl, index, gl.UNSIGNED_BYTE);

     o.numIndex = index.length;

     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

     return o;
 }

 function initVertexBuffersForPlane(gl) {
    //  create face
    // v1------v0
    // |        |
    // |        |
    // |        |
    // v2------v4

    var vetices = new Float32Array([
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0
    ])

    var texCoords = new Float32Array([
        1.0, 1.0,  0.0, 1.0, 0.0, 0.0, 1.0, 0.0
    ])

    var index = new Uint8Array([
        0, 1, 2, 0, 2, 3
    ])

    var o = new Object();

    o.vertexBuffer = initArrayBufferForLaterUse(gl, vetices, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, index, gl.UNSIGNED_BYTE);

    o.numIndex = index.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return o;
 }

 function initArrayBufferForLaterUse(gl, data, num, type) {
     var buffer = gl.createBuffer();

     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

     buffer.num = num;
     buffer.type = type;
     return buffer;
 }

 function initElementArrayBufferForLaterUse(gl, data, type) {
     var buffer = gl.createBuffer();

     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
     buffer.type = type;
     return buffer;
 }

 function initTextures(gl) {
     var texture = gl.createTexture();

     var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

     var image = new Image();
     image.onload = function() {
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.bindTexture(gl.TEXTURE_2D, texture);
         
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

         gl.uniform1i(u_Sampler, 0);
         gl.bindTexture(gl.TEXTURE_2D, null);

     }
     image.src = '../webGL/WebGL_Guide_Code/resources/sky_cloud.jpg';
     return texture;
 }

 function initFramebufferObject(gl) {
     var framebuffer, texture, depthBuffer;

    framebuffer = gl.createFramebuffer(); // // 创建帧缓冲区对象

    // 创建纹理对象变设置其尺寸和参数
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA,
        gl.UNSIGNED_BYTE, null);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA,
    //         gl.UNSIGNED_BYTE, null);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    framebuffer.texture = texture; // 存储纹理对象

    depthBuffer = gl.createRenderbuffer(); // 创建渲染缓冲区

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // 绑定渲染缓冲区
    // 设置尺寸
    /**
     * gl.renderbufferStorage(taget, internalformat, width, height)
     * target必须为gl.RENDERBUFFER
     * internalformat 指定渲染缓冲区的数据格式
     *                  gl.DEPTH_COMPONENT16G表示渲染缓冲区指替代深度缓冲区
     *                  gl.STENCIL_INDEXS   表示渲染缓冲区将替代模板缓冲区
     *                  gl. RGBA4    表示渲染缓冲区将替代颜色颜色缓冲区 
     *                  gl.RGB5_A1  RGBA4表示4个分量各占据4个比特 RGB5_A1 rgb各5个比特a一个比特
     *                  gl.RGB565   rgb分另占据5，6，5个比物
     * width和height指定渲染缓冲区的高度和宽以像素为单位
     */
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    /**
     * gl.bindFramebuffer(target, framebuffer)
     * 将framebuffer指定的帧缓冲区对象绑定到target目标上，如果framebuffer为空，那么已绑定到target目标上的
     * 帧缓冲区对象将被解除绑定
     * target必须为gl.FRAMEBUFFER
     */
    gl.bindFramebuffer(gl.FRAMEBUFFER,  framebuffer); // 绑定帧缓冲区对象
    // 将帧缓冲区对象的颜色关联对象指定为一个纹理对象
    /**
     * gl.framebufferTexture2D(target, attachment, textarget, texture, 0);
     * target必须为gl.FRAMEBUFFER
     * attachment   指定关联的类型
     *              gl.COLOR_ATTACHMENT0    表示texture是颜色关联对象
     *              gl.DEPTH_ATTACHMENT     表示texture是深度关联对象
     */
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    // 将帧缓冲区对象的深度关联对象指定为一个一个渲染缓冲区
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // 检查帧缓冲区对象是否配置正确
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    console.log(e, gl.FRAMEBUFFER_COMPLETE !== e);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // gl.bindTexture(gl.TEXTURE_2D, null);
    // gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;

 }

 function draw(gl, canvas, fbo, plane, cube, angle, texture, viewProjMatrix, viewProjMatrixFBO) {
     gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
     gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

     gl.clearColor(0.2, 0.2, 0.4, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //  怎么确定图形画入了帧缓冲区 gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);？
     drawTexturedCube(gl, gl.program, cube, angle, texture, viewProjMatrixFBO);

     gl.bindFramebuffer(gl.FRAMEBUFFER, null);
     gl.viewport(0, 0, canvas.width, canvas.height);

     gl.clearColor(0.0, 0.0, 0.0, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //  console.log(texture, fbo.texture);
     drawTexturedPlane(gl, gl.program, plane, angle, fbo.texture, viewProjMatrix);
 }

 var g_modelMatrix = new Matrix4();
 var g_mvpMatrix = new Matrix4();

 function drawTexturedCube(gl, program, o, angle, texture, viewProjMatrix) {
     g_modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0);
     g_modelMatrix.rotate(angle, 0, 1, 0);

     g_mvpMatrix.set(viewProjMatrix);
     g_mvpMatrix.multiply(g_modelMatrix);
     gl.uniform1f(program.isFrist, 1.0);
     gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    //  console.log(o);
     drawTexturedObject(gl, program, o, texture);
 }

 function drawTexturedPlane(gl, program, o, angle, texture, viewProjMatrix) {
    g_mvpMatrix.setTranslate(0, 0, 1);
    g_modelMatrix.rotate(20.0, 1.0, 0.0, 0.0);
    g_modelMatrix.rotate(angle, 0, 1, 0);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    // console.log(g_mvpMatrix.elements);
    gl.uniform1f(program.isFrist, 2.0);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    drawTexturedObject(gl, program, o, texture);
 }

 function drawTexturedObject( gl, program, o, texture) {
     initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
     initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);

     gl.activeTexture(gl.TEXTURE0);
     gl.bindTexture(gl.TEXTURE_2D, texture);

     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
    //  console.log(gl.TRIANGLES, o, 0);
     gl.drawElements(gl.TRIANGLES, o.numIndex, o.indexBuffer.type, 0);
 }

 function initAttributeVariable(gl, a_attribute, buffer) {
    //  console.log(buffer);
     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
     gl.enableVertexAttribArray(a_attribute);
 }

 var ANGLE_STEP = 30;
 var last = Date.now();
 function animate(angle) {
     var now = Date.now();
     var elapsed = now - last;
     last = now;
     var newAngle = angle + (elapsed * ANGLE_STEP) / 1000;
     return newAngle % 360;
 }