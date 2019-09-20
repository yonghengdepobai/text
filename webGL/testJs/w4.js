// varying(可变的) 变量的作用是从顶点着色器向片元着色器传输数据
// varying 变量只能是float（以及相关的vec2, vec3, vec4, mat2, mat3, mat4)类型

/**
 * 在顶点着色器和片元着色器之间，有这样两个步骤
 * 一、图形装配过程：这一步的任务是，将孤立的顶点坐标装配成几何图形。几何图形的类别由gl.drawArrays()函数的第一个参数决定
 * 二、光栅化过程：这一步的任务是，将装配好的几何图形转化为片元
 * 
 * 一旦光栅化过程结束后，程序就开始逐片元调用片元着色器。对于每个片元，片元着色器计算出该片元的颜色，并写入颜色缓冲区。
 * 光栅化过程生成的片元都是带有坐标信息的
 */

 /**
  * 纹理映射（texture mapping）就是将一张图像（就像一张贴纸）映射（贴）到一个几何图形上去。
  * 此时。这张图片又可以称为纹理图（texture image）或纹理（texture)
  * 纹理映射的作用，就是根据纹理图像，为之前光栅化后的每个片元涂上合适的颜色
  * 组成纹理图像的像素又被称为纹素（texels, texture elements), 每一个纹素的颜色都使用RGB或RGBA格式编码
  * WebGL纹理映射四步
  * 1.准备好映射到几何图形上的纹理图像
  * 2.为几何图形配置纹理映射方式
  * 3.加载纹理图像，对其进行一些配置，以在WebGL中使用它
  * 4.在片元着色器中将相应的纹素从纹理中抽取出来，并将纹素的颜色赋给片元
  */


var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    // attribute vec4 a_Color;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    // varying vec4 v_Color; // varying变量
    void main() {
        gl_Position = a_Position;
        // gl_PointSize = a_PointSize;
        gl_PointSize = 10.0;
        // v_Color = a_Color; // 将数据传给片元着色器
        // 顶点着色器中的v_Color变量在传入片元着色器之前经过了内插过程(在光栅化时)。
        // 所以片元着色器中的v_Color变量和顶点着色器v_Color
        // 变量实际上并不是一回事，这也正是将这种变量称为varying(变化的)变量的原因
        v_TexCoord = a_TexCoord;
    }
`;
var FSHADER_SOURCE = `
     // 指定浮点类型精度
    precision mediump float; 
    // varying vec4 v_Color; // 顶点着色器中的varying变量要与片元着色器中的varying变量名要相同
    uniform float u_Width;
    uniform float u_Height;
    uniform sampler2D u_Sampler; // sampler 取样器 sampler2D 纹理数据类型 samplerCube绑定到gl.TEXTURE_CUBE_MAP
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    // vec4 gl_FragCoord 片元着色器的内置变量（输入）第1个和第2个分量表示片元在<canvas>坐标系统中的坐标值
    void main() {
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        // gl_FragColor = v_Color; // 从顶点着色器接收数据
        // gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0);
        // texture 第一个参数 指定纹理单元编号 第二个指定纹理坐标
        // gl_FragColor = texture2D(u_Sampler, v_TexCoord);
        vec4 color0 = texture2D(u_Sampler, v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = color0 * color1;
        // gl_FragColor = color0;
        // gl_FragColor = color1;
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed initshaders');
        return;
    }
    var nameObj = {
        a_Position: 'a_Position',
        a_PointSzie: 'a_PointSize',
        a_Color: 'a_Color',
        a_TexCoord: 'a_TexCoord',
    }
    var n = initVertexBuffers(gl, nameObj);

    // 配置纹理
    if (!initTextures(gl, n)) {
        console.log('failed initTextures');
        return false;
    }

    var u_Height = gl.getUniformLocation(gl.program, 'u_Height') // getUniformLocation
    var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    // console.log(u_Width, u_Height, gl.drawingBufferHeight, gl.drawingBufferWidth);
    gl.uniform1f(u_Height, gl.drawingBufferHeight);
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.POINTS, 0, n);
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}


function initTextures(gl, n) {
    var texture = gl.createTexture(); // 创建纹理对象
    var texture1 = gl.createTexture();
    // gl.deletTexture(texture) // 删除纹理对象
    if (!texture) {
        console.log(texture, 'failed texture');
        return;
    }
    console.log('????');

    // 获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    console.log(u_Sampler);

    var image = new Image(); // 创建一个image
    var image1 = new Image();
    image.onload = function() {
        // setTimeout(() => {
            loadTexture(gl, n, texture, u_Sampler, image, 0);
        // }, 2000);
    }
    image1.onload = function() {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }
    image.src = '../webGL/image/sky.jpg';
    image1.src = '../webGL/image/timg.gif';
    return true;

}

