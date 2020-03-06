 /**
 
控制旋转：就是使用模型视图投影矩阵来变换顶点的坐标。用鼠标来控制，就需要根据鼠标的移动情况创建旋转矩阵，更新模型视图投影矩阵
并对物体的顶点坐标进行变换

平视显示器（head up display) 简称 HUD
 在三维场景叠加文本或二维图形信息
 可以使用HTML和canvas函数来实现HUD
 1.在HTML文件中，为WebGL绘制的三维图形准备一个<canvas>，同时为二维的HUD信息再准备一个<canvas>
 令这两个<canvas>重叠放置，并让HUD的<canvas>叠在丰面

 2.在前一个<canvas>上使用WebGLAPI 绘制三维场景

 3.在后一个<canvas>上使用canvas2DAPI 绘制HUD信息。

 雾化（fog)用来描述远处的物体看上去较为模糊的现象
 线性雾化（linear fog）在线性雾化中，某一点的雾化程度取决于它与视点之间的距离，距离越远雾化程度越高
 线性雾化有起点和终点 起点表示开始雾化之处，终点表示完全雾化之处
 某一点的雾化程度可以被定义为雾化因子（fog factor)，并可以用公式计算出来

 <雾化因子> = ( <终点> - <当前点与视点的距离>) / (<终点> - <起点> )
 这里 <起点> <= <当前点与视点间的距离> <= <终点>

 1.0 完全没有被雾 0.0 完全雾化

 在片元着色器中根据雾化因子计算片元的颜色
 <片元颜色> = <物体表面颜色> x <雾化因子> + <雾的颜色> x (1 - <雾化因子>)

  */

 var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute float a_Face; // 表面编号(不能使用int)
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_ModelMatrix;
    uniform vec4 u_Eye; // 视点
    // uniform bool u_Clicked; // 鼠标按下
    varying vec2 v_TexCoord;
    varying float v_Face;
    varying float v_Dist; // 当前点与视点的距离
    varying vec4 v_Color;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_TexCoord = a_TexCoord;
        v_Face = a_Face;
        // 计算顶点与视点的距离
        v_Dist = distance(u_ModelMatrix * a_Position, u_Eye);
        v_Color = a_Color;
    }
 `;
 var FSHADER_SOURCE = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    uniform sampler2D u_Sampler; // precision
    // uniform bool u_Clicked; // 鼠标按下
    uniform int u_PickedFace; // 被选中表面的编号
    uniform vec3 u_FogColor; // 雾的颜色
    uniform vec2 u_FogDist; // 雾化的起点和终点
    varying float v_Dist;
    varying vec2 v_TexCoord;
    varying float v_Face;
    varying vec4 v_Color;
    void main() {

        // 计算雾化因子
        float fogFactor = clamp((u_FogDist[1] - v_Dist) / (u_FogDist[1] - u_FogDist.x), 0.0, 1.0);
        // float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
        // clamp 获取三个参数中处于中间的那个值
        int i_Face = int(v_Face);
        vec4 t_Color = texture2D(u_Sampler, v_TexCoord);
        vec3 color;
        // vec3 color = (i_Face == u_PickedFace) : vec3(1.0) ? t_Color.rgb;
        if (i_Face == u_PickedFace) {
            color = vec3(1.0);
        } else {
            color = t_Color.rgb;
        }

        // color = vec3((0.5 * v_Face / 10.0), 0.2 * v_Face / 10.0, 0.7 * v_Face / 10.0);

        // u_FogColor * (1 - fogFactor) + color * fogFactor
        // <片元颜色> = <物体表面颜色> x <雾化因子> + <雾的颜色> x (1 - <雾化因子>)
        // vec3 fcolor = color * fogFactor + u_FogColor * (1 - fogFactor);
        // mix(x, y, a); // ==> x*(1-a) + y*a; 
        vec3 fcolor = mix(u_FogColor, vec3(color), fogFactor);

        // fcolor = vec3(v_Color);
        // fcolor = t_Color.rgb;

        // if (u_PickedFace == 0) {
        //     // gl_FragColor = vec4(fcolor, (v_Face / 255.0));
        //     gl_FragColor = v_Color;
        //     // gl_FragColor = vec4(1.0, 0.5, 0.4, 1.0);
        // } else {
            gl_FragColor = vec4(fcolor, t_Color.a);
        //     gl_FragColor = v_Color;
        //     // gl_FragColor = texture2D(u_Sampler, v_TexCoord);
        // }
        // gl_FragColor = v_Color;
        // if (10.0 - v_Dist > 0.0) {
        //     gl_FragColor = vec4(1.0);
        // } else {
            // gl_FragColor = vec4(fcolor, v_Color.a);
        // }
       

        // if (u_Clicked) {
        //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        // } else {
        //     gl_FragColor = texture2D(u_Sampler, v_TexCoord);    
        //     // gl_FragColor = vec4(1.0, 0.5, 0.4, 1.0);
        // }
        // gl_FragColor = texture2D(u_Sampler, v_TexCoord);
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
 `;

 

 function main() {
     var canvas = document.getElementById('webgl');
     var hud = document.getElementById('hud');
     var gl = getWebGLContext(canvas);
     var ctx = hud.getContext('2d');

     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed initShaders'); 
        return;
     }

     var n = initVertexBuffers9(gl);
        // var n = initVertexBuffers(gl);


     var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
     var u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');
     var u_PickedFace = gl.getUniformLocation(gl.program, 'u_PickedFace');
     var u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
     var u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
     var u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
     var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

     var fogColor = new Float32Array([0.137, 0.231, 0.423]);
     var fogDist = new Float32Array([55, 88]);
     var eye = new Float32Array([25, 65, 35, 1.0]);

     var modelMatrix = new Matrix4();
     modelMatrix.setScale(10, 10, 10);
     gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

     var viewProjMatrix = new Matrix4();
     viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
    //  viewProjMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
     viewProjMatrix.lookAt(eye[0], eye[1], eye[2], 0.0, 2, 0, 0, 1, 0);
     viewProjMatrix.multiply(modelMatrix);

     //  gl.uniform1i(u_Clicked, false);
     gl.uniform1i(u_PickedFace, -1);
     gl.uniform4fv(u_Eye, eye);
     gl.uniform3fv(u_FogColor, fogColor);
     gl.uniform2fv(u_FogDist, fogDist);
     gl.uniformMatrix4fv(u_MvpMatrix, false, viewProjMatrix.elements);

     var currentAngle = [0.0, 0.0];
     initEventHandlers(canvas, currentAngle, gl, n, u_Clicked, viewProjMatrix, u_MvpMatrix, u_PickedFace);

     initEventHandlers(hud, currentAngle, gl, n, u_Clicked, viewProjMatrix, u_MvpMatrix, u_PickedFace);

    //  hud.onmousedown = function(ev) {
    //     console.log('??????');
    //  }

     if (!initTextures(gl)) {
        console.log('failed initTextures'); 
        return;
     }

     document.onkeydown = function(ev) {
         keydown(ev, gl, n, u_FogDist, fogDist);
     }

     gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //  gl.clearColor(0.0, 0.0, 0.0, 0.0);
     gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
     gl.enable(gl.DEPTH_TEST);

    //  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
     // Draw
    //  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

     var tick = function() {

        draw2D(ctx, currentAngle); // 绘制二维图形
         draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);
         requestAnimationFrame(tick, canvas);
     }
     tick();

     var modelViewMatrix = new Matrix4();
        modelViewMatrix.setLookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
        modelViewMatrix.multiply(modelMatrix);
        modelViewMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
        viewProjMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
        modelViewMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
        viewProjMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
    //  for (let i = 0; i < 100; i++) {
    //     tick();
    //  }
 }
 var isCheck = false;

 function keydown(ev, gl, n, u_FogDist, fogDist) {
    switch (ev.keyCode) {
        case 38: // Up arrow key -> Increase the maximum distance of fog
          fogDist[1]  += 1;
          break;
        case 40: // Down arrow key -> Decrease the maximum distance of fog
          if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
          break;
        default: return;
      }
      console.log(fogDist);
      gl.uniform2fv(u_FogDist, fogDist);
 }

 function draw2D(ctx, currentAngle) {
     ctx.clearRect(0, 0, 400, 400); // 清除hud

    //  用白色的线绘制三角形
    ctx.beginPath(); // 开始绘制
    ctx.moveTo(120, 10); ctx.lineTo(200, 150); ctx.lineTo(40, 150);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; // 设置线条颜色
    ctx.stroke(); // 用白色线条绘制三角形
    // 绘制白色文本
    ctx.font = '18px "Times New Roman"';
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // 设置文本颜色
    ctx.fillText('HUD: Head Up Display', 40, 180);
    ctx.fillText('Triangle is drawn by HUD API', 40, 200);
    ctx.fillText('Cube is draw by WebGL API', 40, 220);
    ctx.fillText('Current Angle:' + Math.floor(currentAngle[0]), 40, 240);

 }

 function initVertexBuffers9(gl) {
    // create a cube
  //    v5----- v4
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v6---|-|v7
  //  |/      |/
  //  v2------v3

  var baseArr = [ 
    [1.0, 1.0, 1.0], [-1.0, 1.0, 1.0], [-1.0, -1.0, 1.0], [1.0, -1.0, 1.0],
    [1.0, 1.0, -1.0], [-1.0, 1.0, -1.0], [-1.0, -1.0, -1.0], [1.0, -1.0, -1.0],
]
var vertiecs_base = new Float32Array([ //
...baseArr[0],  ...baseArr[1],  ...baseArr[2],  ...baseArr[3],
...baseArr[4],  ...baseArr[5],  ...baseArr[6],  ...baseArr[7],
...baseArr[0],  ...baseArr[1],  ...baseArr[5],  ...baseArr[4],
...baseArr[3],  ...baseArr[2],  ...baseArr[6],  ...baseArr[7],
...baseArr[1],  ...baseArr[2],  ...baseArr[6],  ...baseArr[5],
...baseArr[0],  ...baseArr[3],  ...baseArr[7],  ...baseArr[4],
]);

var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
 ]);

