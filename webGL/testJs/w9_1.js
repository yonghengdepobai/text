/**
 
在进行a混合（alpha blending），实际上WebGL用到了两个颜色，
即源颜色（source color）和目标颜色（destination color）,前者就是待混合的颜色

gl.blendFunc(src_factor, dst_factor)
<混合后的颜色> = <源颜色> x src_factor  + <目标颜色> x dst_factor

src_factor              指定源颜色在混合后颜色中的权重因子
dst_factor              指定目标颜色在混合后的颜色中的权重因子
                        常量                       R分量的系数     G分量的系数        B分量的系数
                        gl.ZERO                      0.0             0.0             0.0
                        gl.ONE                       1.0             1.0             1.0
                        gl.SRC_COLOR                 Rs              Gs              Bs
                        gl.ONE_MINUS_SRC_COLOR       (1-Rs)          (1-Gs)          (1-Bs)
                        gl.DST_COLOR                 Rd              Gd              Bd
                        gl.ONE_MINUS_DST_COLOR       (1-Rd)          (1-Gd)          (1-Bd)
                        gl.SRC_ALPHA                 As              As              As
                        gl.ONE_MINUS_SRC_ALPHA      (1-As)          (1-As)           (1-As)
                        gl.DST_ALPHA                Ad              Ad               Ad
                        gl.ONE_MINUS_DST_ALPHA      (1-Ad)          (1-Ad)           (1-Ad)
                        gl.SRC_ALPHA_SATURATE       min(As, Ad)     min(As, Ad)      min(As, Ad)
WebGL移除了 OpenGL中的一些
其中 Rs Gs Bs As Rd Gd Bd Ad 表示源颜色和目标颜色的各个分量


透明和不透明物体共存
1.开启隐藏面消隐功能
gl.enable(gl.DEPTH_TEST)

2.绘制所有不透明的物体

3.锁定用于进行隐藏面消除的深度缓冲区的写入操作，使之只读
gl.depthMask(false);

4.绘制所有半透明的物体（a小于1.0），注意它们应当按照深度排序，然后从后向前绘制

5.释放度缓冲区，使之可读可写
gl.depthMask(true)


gl.depthMask(mask);
mask            指定是锁定深度缓冲区的写入操作（false)，还是释放之（true）
深度缓冲区存储了每个像素的Z坐标值


切换着色器


 */

var SOLID_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    uniform mat4  u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
    void main() {
        vec3 lightDirection = vec3(0.0, 0.0, 1.0);
        vec4 color = vec4(0.0, 1.0, 1.0, 1.0);
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        float nDotL = max(dot(normal, lightDirection), 0.0); // 光线与法向量的点积cosa
        v_Color = vec4(color.rgb * nDotL, color.a);
        // v_Color = color;
    }
`;
var SOLID_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
        // gl_FragColor = vec4(0.3,0.4,0.5,1.0);
    }
`;

var TEXTURE_VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    attribute vec2 a_TexCoord;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    varying float v_NdotL;
    varying vec2 v_TexCoord;
    void main() {
        vec3 lightDirection = vec3(0.0, 0.0, 1.0);
        gl_Position = u_MvpMatrix * a_Position;
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        v_NdotL = max(dot(normal, lightDirection), 0.0);
        v_TexCoord = a_TexCoord;
    }
