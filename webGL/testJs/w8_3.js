/**
着色器和着色器程序对象 initShaders()
它隐藏了建立和初始化着色器的细节
它的作用是，编译GLSL ES代码，创建和初始化着色器供WebGL使用分为7步
1.创建着色器对象（gl.createShader(type)）
type            指定创建着色器类型，gl.VERTEX_SHADER表示顶点着色器，gl.FRAGMENT_SHADER表示片元头上色器
gl.deleteShader(shader) // 删除着色器 不会立刻删除着色器，而是要等到程序对象不再使用该着色器后，才将其删除

2.向着色器对象中填充着色器程序的源代码（gl.shaderSource(shader, source)）
shader          指定需要传入代码的着色器对象
source          指定字符串形式的代码

3.编译着色器（gl.compileShader(shader)）
使用这前需要编译成二进制的可执行格式
gl.getShaderParameter(shader, pname) 函数来检查着色器的状态
pname           指定待获取参数的类型可以是
                gl.SHADER_TYPE, 返回顶点着色器类型
                gl.DELETE_STATUS, 返回顶点着色器是否被删除成功
                gl.COMPILE_STAUS 返回顶点着色器是否被编译成功
gl.getShaderInfoLog(shader) // 获取着色日志信息

4.创建程序对象（gl.createProgram()）
gl.deleteProgram(program) // 删除指定的程序对象

5.为程序对象分配着色器（gl.attachShader(program, shader)）
gl.detachShader(program, shader)函数来解除分配给程序对象的着色器

6.连接程序对象（gl.linkProgram(program)）
// 检测是否连接成功
gl.getProgramParameter(program, paname)
pname               gl.DELETE_STATUS    程序是否已被删除
                    gl.LINK_STATUS      程序是否已经成功连接
                    gl.VALIDATE_STATUS  程序是否已经通过验证
                    gl.ATTACHED_STATUS  已被分配给着色器的数量
                    gl.ACTIVE_ATTRIBUTES    顶点着色器中attribute变量的数量
                    gl.ACTIVE_UNIFORMS  程序中uniform变量的数量
gl.getProgramInfoLog(program) // 程序对象日志信息

7.使用程序对象（gl.useProgram(program)）
// 告知WebGL系统绘制时使用哪个程序对象
这个函数存使用WebGL有一个强大的特性，就是在绘制前准备多个程序对象

着色器对象：着色器对象管理一个顶点着色器或一个片元着色器。每一个着色器都有一个着色器对象
程序对象：程序对象是管理着色器对象的容器。WebGL中，一个程序对象必须包含一个顶点着色器和一个片元着色器



 */