var texCoordArr = [ [1.0, 1.0],   [0.0, 1.0],   [0.0, 0.0],   [1.0, 0.0],]
var texCoords = new Float32Array([   // Texture coordinates
    // ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    // ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    // ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    // ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    // ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    // ...texCoordArr[0], ...texCoordArr[1], ...texCoordArr[2], ...texCoordArr[3],
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
    1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
    1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
    0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
]);
console.log(texCoords, vertiecs_base);

var faces = new Uint8Array([
    1, 1, 1, 1,
    2, 2, 2, 2,
    3, 3, 3, 3,
    4, 4, 4, 4,
    5, 5, 5, 5,
    6, 6, 6, 6,
]);

var colors = new Float32Array([     // Colors
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
    0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
    1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
  ]);

var index = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
 ]);


//  var index = new Uint8Array([
//     0, 1, 2,   1, 2, 3,    // front
//     0, 4, 5,   5, 1, 0,    // right
//     0, 3, 7,   7, 4, 0,    // up
//     1, 5, 6,   6, 2, 1,    // left
//     2, 3, 7,   7, 6, 2,    // down
//     4, 5, 6,   6, 7, 4     // back
//  ]);

 if (!initArrayBuffer(gl, vertiecs_base, 3, gl.FLOAT, 'a_Position')) { console.log('???'); return -1;}
 if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord')) { console.log('???sss'); return -1;}
 if (!initArrayBuffer(gl, faces, 1, gl.UNSIGNED_BYTE, 'a_Face')) { console.log('???sss'); return -1;}
 if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) { console.log('???sss'); return -1;}

 gl.bindBuffer(gl.ARRAY_BUFFER, null);

 var indexBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
 return index.length;

 }

 function initArrayBuffer(gl, data, num, type, attribute) {
     var buffer = gl.createBuffer();
     var a_attribute = gl.getAttribLocation(gl.program, attribute);
     console.log(a_attribute);
     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
     gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
     gl.enableVertexAttribArray(a_attribute); // enableVertexAttribArray
     return true;
 }

 function initEventHandlers(canvas, currentAngle, gl, n, u_Clicked, 
    viewProjMatrix, u_MvpMatrix, u_PickedFace) {
     var dragging = false;
     var lastX = -1; lastY = -1;

     canvas.onmousedown = function(ev) {
<<<<<<< HEAD
            var x = ev.clientX, y = ev.clientY;
            var rect = ev.target.getBoundingClientRect();
            //  console.log(rect, x, y);
            if (rect.left <= x && x < rect.right && rect.top <=y && y < rect.bottom) {
                lastX = x; lastY = y;
                dragging = true;

                //  console.log(rect, y);
                var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
                var picked = check(gl, n, x_in_canvas, y_in_canvas, currentAngle,
                u_Clicked, viewProjMatrix, u_MvpMatrix, u_PickedFace);

                console.log(picked);
                gl.uniform1i(u_PickedFace, picked);
                draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);
                // if (picked) { console.log('clicked!!!!')};

            }
=======
         var x = ev.clientX, y = ev.clientY;
         var rect = ev.target.getBoundingClientRect();
        //  console.log(rect, x, y);
         if (rect.left <= x && x < rect.right && rect.top <=y && y < rect.bottom) {
             lastX = x; lastY = y;
             dragging = true;

            //  console.log(rect, y);
            var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
            var picked = check(gl, n, x_in_canvas, y_in_canvas, currentAngle,
            u_Clicked, viewProjMatrix, u_MvpMatrix, u_PickedFace);

            console.log(picked);
            gl.uniform1i(u_PickedFace, picked);
            draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);
            // if (picked) { console.log('clicked!!!!')};

         }
