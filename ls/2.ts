/**
 * zone 它是用于拦截和跟踪异步工作的机制    
 * zone 是一个全局对象，用来配制有关如何拦截和跟踪异步回调的规则。zone有以下能力：
 * 拦截异步任务调度
 * 为异常处理函数提供正确的上下文
 * 拦截阻塞的方法，如alert,confirm 方法
 */
let z;
 // 尾递归优化
 /**
  * 
  * 上面代码中，too函数是尾递归优化的实现，它的奥妙就在于状态变量active。默认情况下，这个变量是不激活的。
  * 一旦进入尾递归优化的过程，这个变量就激活了。然后，每一轮递归sum返回的都是undefined，所以就避免了递归执行；
  * 而accumulated数组存放每一轮sum执行的参数，总是有值的，这就保证了accumulator函数内部的while循环总是会执行。
  * 这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。
  */
 function too(f) {
     var value;
     var active = false;
     var accumulated = [];
     return function(...val) {
         accumulated.push(arguments);
         if (!active) {
             active = true;
             while(accumulated.length) {
                 value = f.apply(this, accumulated.shift());
             }
             active = false;
             return value;
         }
     }
 }

 var sum = too(function(x, y) {
    if (y > 0) {
        return sum(x + 1, y -1);
    } else {
        return x;
    }
 });
 sum(1, 1000);

 // 柯里化
 function currying(fn, n) {
     return function (m) {
         return fn.call(this, m, n);
     }
 }

 /**
  *for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
    Object.keys()：返回对象自身的所有可枚举的属性的键名。
    JSON.stringify()：只串行化对象自身的可枚举的属性。
    Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

    super关键字，指向当前对象的原型对象 super关键字表示原型对象时 只能在对象的方法中使用
    目前，只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。

    扩展运算符的解构赋值，只能读取对象o自身的属性

  */
 Object.getOwnPropertyDescriptor; // 描述对象
 Reflect.ownKeys({}); // 返回一个数组包含对象自身的所有键名
 Object.getOwnPropertyNames({}); // 返回一个数组，包含自身所有属性（不包括Symbol属性，但包括不可枚举属性）的键名
 Object.getOwnPropertySymbols({}); // 返回一个数组，包含自所有Symbol属性的键名
 Object.keys({}); // 返回对象自身的(不含继承的)所有可枚举的属性的键名。
 Object.setPrototypeOf({}, {}); // 将前一个的原型对象设置后一个参数
 Object.getPrototypeOf({}); // 获取对象的原型

 let mix = (object) => ({
    with: (...mixins) => mixins.reduce(
      (c, mixin) => Object.create(
        c, Object.getOwnPropertyDescriptors(mixin)
      ), object)
  });
  
  // multiple mixins example
  let a = {a: 'a'};
  let b = {b: 'b'};
  let cc = {c: 'c'};
  let d = mix(cc).with(a, b);
  
  d.c // "c"
  d.b // "b"
  d.a // "a"

  // __proto__实现
  Object.defineProperty(Object.prototype, '__proto__', {
    get() {
      let _thisObj = Object(this);
      return Object.getPrototypeOf(_thisObj);
    },
    set(proto) {
      if (this === undefined || this === null) {
        throw new TypeError();
      }
      if (!isObject(this)) {
        return undefined;
      }
      if (!isObject(proto)) {
        return undefined;
      }
      let status = Reflect.setPrototypeOf(this, proto);
      if (!status) {
        throw new TypeError();
      }
    },
  });
  
  function isObject(value) {
    return Object(value) === value;
  }

  let as = new Set([1, 2, 3]);
let bs = new Set([4, 3, 2]);

// 并集
let union = new Set([...as, ...bs]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...as].filter(x => bs.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...as].filter(x => !bs.has(x)));
// Set {1}

