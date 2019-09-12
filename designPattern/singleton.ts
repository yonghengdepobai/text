// singleton 这种模式提供了一种将代码组织为一个逻辑单元的手段
//  单例 是一个只能被 实例化一次并且通过一个众所周知的访问点访问类
// 单例是一个用来划分命名空间并将一批相关方法和属性组织在一起的对象，如果它可以被实例化，那它只能被实例化一次

// 1可以用对象字面量直接创建
var singleton_ = {attribute1: '', method1() {}};

// 组成 包含着方法和属性成员的对象自身，以及用于访问它的变量
var NameSpace;
NameSpace.singleton = (function() {
    //private members
    var privateAttribute1;
    function privateMethod1() {}
    return {
        // public members
         publicAttribute1: '',
         publicMethod1() {}
    };
})();

NameSpace.singleton_ = (function() {
    // private members
    // var privateAttribute1;
    // function privateMethod1() {}
    var uniqueInstance; // private attribute that holds the single instance

    function constructor() { // All of the normal singleton code goes here.
        // todo
    }
    return {
        getInstance: function() {
            if (!uniqueInstance) { // Instaniate only if the instance doesn't exist
                uniqueInstance = constructor;
            }
            return uniqueInstance;
        },
    }

})();

// 分支（branching）是一种用来把浏览器间的差异封装到在运行期间进行设置的动态方法中的技术
    function sTrue() {return ''}
NameSpace.singleton = (function() {
    //private members
    var privateAttribute1;
    function privateMethod1() {}

    var objectA = {}
    var objectB = {}

    return sTrue() ? objectA : objectB;
})();