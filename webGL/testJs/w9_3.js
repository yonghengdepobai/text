/**
    太阳看不见阴影。如果在光源处放置一位观察者，其视线方向与光线一致，那么观察者也看不到阴影。
    他看到的每一处都在光的照射下，而那些背后的，他没有看到的物体则处在阴影中
    这里，需要用到光源与物体之间的距离（实际上就是物体在光源坐标系下的深度z值）来决定物体是否可见


    需要使用两对着色器以实现阴影：（1）一对着色器用来计算光源到物体的距离，（2）另一对着色器根据（1）中计算出的距离
    绘制场景。使用一张纹理图像把（1）的结果传入（2），这张纹理图就被称为阴影贴图（shadow map），而通过阴影图实现阴影的方法就
    被称为阴影映射（shadow mapping）。
    阴影映射分为两步：
    1. 将视点移到光源的位置处，并运行（1）中的着色器。这时，那些“将要被绘出”的片元都是被光照射到的，即落在这个像素上的各个片元
    中最前面的。我们并不实际地绘制出片元的颜色，而将片的Z值写入到阴影贴图中
    2. 将视点移回原来的位置，运行（2）中的着色器绘制场景。此时，计算出每个片元在光源（即（1）中的视点坐标系）下的坐标，并与阴影
    贴图中记录的z值比较，如果前者大于后者，就说明当前片处在阴影中，用较深暗的颜色绘制

 */

//  这两个着色器负责生成阴影贴图
 var SHADOW_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_MvpMatrix;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
    }
 `;

//  着色器会将每个片元的z值写入帧缓冲区
 var SHADOW_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    void main() {
        // gl_FragCoord 内置变量（vec4）表示每个片元的坐标xyz
        // (gl_Position.xyz / gl_Position.w) / 2.0 + 0.5 计算出gl_FragCoord 是归一化了的坐标
        // 如果gl_FragCoord.z 是0.0，则表示该片元在近裁剪面上，如果是1.0，则表示片元在远裁剪面上
        gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0); // 给阴影纹理设置颜色

        // 提高精度
        const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0);
        const vect bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
        // fract(x) 返回x的小数部分
        vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
        rgbaDepth -= rgbaDepth.gbaa * bitMask;
        gl_FragColor = rgbaDepth;

    }
 `

 var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix; // 视点处于原处的模型视图投影矩阵
    uniform mat4 u_MvpMatrixFromLight; // 视点位于光源处的模型视图投影矩阵
    varying vec4 v_PositionFromLight;
    varying vec4 v_Color;
    void main() {

        gl_Position = u_MvpMatrix * a_Position; // 顶点坐标位置
        v_PositionFromLight = u_MvpMatrixFromLight * a_Position;
        v_Color = a_Color;
    }
 `;
 var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D u_ShadowMap;
    varying vec4 v_PositionFromLight;
    varying vec4 v_Color;

    float unpackDepth(const in vec4 rgbaDepth) {
        const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
        float depth dot(rgbaDepth, bitShift);
        return depth;
    }

    void main() {
        // 因为WebGL中的x,y坐标是[-1.0,1.0] 而纹理坐标s,t是在[0,1]的区间中的
        vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
        vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
        // float depth = rgbaDepth.r;
        float depth = unpackDepth(rgbaDepth);
        // 比较片元在光源坐标下的z值和阴影贴图中对应的值来决定当前片元是否处在阴影之中
        // 0.005是一个偏移量 如果不加矩形平面就会出条带， 又叫马赫带（Mach band）
        // 产生的原因是因为两边的精度不一 纹理图RGBA分量中，每个分量都是8位那z值的精度也是8位
        // 而shadowCoord.z是float类型的有16位 偏移量应当略大于精度
        // float visibility = (shadowCoord.z > depth) ? 0.7 : 1.0;
        float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;
        gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
    }
 `

 var OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