`
var TEXTURE_FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D u_Sampler;
    varying float v_NdotL;
    varying vec2 v_TexCoord;
    void main() {
        vec4 color = texture2D(u_Sampler, v_TexCoord);
        gl_FragColor = vec4(color.rgb * v_NdotL, color.a);
        // gl_FragColor = color;
    }
`;

 function main() {
     var canvas = document.getElementById('webgl');
     var gl = getWebGLContext(canvas);
     if (!gl) { console.log('failed gl'); return;   }

    //  初始化着化器
    var solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
    var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
    if (!solidProgram || !texProgram) {console.log('failed solidProgram || texProgram'); return;}

    // 
    solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
    solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
    solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');
    solidProgram.u_NormalMatrix = gl.getUniformLocation(solidProgram, 'u_NormalMatrix');

    // 
    texProgram.a_Position = gl.getAttribLocation(texProgram,'a_Position');
    texProgram.a_Normal = gl.getAttribLocation(texProgram, 'a_Normal');
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
    texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
    texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, 'u_NormalMatrix');
    texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

    if (solidProgram.a_Position < 0 || solidProgram.a_Normal < 0 || solidProgram.u_NormalMatrix < 0 ||
        solidProgram.u_MvpMatrix < 0 || texProgram.a_Normal < 0 || texProgram .a_Position < 0) {
            console.log('failed getLocation'); return;
        }
    
    var cube = initVertexBuffers_9_1(gl);
    if (!cube) {console.log('failed cube'); return}
    
    var texture = initTextures(gl, texProgram);
    if (!texture) {console.log('failed texture'); return}

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100);
    viewProjMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    var currentAngle = 0.0;

    var tick = function() {
        currentAngle = animate(currentAngle);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        drawSolidCube(gl, solidProgram, cube, -2.0, currentAngle, viewProjMatrix);

        drawTexCube(gl, texProgram, cube, 2.0, currentAngle, viewProjMatrix);

        requestAnimationFrame(tick, canvas);
    }
    tick();
 }

 function initVertexBuffers_9_1(gl) {

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
     o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
     o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
     o.indexBuffer = initElementArrayBufferForLaterUse(gl, index, gl.UNSIGNED_BYTE);
     if (!o.vertexBuffer) {console.log('failed o.vertexBuffer'); return}

     o.numIndex = index.length;

     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

     return o;
 }

 function initTextures(gl, program) {
     var texture = gl.createTexture();
     if (!texture) {console.length('failed texture'); return;};

     var image = new Image();

     image.onload = function() {
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, texture);

         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // NEAREST
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

         gl.useProgram(program);
         gl.uniform1i(program.u_Sampler, 0);

        //  gl.bindTexture(gl.TEXTURE_2D, null);
        // gl.bindTexture(gl.TEXTURE_2D, null);

     }
     image.src = '../webGL/WebGL_Guide_Code/resources/orange.jpg';
     return texture;
 }


 function drawSolidCube(gl, program, o, x, angle, viewProjMatrix) {
     gl.useProgram(program);
    //  console.log(o, o.vertexBuffer, o.normalBuffer);
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

    drawCube(gl, program, o, x, angle, viewProjMatrix);
 }

 function drawTexCube(gl, program, o, x, angle, viewProjMatrix) {
     gl.useProgram(program);
    //  console.log(o, o.vertexBuffer, o.a_Normal, o.a_TexCoord);
     initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
     initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
     initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

     drawCube(gl, program, o, x, angle, viewProjMatrix);
 }

 function initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
 }

 var g_modelMatrix = new Matrix4();
 var g_mvpMatrix = new Matrix4();
 var g_normalMatrix = new Matrix4();

 function drawCube(gl, program, o, x, angle, viewProjMatrix) {
     g_modelMatrix.setTranslate(x, 0.0, 0.0);
     g_modelMatrix.rotate(20, 1.0, 0.0, 0.0);
     g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);

     g_normalMatrix.setInverseOf(g_modelMatrix);
     g_normalMatrix.transpose();
     gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

     g_mvpMatrix.set(viewProjMatrix);
     g_mvpMatrix.multiply(g_modelMatrix);
     gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    //  console.log(o.numIndex, o.indexBuffer.type);
     gl.drawElements(gl.TRIANGLES, o.numIndex, o.indexBuffer.type, 0);
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

 var ANGLE_STEP = 30;
 var last = Date.now(); 
 function animate(angle) {
     var now = Date.now();
     var elapsed = now -last;
     last = now;

     var newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
     return newAngle % 360;
 }