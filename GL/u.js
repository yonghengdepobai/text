function add(a, b) {
    let c = [];
    for (let i = 0; i < a.length; i++) {
        c[i] = a[i] + b[i];
    }
    return c;
}

function scale (num, a) {
    let b = [];
    for (let i = 0; i < a.length; i++) {
        b[i] = num * a[i];
    }
    return b;
}

function mix(x, y, z) {
    return x * (1 - z) + y * z;
}

function mixV(x, y, z) {
    let a = [];
    for (let i = 0; i < x.length; i++) {
        a[i] = mix(x[i], y[i], z);
    }
    return a;
}