var g_texUnit0 = false, g_texUnit1 = false; // 标记纹理单元是否已经就绪
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    console.log('zzzzz');
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行y轴反转 unpack flip y 
    /**
     * 开启激活0号纹理单元
     * gl.TEXTURE0到gl.TEXTURE7是管理纹理的8个纹理单元(单元个数取决于硬件和浏览器的WebGL实现，到少8个)，
     * 每一个都与gl.TEXTURE_2D相关联，这个就是绑定纹理是的目标
     * WebGL通过一种称作纹理单元(texture unit)的机制来同时使用多个纹理。每个纹理单元有一个单元编号来管理一张纹理图像
     * 即使程序只需要使用一张纹理图，也得为其指定一个纹理单元
     * 使用之前先激活纹理单元
     */
    // gl.activeTexture(gl.TEXTURE0);
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }
    
    /**
     * 向target绑定纹理对象
     * 纹理类型                     描述
     * gl.TEXTURE_2D               二维纹理
     * gl.TEXTURE_CUBE_MAP         立方体纹理
     * WebGL中不能直接操作纹理对象，通过将纹理对象绑定到纹理单元上，然后操作纹理单元来操作纹理对象
     */
    gl.bindTexture(gl.TEXTURE_2D, texture);

    /**
     * 配置纹理参数 filter
     * 第一个参数 target        gl.TEXTURE_2D或TEXTURE_CUBE_MAP
     * 第二个参数 pname         纹理参数下表
     * 第三个参数param          纹理参数的值
     * 
     * 一、放大方法（gl.TEXTURE_MAG_FILTER）：这个参数表示，当纹理的绘制范围比纹理更大时，如何获取纹素颜色。
     * 比如说，你将16X16的纹理图映射32x32像素空间时，纹理的尺寸就变成了原始的两倍。WebGL需要填充由于放天而造成的
     * 像素空间的空隙，该参数就表示填充这些空隙的具体方法
     * 二、缩小方法（gl.TEXTURE_MIN_FILTER）：这个参数表示，当纹理的绘制范围比纹理本身更小时，如何获取纹素颜色。
     * 比如说，你将32x32的纹理图映射到16x16像素的空间里，纹理的尺寸就只有原始的一半。为了将纹理缩小。WebGL需要剔
     * 除纹理图像中的部分像素，该参数就表示具体的剔除像素的方法
     * 它们两个可以赋值的参数
     * gl.NEAREST       使用原纹理上距离映射后像素（新像素）中心最近的那个像素的颜色值，作为新像素的值（使用曼哈顿距离）
     * gl.LINEAR        使用距离新像素中心最近的四个像素的颜色的加权平均，作为新像的值（与gl.NEAREST相比，该方法图像
     *                  质量更好，但是会有较大的开销）
     * 
     * 三、水平填充方法（gl.TEXTURE_WRAP_S）:这个参数表示，如何对纹理图像左侧或右侧的区域进行填充。
     * 四、垂直填充方法（gl.TEXTURE_WRAP_S）：这个参数表示，如何对纹理图像上方和下方的区域进行填充。
     * gl.REPEAT                平铺式的重复纹理
     * gl.MIRROREO_REPEAT       镜像对称式的重复纹理
     * gl.CLAMP_TO_EDGE         使用纹理图像边缘值
     * 
     * 还有金字塔纹理后面去了解
     * 
     * 
     * 
     */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    /**
     * 配置纹理图像 将纹理图像分配给纹理对象
     * 参数
     * target               gl.TEXTURE_2D或gl.TEXTURE_CUBE_MAP
     * level                传入0（实际上，该参数是为金字塔纹理准备的）
     * internalformat       图像内部格式
     * format               纹理数据的格式（必须使用与internalformat相同的值）
     * type                 纹理数据类型
     * image                包含纹理图像的Image对象
     * 
     * 纹素数据格式
     * gl.RGB               红、绿、蓝
     * gl.RGBA              红、绿、蓝、透明度
     * gl.ALPHA             (0.0, 0.0, 0.0, 透明度)
     * gl.LUMINANCE         L、L、L、1L: 流明
     * gl.LUMINANCE_ALPHA   L、L、L，透明度
     * 流明（luminance）表示我们感知到的物体表面的高度。通使用物作表面红、绿、蓝颜色分量值的加权平均来计算
     * 
     * 纹理数据类型
     * gl.UNSIGNED_BYTE             无符号整型，每个颜色分量占据1字节
     * gl.UNSIGNED_SHORT_5_6_5      RGB: 每个分量分别占据5、6、5比特
     * gl.UNSIGNED_SHORT_4_4_4_4    RGBA: 第个分量占据比特数 
     * gl.UNSIGNED_SHORT_5_5_5——1   RGBA: 第个分量占据比特数 
     * 
     */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    /**
     * 将0号纹理传递给着色器
     * 第一个参数 片元着色器的纹理变量地址
     * 第二个参数 指定是第几个纹理单元(纹理单元编号)
     */
    gl.uniform1i(u_Sampler, texUnit);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (g_texUnit0 && g_texUnit1) {
        console.log('??ss???');
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}