/**
 * Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种‘元编程’(meta programming)，即对语言进行编程
 * Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，
 * 可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
 * 
 * 如果一个属性不可配置(configurable)且不可写(writable)，则Proxy不能修改该属性，否则通过Proxy访问访属性会报错
 * 
 * apply 拦截函数的调用、call和apply操作 接收三个参数 目标对象、目标上下文(this)和目标对象的参数数组
 * 
 * has方法用来拦截HasProperty操作
 * 
 * construct方法用于拦截new命令 返回的必须是一个方法
 * target：目标对象
  args：构造函数的参数对象
  newTarget：创造实例对象时，new命令作用的构造函数

  deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。

  defineProperty方法拦截了Object.defineProperty操作。

  getOwnPropertyDescriptor方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。

  getPrototypeOf方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。
  如果目标对象不可扩展（non-extensible）， getPrototypeOf方法必须返回目标对象的原型对象。
  Object.prototype.__proto__
  Object.prototype.isPrototypeOf()
  Object.getPrototypeOf()
  Reflect.getPrototypeOf()
  instanceof

  isExtensible方法拦截Object.isExtensible操作。

  ownKeys方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。
  Object.getOwnPropertyNames()
  Object.getOwnPropertySymbols()
  Object.keys()
  for...in循环
  如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys方法返回，否则报错。
  如果目标对象是不可扩展的（non-extensible），这时ownKeys方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。

  preventExtensions方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。

 * 
 */

 var obj = new Proxy({}, {
   get: function (target, key, receiver) {
     console.log(`getting ${ key }!`);
     return Reflect.get(target, key, receiver);
   },
   set: function (target, key, value, receiver) {
     console.log(`setting ${key}!`);
     return Reflect.set(target, key, value, receiver);
   }
 }) ;


 /**
  *  (1) 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
  *   现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。
  *   也就是说从Reflect上可以拿到语言内部的方法。
  * （2）修改某些Object返回的结果，让其变得到更合理。比如Object.defineProperty(obj,name,desc)在无法定义属性时，
  *   会抛出一个错误，而Reflect.defineProperty(obj,name,desc)则会返回false.
  * （3）让Obejct操作都变成函数行为。某些Object操作是命令式，比如name in obj 和 delect obj[name],
  *   而Reflect.has(obj,name)的Reflect.deleteProperty(obj,name)让他们变成了函数行为
  * （4）Reflect对象的方法和Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflectc对象上找到对应的方法。
  *   这就让Proxy对象可以方便对应的Reflect方法，完成默认行为，作为修改默认行为的基础。
  *   也就说，不管Proxy怎么修改黑认行为，你总可以在Reflect上获取默认行为
  * 
  *   Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
  *   如果name属性部署了读取函数（getter），则读取函数的this绑定receiver。
  * 
  *   Reflect.set方法设置target对象的name属性等于value。
  *   如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
  *   注意，如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，
  *   而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。
  *   如果第一个参数不是对象，Reflect.set会报错。
  * 
  *   Reflect.has方法对应name in obj里面的in运算符。如果Reflect.has()方法的第一个参数不是对象，会报错。
  *   
  *   Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。
  *   如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。
  *   如果Reflect.deleteProperty()方法的第一个参数不是对象，会报错
  * 
  *   Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。
  *   如果Reflect.construct()方法的第一个参数不是函数，会报错。
  * 
  *   Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。
  *   Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。
  * 
  *   Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），
  *   对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。
  *   如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错。
  * 
  *   Reflect.apply方法等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。
  * 
  *   Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。
  * 
  *   Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象
  * 
  *   Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。
  * 
  *   Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展
  * 
  *   Reflect.ownKeys方法用于返回对象的所有属性，
  *   基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
  * 
  */

 function Greeting(name) {
  this.name = name;
}

// new 的写法
var instance = new Greeting('张三');

// Reflect.construct 的写法
var instance = Reflect.construct(Greeting, ['张三']);

const ages = [11, 33, 12, 54, 18, 96];

// 旧写法
var youngest = Math.min.apply(Math, ages);
var oldest = Math.max.apply(Math, ages);
var type = Object.prototype.toString.call(youngest);

// 新写法
var youngest = Reflect.apply(Math.min, Math, ages);
var oldest = Reflect.apply(Math.max, Math, ages);
var type = Reflect.apply(Object.prototype.toString, youngest, []);


