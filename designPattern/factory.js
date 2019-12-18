function createPerson(name, age) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.feature = function() {
        console.log('aaa');
    }
    return o;
}
var person = createPerson('张三', 24);
var person2 = createPerson('李四', 22);

function Person(name, age) {
    this.name = name;
    this.age = age;
    this.feature = function() {};
}
var person3 = Person('赵六', 26);

// 工厂模式的好处是什么呢