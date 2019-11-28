var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 1.0;
        v_Color = a_Color;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        // gl_FragColor = v_Color;
    }
`;

const numPoints = 50000;
const numTimesToSubdivide = 5;
var isStart = false;
var tIndex = 0, dObj = [];
var numP = 0;
function main() {
    var canvas = document.getElementById('webgl');

    var gl = canvas.getContext('webgl');
    if (!gl) {console.log('failed init gl'); return;}

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    var buffer = initVertexBuffers(gl);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    viewProjMatrix = new Matrix4(); // Perspective 透视 setPerspective
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100);
    viewProjMatrix.lookAt(0, 4, 8, 0, 0, 0, 0, 1, 0);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, viewProjMatrix.elements);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    canvas.onmousedown = function() {
        dObj[tIndex] = {vertices: []}
        isStart = true;
    }
    canvas.onmouseup = function() {
        tIndex++;
        isStart = false;
    }
    canvas.onmousemove = function(ev) {
        if (isStart) {
            var bound = canvas.getBoundingClientRect();
            // console.log(bound, ev);
            var x = (ev.clientX - bound.left - (canvas.width / 2)) / (canvas.width / 2);
            var y = (canvas.height / 2 - ev.clientY - bound.top)/ (canvas.height / 2);
            dObj[tIndex].vertices.push(x, y, 0);
        }
    }

    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    // var numVertices = Math.pow(4, numTimesToSubdivide + 1);
    // console.log(numVertices);

    // gl.drawArrays(gl.TRIANGLES, 0, n);
    var tick = function() {
        // if (numP > 0) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            for (let i = 0; i < dObj.length; i++) {
                let num = setVertex(gl, dObj[i],buffer, a_Position);
                gl.drawArrays(gl.LINE_STRIP, 0, num);
            }
        // }
        requestAnimationFrame(tick,canvas);
    } 
    tick();
}

function setVertex(gl, arr, buffer, a_attribute) {
    var v = [];
    // for (let i = 0; i < dObj.length; i++) {
    //     v.push(...dObj[i].vertices);
    // }
    // console.log(arr);
    v.push(...arr.vertices);
    numP = v.length / 3;
    var vertices = new Float32Array([
        ...v
    ])
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    return v.length / 3;
}


function initVertexBuffers(gl) {
    var buffer = gl.createBuffer();
    buffer.num = 3;
    buffer.type = gl.FLOAT;
    return buffer;
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    // gl.enableVertexArray(a_attribute);
}

function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);

    gl.useProgram(program);
    gl.program = program;
}

function createProgram(gl, vshader, fshader) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var FragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, FragmentShader);

    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
        console.log(`error linked ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        gl.deleteShader(FragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }

    return program;
}

function loadShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('error shader ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;

}