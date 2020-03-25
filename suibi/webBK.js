// Object.entries 获取对象的键值对
// Ojbect.FromEntries 把键值对列表转成对象
let arr = {foo: 'hello', bar: 100};
let map = new Map(Object.entries(arr));

// 
map = new Map([['foo', 'hello'], ['bar', 100]]);
let obj = Object.fromEntries(map);

// js 数据存放 基础数据类型 number boolean null undefined symbol string 放在栈中
// 引用数据类型 object 放在堆中 栈里存放引用地址

// v8新生代内存（临时分配内存） 和 老生代内存（常驻内存）

/**
    this是javascript的关键字之一。它是对象自动生成的一个内部对象，只能在对象内部使用。随着函数使用场合的不同，this
    值会发生变化
    this指向什么，完全取决于什么以什么方式调用，而不是创建时。
 */
