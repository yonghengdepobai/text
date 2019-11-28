var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    // varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    // varying vec4 v_Color;
    void main() {
        // gl_FragColor = v_Color;
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) { console.log('falied canvas'); return;}

    var gl = getWebGLContext(canvas);
    if (!gl) {console.log('failed gl'); return; }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed initShaders'); return;
    }

    var n = initVertexBuffers(gl);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);

}


function initVertexBuffers(gl) {
    // 
    var N = 100;
    var r = 0.1;
    var raduis = [[0.4, 0.4], [0.4, -0.4], [-0.4, 0.4], [-0.4, -0.4]]
    var rV = [];
    var temp = 0;
    for (var k = 0; k < raduis.length; k ++) {
        rV[k] = [];
        for (var i = 0; i <= N; i++) {
            temp ++;
            var theta = i * 2 * Math.PI / N;
            var x = r * Math.sin(theta) + raduis[k][0];
            var y = r * Math.cos(theta) + raduis[k][1];
                if (raduis[k][0] > 0 && x - raduis[k][0] < 0) {continue;}
                if (raduis[k][0] < 0 && x - raduis[k][0] > 0) {continue;}
                if (raduis[k][1] > 0 && y - raduis[k][1] < 0) {continue;}
                if (raduis[k][1] < 0 && y < raduis[k][1]) {console.log(raduis[k][1], y, '11')}
                if (raduis[k][1] < 0 && y > raduis[k][1]) {console.log(raduis[k][1], y); continue;}
                if (raduis[k][1] < 0 && y < raduis[k][1]) {console.log(raduis[k][1], y, '22')}
            if (i > 0) {
                let st = rV[k].slice(-2);
                // console.log(rV[k], st);
                rV[k].push(...raduis[k], ...st)
            }
            rV[k].push(x, y);
            // if (temp % 2 == 0) {
            //     rV[k].push(...raduis[k]);
            // }
        }
    }
    // console.log(rV);
    var vertex = new Float32Array([
        // -0.5, 0.4, -0.5, -0.4, -0.4, -0.4,
        //   -0.4, 0.4, 
        // -0.4, 0.5, 0.4, 0.5, -0.4, -0.5,  0.4, -0.5, 
        // 0.5, 0.4, 0.5, -0.4,  0.4, 0.4,  0.4, -0.4, 
         ...rV[0], ...rV[1], ...rV[2],
          ...rV[3],
    ]);
console.log(vertex);
    var iI = [];
    // temp = 11;
    temp = 0;
    var temp2 = 0;
    for (let i = 0; i < rV.length; i++) {
        iI[i] = [];
        for (let j = 0; j < rV[i].length; j++) {
            temp2++;
            if (temp2 % 2 == 0) {
                temp++;
                iI[i].push(temp);
            }
        }
        let s = iI[i].length;
        // console.log(s, s % 3);
        s % 3 == 0 ? iI[i] : iI[i].length = iI[i].length - (s % 3);
    }

    // console.log(iI, iI[3].length);
    // console.log(vertex);
    // iI[3].length = 30;
    // console.log(iI[3]);
    // iI[0].length = 15;
    var index = new Uint16Array([
        // 0, 1, 2, 2, 3, 0,
        // 3, 4, 5, 5, 10, 3,
        // 3, 2, 10, 2, 11, 10,
        // 2, 6, 7, 7, 11, 2,
        // 10, 11, 9, 9, 8, 10,
        ...iI[0],
        ...iI[1],
        ...iI[2],
        ...iI[3],
    ]);
    console.log(index);
    let f = vertex.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {console.log('failed a_Positon'); return 0;}
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    var i_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
    
    // console.log(buffer, i_buffer);

    return index.length;
}