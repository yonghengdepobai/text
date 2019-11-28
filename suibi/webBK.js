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