/**
 * 所谓Promise,简单来说就是一个容器，里面保存着一个未来才结束的事件（通常是一个异步操作）的结果
 */

 /**
  * Iterator为各种不同的数据结构提供统一的访问机制
  * Iterator的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；
  * 二是使得数据结构的成员能够按某种次序排列；三是ES6创造了一种新的遍历命令for...in循环，Iterator接口让要提供for...in消费
  * 遍历过程
  * （1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象
  * （2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
  * (3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
  * 
  */

  /**
   * 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。
   * javascript 语言是传值调用 在javascript中Thunk函数替换的不是表达式，而是多参数函数，
   * 将其替换成一个只接受回调函数作为参数的单参数函数
   */

   // es5
   var THunk = function(fn) {
     return function() {
       var args = Array.prototype.slice.call(arguments);
       return function(callback) {
         args.push(callback);
         return fn.apply(this, args);
       }
     }
   }

   // es6
   var Thunk = function(fn) {
     return function(...args) {
       return function(callback) {
         return fn.call(this, ...args, callback);
       }
     }
   }

   function f(a, b, c, cb) { cb(a, b, c)};
   var ft = Thunk(f);
   ft(1, 2, 3)(console.log); // 1, 2, 3

   function thunkify(fn) {
     return function() {
       var args = new Array(arguments.length);
       var ctx = this;
       for (var i = 0; i < args.length; i++) {
         args[i] = arguments[i];
       }

       return function (done) {
         var called;

         args.push(function () { // 让回调函数是运行一次
           if (called) return;
           called = true;
           done.apply(null, arguments);
         });

         try {
           fn.apply(ctx, args);
         } catch (err) {
           done(err);
         }
       }
     }
   }

/**
 * es5的继承，实质上是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）.
 * es6的继承机制完全不同，实质上是先将父类实例对象属性和方法加到this上面（所以必须先调super方法），然后
 * 在用子类的构造函数修改this
 * 
 * 只有在子类调用super()方法才能使用this 因为子类实例的构建是基于父类实例
 * 
 * 父类的静态方法也会被子类继承
 * 
 * 如果子类没有构造函数会被默认添加
 * 
 * Object.getPrototypeOf()方法可以从子类上获取父类
 * 
 * super函数调用，代表父类的构造函数 只能在子类的构造函数里面使用
 * super做对象时，在普通方法中指向父类的原型， 在静态方法中，指向父类
 * 由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
 * ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
 * 在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。
 *  super 虽然代表父类A的构造函数，但是返回的是子类B的实例， 即super内部的this指向B的实例，因此super()在这里相当于
 * A.prototype.constructor.call(this);
 * 
 * 大多数浏览器的es5实现之中，每个对象都有__proto__属性，指向对应的构造函数的Prototype属性。
 * class作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链
 * （1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
 * （2）子类的prototype属性的__proto__属性，表示方法继承，总是指向父类的prototype属性
 * 
 */

class A {}

class B extends A {
  constructor() {
    super();
  }
}


/**
 * Es6和commonjs模块完全不同 有两个重大差异
 * commonJs模块输出的是一个值的拷贝（也就是说一旦输出一个值，模块内部的变化就影响不到这个值），
 * es6输出的是值的引用 JS引擎对脚本静态分析的时候，遇到模块加载命令import,就会生成一个只读引用。等到脚本真正执行时
 * 再根据这个只读引用，到被加载的模块去取值 因此ES6的引用是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块
 * export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例
 * commonJS是运行时加载，Es6模块是编译时输出接口
 * 
 * 第二个差异是因为CommonJS加载的是一个对象（即module.exports属性），该对象只有在脚本运行才会生成。
 * 而ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就是生成
 */

 /**
  * 二进制数组由三类对象组成
  * （1）ArrayBuffer对象：代表内存之中的一段二进制数据，可以通过“视图”进行操作。
  * “视图”部署了数组接口，这意味着，可以用数组的方法操作内存
  * （2）TypedArray视图：共包括9种类型的视图，比如Uint8Array（无符号8位整数）数组视图，
  * Int16Array（16位整数）数组视图，Float32Array（32位浮点数）数组视图等等。
  * （3）DataView视图：可以自定义复合格式的视图，比如第一个字节是Uint8(无符号8位整数)
  * 第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，此外还可以自定义字节序。
  * 
  * 简单来说，ArrayBuffer对象代表原始的二进制数据，TypeArray视图用来读写简单的类型的二进制数据，
  * DataView用来读取复杂的二进制数据
  * 
  * TypedArray视图支持的数据类型一共有 9 种（DataView视图支持除Uint8C以外的其他 8 种）。
  * 数据类型	字节长度	含义	对应的 C 语言类型
    Int8	1	8 位带符号整数	signed char
    Uint8	1	8 位不带符号整数	unsigned char
    Uint8C	1	8 位不带符号整数（自动过滤溢出）	unsigned char
    Int16	2	16 位带符号整数	short
    Uint16	2	16 位不带符号整数	unsigned short
    Int32	4	32 位带符号整数	int
    Uint32	4	32 位不带符号的整数	unsigned int
    Float32	4	32 位浮点数	float
    Float64	8	64 位浮点数	double
      * 
    
  */
 