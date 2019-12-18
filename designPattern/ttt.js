// 柯里化 把接受多个参数的函数变换成一个单一参数（最初函数的第一个参数），并且返回接受余下的参数而且返回结果的新函数的择术
// 柯里化是依赖于闭包来实现的
function curry1(fn) {
    // 数组在没有被实例化前，无法获取原型上面的方法
    var _slice = Array.prototype.slice;
    
    var args = _slice.call(arguments, 1); // arguments.slice(1) 取第二个及以后的参数

    // 这里是一个闭包，这个函数的作用是组合外部传参和内部传参
    return function() {
        args.push(...arguments);
        return fn.call(null, ...args);
    }
}

function add(a, b, c) {
    return a + b + c;
}
curry1(add, 1)(2, 3);
// curry(add, 1)(2)(3);
function curry(fn) {
    // 获取fn的参数个数
    let fnLen = fn.length;
    var arg = Array.prototype.slice.call(arguments, 1); // 如果有多的参数也给存起来
    let args = [...arg];
    return function curryFn() {
        args.push(...arguments);
        if (args.length > fnLen) {
            // 参数多了
            throw new Error('arguments length error');
        }
        if (args.length === fnLen) {
            // 获取的参数够了 执行方法
            fn.call(null, ...args);
            // fn(...args);
        } 
            // 不够在调用传参
            return curryFn;
    }
}
curry(add)(1)(2)(3);