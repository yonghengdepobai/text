/**
 * 现实中当光照到物体上时，会反射一部分光。只有当反射光线进入你的眼睛时，你才看到物体并辩认出它的颜色
 * 现实中，当光线照射时，发生两个重要现象
 * 
 * 一、根据光源和光线方向，物体不同表面的明暗程度变得不一样
 * 二、根据光源和光线方向，物体向地面投下了影子
 * 
 * 三维图形学中术语 着色（shading）的真正含义就是，根据光照条件重建“物体各表面明暗不一的效果。
 * 物体向地面投下影子的现象，又被称为阴影
 * 
 * 光源类型
 * 平行光（directional light）,类型于自然中的太阳光
 * 平行光的光线是相互平行的，平行光具有方向。平行光可以看作是无限远处的光源发出的光
 * 可以一个方向和一个颜色来定义
 * 
 * 点光源（point light)，类似于人造灯泡的光
 * 点光源是从一个点向周围的所有方向发出的光。点光源可以用来表示现实中的灯泡、火焰。
 * 需要指定光源的位置和颜色
 * 
 * 环境光（ambient light）来模拟真实世界的非直射光（也就是光源发出后经过墙壁或其他物体反身后的光）
 * 环境光（间接光）是指那些经光源（点光源或平行光源）发出后，被墙壁等物体多次反射，然后照到物体表面上的光
 * 环境光从各个角度照射物体，其强度都是一致的 只需要指定颜色就行了
 * 
 * 聚光灯光（spot light）来模拟电筒、车前灯等
 * 
 * 反射类型
 * 漫反射
 * 漫反射是针对平行光或点光源而言的。漫反射的反射光在各个方向上是均匀的
 * 在漫反射中，反射光的颜色取决于入射光的颜色、表面的基底色、入射光与表面形成的入射角。
 * 入射角定义为入射光与表面的法线形成的夹角，并用 p 表示那么得到
 * <漫反射光颜色> = <入射光颜色> x <表面基底色> x cosp
 * 乘法操作是在颜色矢量上逐分量（R、G、B）进行的
 * 
 * 环境反射
 * 环境反射是针对环境光而言的。在环境反射中、反射光的方向可以认为就是人射光的反方向
 * <环境反射光颜色> = <入射光颜色> x <表面基底色>
 * <表面的反射光颜色> = <漫反射光颜色> + <环境光反射颜色>
 * 
 * 我们可以通过计算两个矢量的点积，来计算这两个矢量的夹角的余弦值cosp。点积远算非常多
 *  GLSL ES 内置了点积运算函数。在公式中使用点符号 · 来表示点积远算这样可得
 * cosp = <光线方向> · <法线方向>
 * <漫反射光颜色> = <入射光颜色> x <表面基底色> x cosp = <入射光颜色> x <表面基底色> x <光线方向> · <法线方向>
 *注意：一、光线方向矢量和表面法线矢量的长度必须为1，否则反射光的颜色就会过暗或过亮，将一个矢量的长度调整为1，同时保持方向
 不变的过程称之 为归一化（normalization）GLSL ES提供了内置归一化函数 可以直接使用
 二、这里的光线方向，实际上是入射方向的的反方向，即从人射点指向光源方向

 法线：表面的朝向
 物体表面的朝向，即垂直于表面的方向，又称法线或法向量。法向量有三个分量，
 向量（nx, ny, nz）表示从原点（0, 0, 0）指向点（nx, ny, nz）的方向
 一个表面具有两个法向量
 在三维学中，表面的正面和背面取决于绘制表面时的顶点顺序，当你按照 v0, v1, v2, v3的顶点顺序绘制一个平面，那么当你从正面观察
 这个表面时，这4个顶点是顺时针的，而你从背面观察该表面，这4个顶点就是逆时针的

 平面的法向量唯一

 一旦计算好法向量，接下来的任务就是将数据传给着色器程序 和传顶点数据类似

 物体移动法向量相关变化
 1.平移变换不会改变法向量，因为平移不会改变物体的方向
 2.旋转变换会改变法向量，改变了物体的方向
 3.缩放变换对法向量的影响较为复杂

 魔法矩阵：逆转置矩阵（inverse transposematrix）
 所谓逆转置矩阵，就是逆矩阵的转置
 只要将变换之前的法法向量乘以模型矩阵的逆转置矩阵，就可以求得变换后的法向量
 逆矩阵：如果矩阵 M 的逆矩阵是 R 那么 R * M 或 M * R 的结果都是单位矩阵
 转置的意思是，将矩阵的行列进行调换（看上去就像沿着左上——右下对角进行了翻转）
 步聚：
 1.求原矩阵的逆矩阵
 Matrix4.setInverseOf(m)        使自身（调用本方法的Matrix4类型的实例）成为矩阵m 的逆矩阵
 2. 将上一步求得的逆矩阵进行转置
 Matrix4.transpose()            对自身进行转置操作，并将自身设为转置后的结果

 * 
 * 
 */

 var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal; // 法向量
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_ModelMatrix; // 模型矩阵
    uniform mat4 u_NormalMatrix; // 用来变换法向的矩阵
    // uniform vec3 u_LightColor; // 光线颜色
    // uniform vec3 u_LightPosition; // 光源位置 (世界坐标系)
    uniform vec3 u_LightDirection; // 归一化的世界坐标
    // uniform vec3 u_AmbientLight; // 环境光颜色
    varying vec4 v_Color;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        // 对法向量进行归一化
        // vec3 normal = normalize(vec3(a_Normal));
        // 计算变换后法向量并归一化
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));

        // 计算顶点的世界坐标
        vec4 vertexPosition = u_ModelMatrix * a_Position;
        // 计算光线方向并归一化
        vec3 lightDirection = normalize(u_LightDirection - vec3(vertexPosition));
        
        // 计算光线方向和法向量的点积
        float nDotL = max(dot(u_LightDirection, normal), 0.0);
        // 计算漫反射光的颜色
        // vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;

        // 计算环境光产生的反射光颜色
        // vec3 ambient = u_AmbientLight * a_Color.rgb;
        // 相加
        // v_Color = vec4((diffuse + ambient), 1.0);
        v_Color =  a_Color;
        v_Position = vec3(u_ModelMatrix * a_Position);
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    }
 `;
 var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    uniform vec3 u_LightColor; // 光线颜色
    uniform vec3 u_LightPosition; // 光源位置 (世界坐标系)
    uniform vec3 u_AmbientLight; // 环境光颜色
    varying vec3 v_Normal;
    varying vec3 v_Position;
    void main() {
        // 对法线进行归一化
        vec3 normal = normalize(vec3(a_Normal));
        // 计算光线方向变归一化
        vec3 lightDirection= normalize(u_LightPosition - v_Position);
        // 计算光线方向和法向量的点积
        float nDotL = max(dot(lightDirection, normal), 0.0);
        // 计算diffuse, ambient以及最终光的颜色
        vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
        vec3 ambient = u_AmbientLight * v_Color.rgb;
        // gl_FragColor = v_Color;
        gl_FragColor = vec4(diffuse + ambient, v_Color.a);
    }
 `;

 function main() {
     var canvas = document.getElementById('webgl');
     var gl = getWebGLContext(canvas);
     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
         console.log('failed initshaders');
         return;
     }

     var n = initVertexBuffers7(gl);

     var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
     var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
     var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
     var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
     var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
     var u_ModelMatrix =gl.getUniformLocation(gl.program, 'u_ModelMatrix');
     var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightDirection');

    //  设置
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);

    // 设置光线方向(世界坐标系上)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize(); // 归一化
    console.log(lightDirection);
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

     var modelMatrix = new Matrix4(); // 模型矩阵
     var mvpMatrix = new Matrix4();
     var noramlMatrix = new Matrix4(); // 用来变换法向量的矩阵


    //  modelMatrix.setTranslate(0, 1, 0); // 沿Y轴平移
     modelMatrix.setRotate(90, 0, 1, 0);
    //  modelMatrix.rotate(90, 0, 0, 1); // 绕Z轴旋转
     mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
     mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
     mvpMatrix.multiply(modelMatrix);
     gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
     gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //  根据模型矩阵计算用来变换法向量的矩阵
    noramlMatrix.setInverseOf(modelMatrix);
    noramlMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, noramlMatrix.elements);

     gl.clearColor(0.0, 0.0, 0.0, 1.0);
     gl.enable(gl.DEPTH_TEST);
     gl.enable(gl.POLYGON_OFFSET_FILL);
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
     gl.polygonOffset(1.0, 1.0);

     gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0); // triangle

 }

 function initVertexBuffers7(gl) {
    var verticesColor = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 白
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1  白
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
    var colors = new Float32Array([
        // 1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0,
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    ]);

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

    var normals = new Float32Array([
        0,0, 0.0, 1.0, 0,0, 0.0, 1.0, 0,0, 0.0, 1.0, 0,0, 0.0, 1.0,
        1,0, 0.0, 0.0, 1,0, 0.0, 0.0, 1,0, 0.0, 0.0, 1,0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1,0, 0.0, 0.0, -1,0, 0.0, 0.0, -1,0, 0.0, 0.0, -1,0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0,0, 0.0, -1.0, 0,0, 0.0, -1.0, 0,0, 0.0, -1.0, 0,0, 0.0, -1.0,
    ]);

    var vertexColorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();

    // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) { return -1;}
    if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) { return -1;}
    if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) {return -1;}

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

