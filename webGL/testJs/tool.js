
function initVertexBuffers(gl, nameObj) {
    var vertexs = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3;
    var n = 4;
    var size = new Float32Array([
        10.0, 20.0, 30.0 // 点的尺寸
    ]);
    var verticesSizes = new Float32Array([// 顶点坐标和尺寸
        0.0, 0.5, 10.0, // 第一个点
         -0.5, -0.5, 20.0, // 第二个点
          0.5, -0.5, 30.0, // 第三个点
    ]);
    var verticesColors = new Float32Array([// 顶点坐标和尺寸
        0.0, 0.5, 1.0, 0.0, 0.0,// 第一个点
         -0.5, -0.5, 0.0, 1.0, 0.0, // 第二个点
          0.5, -0.5, 0.0, 0.0, 1.0 // 第三个点
    ]);
    var verticesTexCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
         -0.5, -0.5, 0.0, 0.0, // 第二个点
         0.5, 0.5, 1.0, 1.0, // 第一个点
          0.5, -0.5, 1.0, 0.0 // 第三个点
    ]);
   
    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
    var vertexBuffer = gl.createBuffer(); // 1创建缓冲区 验证略
    var vertexSizeBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 设置类型并绑定
    // gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.STATIC_DRAN);
    // gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW); // 给绑定的缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, nameObj.a_Position); // 获取变量地址
    console.log(a_Position);
    // if (!a_Position) { console.log('failed a_Position'); return}
    // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    // 启用
    // 顶点颜色
    // var a_Color = gl.getAttribLocation(gl.program, nameObj.a_Color);
    // console.log(a_Color);
    // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    // gl.enableVertexAttribArray(a_Color);

    // 
    var a_TexCoord = gl.getAttribLocation(gl.program, nameObj.a_TexCoord);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // 处理顶点尺寸
    var sizeBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    // var a_Point = gl.getAttribLocation(gl.program, nameObj.a_PointSzie);
    // gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    // gl.vertexAttribPointer(a_Point, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    // gl.enableVertexAttribArray(a_Point);
    // gl.enableVertexAttribArray(a_Point);
    return n;
}


function initArrayBufferForLaterUse(gl, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
    // Store the necessary information to assign the object to the attribute variable later
    buffer.num = num;
    buffer.type = type;
  
    return buffer;
  }
  
  function initElementArrayBufferForLaterUse(gl, data, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
    buffer.type = type;
  
    return buffer;
  }
