// GLSL ES
// 区分大小写 分号；结尾
/**
 * 执行次序
 * 和C语言接近，它从main()函数开始执行。必须有且仅有一个main()函数不能接收任何参数
 * 数据类型
 * 数值类型：GLSL ES支持整型数和浮点型。没有小数点的被认为是整型数，而有小数点的值则认为是浮点数
 * 布尔值类型：GLSL ES支持布尔值类型，包括true和false两个布尔常值
 * 不支持字符串
 * 
 * 变量
 * 只包括 a-z,A-Z,0-9,和下划线
 * 变量名首字母不能是数字
 * 不能以gl_、webgl、或_webgl_开头，这些前缀已经被OpenGL ES保留了
 * 关键字
 * attribute        bool            break           bvec2       bvec3       bvec4
 * const            continue        discard         do          else        false
 * float            for             highp           if          in          inout
 * Int              invariant       ivec2           ivec3       ivec4       lowp
 * mat2             mat3            mat4            medium      out         precision
 * return           sampler2D       samplerCube     struct      true        uniform
 * varying          vec2            vec3            vec4        void        while
 * 
 * 保留字
 * asm              cast            class           default
 * double           dvec2           dvec3           dvec4
 * enum             ...
 * 
 * GLSL ES 是强类型语言（type sensitive language）
 * <类型> <变量名>
 * 基本类型
 * float                单精度浮点型。
 * int                  整型数
 * bool                 布尔值
 * int i = 8; // 正确
 * float f1 = 8; // 错误
 * float f2 = 8.0; // 正确
 * float f3 = 8.0f; // 错误
 * 
 * 矢量和矩阵
 * 矢量 vector 将这些元素排成一列，可以用来表示顶点坐标或颜色值等
 * vec2 vec3 vec4       具有2、3、4个浮点数元素的矢量
 * ivec2 ivec3 ivec4    具有2、3、4个整型元素的矢量
 * bvec2 bvec3 bvec4    具有2、3、4个布尔值元素的矢量
 * 矩阵matrix 将这些元素划分成行和列，可以用来表示变换矩阵
 * mat2 mat3 mat4   2x2、3x3、4x4的浮点元素矩阵
 * 
 * vec4 position = vec4(1.0, 2.0 ,3.0, 4.0);
 * 赋值 构造函数
 * vec4 v4 = vec4(1.0, 2.0 ,3.0, 4.0);
 * vec4 v3 = vec3(v4); // 使用v4的前三个元素，将v3设置为(1.0, 2.0, 3.0)
 * vec4 v4a = vec4(1.0); // 将v4设置为(1.0, 1.0, 1.0, 1.0)
 * vec4 v4b = vec4(v3, v4); // 将多个矢量组合 先用前面的填充不够在用后面的
 * 
 * 向矩阵构造函数中传入的每一个元素的数值来构造矩阵，注意传入值的顺序必须是列主序
 * mat4 m4 = mat4(1.0, 2.0, 3.0, 4.0,
 *                 5.0, 6.0, 7.0, 8.0,
 *                 9.0, 10.0, 11.0, 12.0,
 *                 13.0, 14.0, 15.0, 16.0);
 * 
 * 向矩阵构造函数中传入一个或多个矢量，按照列主序使用矢量里面的元素来构造矩阵
 * 也可以数字和矢量混合传入
 * 只传入单个数值，这样将生成一个对角线上都是该数值，其他元素为0.0的矩阵
 * 如果传入的数大于1，又没有达到矩阵元素的数量就会出错
 * 
 * 访问元素
 * 为主访问矢量或矩阵中的元素，可以使用 . 或者 [] 运算符
 * . 在矢量变量名后接点运算符(.)，然后接上分量名就可以了
 *  类别
 * x, y, z, w       用为获取顶点坐标分量
 * r, g, b, a       用来获取颜色分量
 * s, t, p, q       用来获取纹理坐标分量
 * 
 * float f;
 * f = v4.x; f= v4.y; ...
 * vec2 v2; v2 = v4.xy; v2 = v4.yz; v2 = v4.xx;
 * v4.xw = vec2(5.0, 6.0); 这样也可以
 * 
 * [] 运算符
 * vec v4c = m4[0]; // 获取m4矩阵的第一列
 * float m23 = m4[2][3]; //m4中第二列中的第三个元素
 * float m32 = m4[3].y; // 组合使用第三列第二个元素
 * 
 * vec3 v3b, v3a; float f;
 * v3b = v3a + f; // v3a.x + f; v3a.y + f; v3a.z + f;
 * 矩阵和浮点数的运算也是第个元素都与浮点数运算
 * 矩阵右乘矢量  的结果是矢量 参考矩阵的乘法运算
 * 矩阵左乘矢量也可以，但是与右乘的结果不一样 矩阵乘法没有交换律
 * 矩阵与矩阵相乘
 * 
 * 结构体
 * GLSL ES支持用户自定义数据类型，即结构体（structures）。使用关键字struct,
 * 将已存在的类型骤合在一起，就可以定义为结构体。
 * struct light { // 定义了结构体类型light
 *      vec4 color;
 *      vec3 position;
 * }
 * light l1, l2; // 声明light类型的变量l1和l2
 * 赋值和构造
 * l1 = light(vec4(1.0, 0.0, 1.0, 1.0), vec3(8.0, 2.0, 4.0));
 * 访问成员
 * vec4 color = l1.color;
 * 
 * 数组
 * GLSL ES支持数组类型。GLSL ES只持一维数组，不支持pop(),push()等操作
 * 创建数组时也不需要使用new。声明数组只需要在变量名后加一个中括号([])和数组长度
 * float floatArray[4]; // 声明含有4个浮点数元素的数组
 * vec4 vec4Array[2]; // 声明含有2个vec4对象的数组
 * 
 * 取样器
 * GLSL ES支持的一种内置类型称为取样器（sampler）,必须通过该类型变量访问纹理
 * uniform sampler2D u_Sampler;
 * uniform sumplerCube u_SamplerCube;
 * 
 * 程序流程控制一样
 * 
 * 函数 类c可以先声明调用 在定义
 * float luma(vec4 color) {
 *      float r = color.r;
 *      float g = color.g;
 *      float b = color.b;
 *      return 0.2126 * r + 0.7162 * g + 0.07222 * b;
 * }
 * 参数限定词 in 可以修改其值，但函数内部的修改不会影响传入变量
 * const in 内部使用，不可以修改
 * out  若在内部修改，会影响到外面的值
 * inout 修改变量的值，会影响外面的值
 * 默认为 in
 * 
 */