//  var LIGHT_X = 0, LIGHT_Y = 7, LGIHT_Z = 2;
 var LIGHT_X = 0, LIGHT_Y = 40, LGIHT_Z = 2;

 function main() {
     var canvas = document.getElementById('webgl');
     var gl = getWebGLContext(canvas);
     if (!gl) {console.log('failed gl'); return;}

     var shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
     shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
     shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');
     if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
         console.log('failed shadow a_Position | u_MvpMatrix'); return;
     }

     var normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
     normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
     normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
     normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
     normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');
     normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap')
     if (normalProgram.a_Position < 0 || normalProgram.a_Color < 0 || !normalProgram.u_MvpMatrix
        || !normalProgram.u_MvpMatrixFromLight || !normalProgram.u_ShadowMap) {
            console.log('failed noraml a_Position | a_color | u_MvpMatrix | u_MvpMatrixFromLight');
            return;
    }
    
    var triangle = initVertexBufferForTriangle(gl);
    var plane = initVertexBuffersForPlane(gl);
    if (!triangle || ! plane) {console.log('failed triangle | plane'); return}

    var fbo = initFrameBufferObject(gl);
    if (!fbo) {console.log('failed init fbo'); return}

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    var viewProjMatrixFromLight = new Matrix4();
    viewProjMatrixFromLight.setPerspective(70, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
    viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LGIHT_Z, 0, 0, 0, 0, 1, 0);

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(45, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(0, 7, 9, 0, 0, 0, 0, 1, 0);

    var currentAngle = 0;
    var mvpMatrixFromlight_t = new Matrix4()
    var mvpMatrixFromlight_p = new Matrix4();

    var tick = function() {
        currentAngle = animate(currentAngle);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(shadowProgram);

        drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight); // 影三角
        mvpMatrixFromlight_t.set(g_mvpMatrix);
        drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);
        mvpMatrixFromlight_p.set(g_mvpMatrix);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(normalProgram);
        gl.uniform1i(normalProgram.u_ShadowMap, 0);

        gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromlight_t.elements);
        drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix); // 彩三角
        gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromlight_p.elements);
        drawPlane(gl, normalProgram, plane, viewProjMatrix);

        requestAnimationFrame(tick, canvas);

    }
    tick();

 }

 var g_modelMatrix = new Matrix4();
 var g_mvpMatrix = new Matrix4();

 function drawTriangle(gl, program, triangle, angle, viewProjMatrix) {
    //  console.log(program);
    g_modelMatrix.setRotate(angle, 0, 1, 0);
     draw(gl, program, triangle, viewProjMatrix);
 }

 function drawPlane(gl, program, plane, viewProjMatrix) {
    g_modelMatrix.setRotate(-45, 0, 1, 1);
     draw(gl, program, plane, viewProjMatrix);
 }

 function draw(gl, program, o, viewProjMatrix) {
     initAttributevariable(gl, program.a_Position, o.vertexBuffer);
     if (program.a_Color != undefined) {
         initAttributevariable(gl, program.a_Color, o.colorBuffer);
     }

     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

     g_mvpMatrix.set(viewProjMatrix);
     g_mvpMatrix.multiply(g_modelMatrix);
     gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

     gl.drawElements(gl.TRIANGLES, o.numIndex, gl.UNSIGNED_BYTE, 0);

 }

 function initAttributevariable(gl, a_attribute, buffer) {
     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
     gl.enableVertexAttribArray(a_attribute);
 }

 function initVertexBuffersForPlane(gl) {
     // Create a plane
  //  v1------v0
  //  |        | 
  //  |        |
  //  |        |
  //  v2------v3

    var vertices = new Float32Array([
        3.0, -1.7, 2.5, -3.0, -1.7, 2.5, -3.0, -1.7, -2.5, 3.0, -1.7, -2.5, 
    ])

    var colors = new Float32Array([
        1.0, 1.0, 1.0,      1.0, 1.0, 1.0,      1.0, 1.0, 1.0,      1.0, 1.0, 1.0,
    ])

    var index = new Uint8Array([0, 1, 2, 0, 2, 3]);

    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, index, gl.UNSIGNED_BYTE);

    if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) {return null}

    o.numIndex = index.length;
    
    return o;

 }

 function initVertexBufferForTriangle(gl) {
     // Create a triangle
  //       v2
  //      / | 
  //     /  |
  //    /   |
  //  v0----v1

    var vertices = new Float32Array([-0.8, 3.5, 0.0, 0.8, 3.5, 0.0, 0.0, 3.5, 1.8]);

    var colors = new Float32Array([1.0, 0.5, 0.0,   1.0, 0.5, 0.0,  1.0, 0.5, 0.0,]);

    var index = new Uint8Array([0, 1, 2]);

    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, index, gl.UNSIGNED_BYTE);

    o.numIndex = index.length;

    return o;

 }

 function initFrameBufferObject(gl) {
     var framebuffer, texture, depthBuffer;

     var error = function() {
         if (framebuffer) {gl.deleteFramebuffer(framebuffer);}
         if (texture) { gl.deleteTexture(texture);}
         if (depthBuffer) {gl.deleteRenderbuffer(depthBuffer)};
     }

     framebuffer = gl.createFramebuffer();
     if (!framebuffer) {console.loe('failed framebuffer'); return error();}

     texture = gl.createTexture();
     if (!texture) {console.log('failed texture'); return error();}
     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA,
        gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    depthBuffer = gl.createRenderbuffer();
    if(!depthBuffer) {console.log('failed depthbuffer'); return error();}
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        console.log('failed  buffer object is incomplete' + e.toString()); return error();
    }

    framebuffer.texture = texture;

    return framebuffer;
 }
 var ANGLE_STEP = 40;
 var last = Date.now();
 function animate(angle) {
     var now = Date.now();
     var elapsed = now -last;
     last = now;
     var newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
     return newAngle;
 }