>>>>>>> 7f55bc3a195bb539551e05059063c2adcd85f58e
     }

     canvas.onmouseup = function(ev) {dragging = false};
     canvas.onmousemove = function(ev) {
        var x = ev.clientX, y = ev.clientY;
         if (dragging) {
             var factor = 200 / canvas.height;
             var dx = factor * (x - lastX);
             var dy = factor * (y - lastY);

             currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
             currentAngle[1] = currentAngle[1] + dx;

         }
         lastX = x; lastY = y;
     }
 }

 function check(gl, n, x, y, currentAngle, u_Clicked, viewProjMatrix, u_MvpMatrix, u_PickedFace) {
     var picked = false;
     isCheck = true;
     gl.uniform1i(u_PickedFace, 0);
    //  gl.uniform1i(u_Clicked, true);
     draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);

    //  读取点击位置颜色
    // var pixels = new Uint8Array(4);
    // gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    var pixelss = new Uint8Array(4); // Array for storing the pixel value
    var xx = gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelss);
    // console.log(pixelss, pixelss[3]);
    // if (pixelss[0] === 255) {picked = true;}
    // gl.uniform1i(u_Clicked, 0);
    // draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);
    // isCheck = false;
    return pixelss[3];
 }

 var g_MvpMatrix = new Matrix4();
 function draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle) {
     g_MvpMatrix.set(viewProjMatrix);
     g_MvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0);
     g_MvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
     gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //  console.log(n);
    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
     gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
 }

 function initTextures(gl) {
     var texture = gl.createTexture();
     if (!texture) {
        console.log('Failed to create the texture object');
        return false;
      }

     var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    var image = new Image();
    image.onload = function() {
        loadTexture(gl, texture, u_Sampler, image);
    }
    // image.src = '../webGL/WebGL_Guide_Code/resources/sky.jpg';
    image.src = 'http://192.111.110.35/text2/webGL/WebGL_Guide_Code/resources/sky.jpg';
    console.log(image);

    return true;

 }

 function loadTexture(gl, texture, u_Sampler, image) {
     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // UNPACK_FLIP_Y_WEBGL

     gl.activeTexture(gl.TEXTURE0);
     gl.bindTexture(gl.TEXTURE_2D, texture);

    //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
     
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

     gl.uniform1i(u_Sampler, 0);
 }



