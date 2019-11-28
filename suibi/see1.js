// bind实现 bind绑定this
// a.bind(b); 将a的绑定在b上
function a() {}; var b = {};
Function.prototype.myBind = function(obj) {
    if (typeof this !== 'function') {
        throw new Error('typeError');
    }
    var _this = this; // this指代指用myBind的方法
    var args = [...arguments].slice(1);
    return function F() {
        // 
        if (this instanceof F) { // instanceof 用来测试一个对象是不是一个类的实例
            // instanceof 内部机制是通过判断对象的原型链中是不是能找到类型的prototype
            // new a.myBind(b) 的时候进入这个if
            console.log('??????');
            return new _this(...args, ...arguments);
        }
        return _this.call(obj, ...args.concat(...arguments));
    }
}
a.myBind(b)(); new a.myBind(b);

// call 绑定this变调用函数
a.call(b, 1, 2, 3);
Function.prototype.myCall = function(context) {
    var context = context || window;
    var _this = this; // this 调用myCall的方法
    var args = [...arguments].slice(1);
    context.fn = _this;
    var result = context.fn(...args); // 调用函数
    delete context.fn;
    return result; // 返回执行结果
}

// apply
Function.prototype.myApply = function(context) {
    var context = context || window;
    context.fn = this;
    var result;
    if (arguments[1]) {
        result = context.fn(...arguments[1]);
    } else {
        result = context.fn();
    }
    return result;
}

// 每一个方法都 prototype属性，除了Function.prototype.bind(),该属性指向原型
// 每个对象都有__proto__属性，指向了创建该对象的构造函数的原型
// Object.getPrototypeOf() 替代读操作 Object.setPrototypeOf() 代替写操作
// 对象可以通过__proto__来寻找不属于该对象的属性,__proto__将对象连接起来组成了原型链

Object.prototype.toString.call(b); // 判断对象类型 得到一个[object Type]的字符串

function* test() {
    let a = 1 + 2;
    yield 2;
    yield 3;
}
var btets = test();
console.log(btets.next()); // {value: 2, done: false}
console.log(btets.next()); // {value: 3, done: false}
console.log(btets.next()); // {value: undefined, done: true}

// cb 就是编译后的test函数
function generator(cb) {
    return (function() {
        var object = {
            next: 0,
            stop: function() {},
        };
        
        return {
            next: function() {
                var ret = cb(object);
                if (ret === undefined) { return {value: undefined, done: true}}
                return {
                    value: ret,
                    done: false,
                }
            }
        }
    })();
}

// babel 编译后
function b_test() {
    var a;
    return generator(function(_context) {
        while(1) {
            switch((_context.prev = _context.next)) {
                // yield 将代码分成几块 每次执行next就执行一块代码 并且表明下次需要执行哪块代码
                case 0:
                    a = 1 + 2;
                    _context.next = 4;
                    return 2;
                case 4:
                    _context.next = 6;
                    return 3;
                case 6:
                case 'end':
                    return _context.stop();
            }
        }
    });
}

// Promise 看成状态机。初态是pending, 可以通过函数resolve 和 reject
// then 函数会返回一个Promise实例，并且该返回值是一个新的实例而不是之前的实例

// 三种状态
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
    let _this = this;
    _this.currentState = PENDING;
    _this.value = undefined;
    // 用于保存 then 中的回调，只有当promise状态为pending 时才会缓存，并且每个实例至多一个缓存
    _this.resolvedCallbacks = [];
    _this.rejectedCallbacks = [];
    
    _this.resolve = function(value) {
        if (value instanceof MyPromise) { // 如果value是promise，递归执行
            return value.then(_this.resolve, _this.reject)
        }
        setTimeout(() => { // 异步执行，保证执行顺序
            if (_this.currentState === PENDING) {
                _this.currentState = RESOLVED;
                _this.value = value;
                _this.resolvedCallbacks.forEach(cb => cb());
            }
        })
    };

    _this.reject = function(reason) {
        setTimeout(() => { // 异步执行，保证执行顺序
            if (_this.currentState === PENDING) {
                _this.currentState = REJECTED;
                _this.value = reason;
                _this.rejectedCallbacks.forEach(cb => cb());
            }
        })
    };

    try {
        fn(_this.resolve, _this.reject);
    } catch(e) {
        _this.reject(e);
    }
}
MyPromise.prototype.then = function(onResolved, onRejected) {
    var self = this;
    var promise2;
}

// js在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入
// 到Task（有多种task）队列中。一旦执行栈为空，Event Loop就会从Task队列中拿出代码并放入执行栈中执行

// 微任务 microtask 称为jobs  process.nextTick, promise, Object.observe, MutationObserver
// 宏任务 macrotask 称为task script, setTimeout, setInterval, I/0, UI, rendering
// 浏览器会先执行一个宏任务， 接下来有异步代码就先执行微任务