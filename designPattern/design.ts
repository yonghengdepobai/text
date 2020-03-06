// AOP
Function.prototype['before'] = function(beforefn) {
    var _self = this; // 保存原函数的引用
    return function(...args) { // 返回包含了原函数和新函数的’代理‘函数
        beforefn.apply(this, args); // 执行新函数，修正this
        return _self.apply(this, args); // 执行原函数；
    }
}

Function.prototype['after'] = function(afterfn) {
    var _self = this;
    return function(...args) {
        var ret = _self.apply(this, args);
        afterfn.apply(this, args);
        return ret;
    }
}
var func = function() {
    console.log(2);
}
func = func.before(function() {
    console.log(1);
}).after(function() {
    console.log(3)
});
func();



// 策略模式
function calculateBonus(performancelLevel, salary) { // 原始处理
    if (performancelLevel === 'S') {
        return salary * 4;
    }
    if (performancelLevel === 'A') {
        return salary * 3;
    }
    if (performancelLevel === 'B') {
        return salary * 2;
    }
}

var performanceS = function() {};
performanceS.prototype.calculate = function(salary) {return salary * 4}
var performanceA = function() {};
performanceS.prototype.calculate = function(salary) {return salary * 3}
var performanceB = function() {};
performanceS.prototype.calculate = function(salary) {return salary * 2}
var Bonus = function() {
    this.salary = null;
    this.strategy = null;
};
Bonus.prototype.setSalary = function(salary) {this.salary = salary};
Bonus.prototype.setStrategy = function(strategy) {this.strategy = strategy};
Bonus.prototype.getBonus = function() {
    return this.strategy.calculate(this.salary);
}

// 使用
var bonus = new Bonus();
bonus.setSalary(10000);
bonus.setStrategy(new performanceS());
console.log(bonus.getBonus()); // 与上面对比有无优化？？？

// js策略模式
var strategies = {
    S: function(salary) {return salary * 4},
    A: function(salary) {return salary * 3},
    B: function(salary) {return salary * 2},
} 
var calculateBonus_ = function(level, salary) {return strategies[level](salary)};

// 通过策略消除了原程序中大片的条件分支语句
// 策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择议语句

// 代理
// demo 虚拟代理 实现图片预加载

// 创建一个普通本体对象，这个对象负责往页面中创建一个img标签，并提供一个setSrc接口，外界调用这个接口，便可以给img
// 标签设置src属性
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();
// myImage.setSrc('http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');

// 引入一个代理
var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage.setSrc(img.src);
    }
    return {
        setSrc: function(src) {
            myImage.setSrc('../loading.gif');
            img.src = src;
        }
    }
})();
proxyImage.setSrc('url');

// 不用代理实现
var Image_no = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    var img = new Image();
    img.onload = function() {
        imgNode.src = img.src;
    }
    return {
        setSrc: function(src) {
            imgNode.src = './loading.gif';
            img.src = src;
        }
    }
})();
Image_no.setSrc('url');

// 虚拟代理合并HTTP请求
// 原
var synchronousFile = function(id) {
    console.log('开始同步文件' + id);
}
var checkbox = document.getElementsByTagName('input');
for (let i = 0; i < checkbox.length; i++) {
    let c = checkbox[i];
    c.onclick = function() {
        if (c.checked === true) {
            synchronousFile(c.id);
        }
    }
}

// 代理
var proxySynchronousFile = (function() {
    var cache = [], timer;
    return function(id) {
        cache.push(id);
        if (timer) { // 保证不覆盖已经启动的定时器
            return;
        }
        timer = setTimeout(function() {
            synchronousFile(cache.join(','));
            clearTimeout(timer);
            timer = null;
            cache.length = 0;
        }, 2000);
    }
})();
for (let i = 0; i < checkbox.length; i++) {
    let c = checkbox[i];
    c.onclick = function() {
        if (c.checked === true) {
            proxySynchronousFile(c.id);
        }
    }
}

// 懒加载
var cahce = [];
var miniConsole = {
    log: function(...args) {
        
        cahce.push(function() {
            return miniConsole.log.apply(miniConsole, args);
        });
    }
}
miniConsole.log(1);

// 加载
var handler = function(ev) {
    if (ev.keyCode == 113) {
        var script = document.createElement('script');
        script.onload = function() {
            for (let i = 0; i < cahce.length; i++) {
                let fn = cahce[i];
                fn();
            }
        }
        script.src = 'minConsole.js'; // 加载miniConsole.js 加载后里面的miniConsole对象会覆盖现有对象
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}

document.body.addEventListener('keydown', handler, false); 
// true 捕获期执行（从外往里触发事件） false冒泡期执行(从里往外触发事件)

// 对上面代码整理
var miniConsole_ = (function() {
    var cache = [];
    var handler = function(ev) {
        if (ev.keyCode == 113) {
            var script = document.createElement('script');
            script.onload = function() {
                for (let i = 0; i < cahce.length; i++) {
                    let fn = cahce[i];
                    fn();
                }
            }
            script.src = 'minConsole.js'; // 加载miniConsole.js 加载后里面的miniConsole对象会覆盖现有对象
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
    
    document.body.addEventListener('keydown', handler, false); 
    return {
        log: function(...args) {
            cahce.push(function() {
                return miniConsole.log.apply(miniConsole, args);
            });
        }
    }
})();

// miniConsole.js
miniConsole = { 
    log: function(...args) {
        // 略
        console.log(...args);
        console.log(Array.prototype.join.call(arguments))
    }
}

// 缓存代理 计算结果
var mult = function(...args) {
    console.log('开始计算mult');
    var a = 1;
    for (let i = 0, l = args.length; l < i; i++) {
        a = a * args[i];
    }
    return a;
}
var plus = function(...args) {
    var a = 0;
    for (let i = 0, l = args.length; l < i; i++) {
        a = a + args[i];
    }
    return a;
}
// 创建缓存代理工厂
var createProxyFactory = function(fn) {
    var cache = {};
    return function(...args) {
        let arg = args.join(',');
        if (arg in args) {
            return cahce[arg];
        } else {
           return cache[arg] = fn.apply(this, args); // fn(...args);
        }
    }
}
var proxyMult = createProxyFactory(mult);
var proxyPlus = createProxyFactory(plus);

// 迭代器
// 自已的迭代器
var each = function(arry, callback) {
    for (var i = 0, l = arry.length; i < l; i++) {
        callback.call(arry[i], i, arry[i]);
    }
}

// 外部迭代器
var Iterator = function(obj) {
    var current = 0;
    var next = function() {
        current += 1;
    }
    var isDone = function() {
        return current >= obj.length;
    }
    var getCurrItem = function() {
        return obj[current];
    }
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem,
    }
}


// 观察者
var salesOffices = {// 定义一个发布消息的 被观察者
    clientList: {}, // 缓存列表，存放订阅者的回调 观察者
    listen: function(key, fn) { // 给缓存列表 添加 不同种类的订阅者
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function(...args) { // 发布消息
        let fns = this.clientList[args.shift()];
        if (!fns || fns.length === 0) { // 没有订阅者 订阅这一个消息
            return false;
        }
        for (var i = 0; i < fns.length; i++) {
            let fn = fns[i];
            fn.apply(this, args);
        }
    },
    remove: function(key, fn) {
        var fns = this.clientList[key];
        if (!fns) {
            return false
        }
        if (!fn) { // 没有传入具体的订阅者，表示取消所有key对应的消息
            fns && (fns.length = 0);
        } else {
            for (let l = fns.length - 1; l > -1; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1); // 删除订阅者
                }
            }
        }
    }

};

salesOffices.listen('888平', function(price){
    console.log('price=' + price);
});
salesOffices.listen('666平', function(price){
    console.log('price=' + price);
});

salesOffices.trigger('888平', 20000);


// 一个登录 demo 其别
var $, login, header, nav, message, cart, address;
$.ajax( 'http:// xxx.com?login', function(data){ // 不用观察者
    login.succ(function( data ){
        header.setAvatar( data.avatar);
        nav.setAvatar( data.avatar );
        message.refresh();
        cart.refresh();
        address.refresh(); // 增加这行代码
       }); 
});

// 用
$.ajax('url', function(data) {
    login.trigger('loginSucc', data); // 发布登录成功的消息
})

header = (function() {
    login.listen('loginSucc', function(data){
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置header模块的头像');
        }
    }
})();
nav = (function() {
    login.listen('loginSucc', function(data) {
        nav.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置nav模块的头像');
        }
    }
})();

// 一个全局的Event
var Event_ = (function() {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function(...args) {
        var arg = args.shift(), fns = clientList[arg];
        if (!fns && fns.length === 0) {
            return;
        }
        for (let i =0; i < fns.length; i++) {
            let fn  = fns[i];
            fn.apply(fn, args);
        }
    }

    remove = function(key, fn) {
        var fns = clientList[key];
        if (!fns) {
            return;
        }
        if (!fn) {
            fns && (fns.length = 0);
            fns = [];
        }
        for (let l = fns.length; l > -1; l--) {
            var _fn = fns[l];
            if (_fn === fn) {
                fns.splice(l, 1);
            }
        }
    }

    return {
        listen,
        trigger,
        remove
    }

})();


var Event_n = (function() {
    var global = this,
        Event,
        _default = 'default';
    Event = function() {
        var _listen, _trigger, _remove, namespaceCache = {},
        _create, find, each = function(ary, fn) {
            var ret;
            for(let i = 0; i < ary.length; i++) {
                let n = ary[i];
                ret = fn.call(n, i, n);
            }
            return ret;
        };

        _listen = function(key, fn, cache) {
            if (!cahce[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function(key, fn, cache) {
            if (cache[key]) {
                if (fn) {
                    for (let l = cache[key]; l > -1; l--) {
                        let f = cache[key][l];
                        if (fn === f) {
                            cache[key].splice(l, 1);
                        }
                    }
                } else {
                    cache[key] = [];
                }
            }
        };
        _trigger = function(...args) {
            let key = args.shift(),
                cache = args.shift(),
                _slef = this,
                ret,
                stack = cache[key];
            if (!stack || stack.length === 0) {
                return;
            }
            // 
            // return each(stack, function(index, item) {
            //     return this.apply(_slef, [index, item]);
            // }) == 下面这个
            // 目的是调用stack里面的所有方法
            // for(let i = 0; i < stack.length; i++) {
            //     let fn = stack[i];
            //     fn.call(_slef, args);
            // }
            // let efn = function() {
            //     let ret = this.apply(_slef, args);
            //     return ret;
            // }
            return each(stack, function() {
                return this.apply(_slef, args);
            });
        }

        _create = function(namespace) {
            var namespace = namespace || _default;
            var cahce = {},
                offlineStack = [],
                ret = {
                    listen: function(key, fn, last) {
                        _listen(key, fn, cahce);
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === 'last') {
                            offlineStack.length && offlineStack.pop()();
                        } else {
                            each(offlineStack, function() {
                                this();
                            })
                        }
                        offlineStack = null;
                    },
                    one: function(key, fn, last) {
                        _remove(key, fn , cahce);
                        this.listen(key, fn, last);
                    },
                    remove: function(key, fn) {
                        _remove(key, fn, cahce);
                    },
                    trigger: function(...args) {
                        var fn,
                            _slef = this;
                        
                        args.unshift(cahce);
                        fn = function() {
                            return _trigger.apply(_slef, args);
                        }
                        if (offlineStack) {
                            return offlineStack.push(fn);
                        }
                        return fn();

                    }
                }

                // ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
                //     namespaceCache[ namespace ] = ret ) 
                return namespace ? (namespaceCache[namespace] || (namespaceCache[namespace] = ret)) : ret;

        }
        return {
            create: _create,
            one: function(key, fn,last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function( key,fn ){
                var event = this.create( );
                event.remove( key,fn );
            },
            listen: function( key, fn, last ){
                var event = this.create( );
                event.listen( key, fn, last );
            },
            trigger: function(...args) {
                var event = this.create();
                event.trigger.apply(this, ...args)
            }
        }
    }
})();

// 命令模式
// 菜单demo
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
var button3 = document.getElementById('button3');

var setCommand = function(button, command) { // 设置命令
    button.onclick = function() {
        command.execute();
    }
}

var MenuBar = {
    refresh: function() {
        console.log('刷新菜单');
    }
};
class MenuBar_ {
    refresh() {

    }
}

var subMenu = {
    add: function() {
        console.log('增加子菜单');
    },
    del: function() {
        console.log('删除子菜单');
    }
}

var RefreshMenBarCommand = function(receiver) {
    this.receiver = receiver;
}
RefreshMenBarCommand.prototype.execute = function() {
    this.receiver.refresh();
}
class RefreshMenBarCommand_ { // class表达上面的内容
    receiver;
    constructor(receiver: Object) {
        this.receiver = receiver;
    }
    execute() {
        this.receiver.refresh();
    }
}

var AddSubMenuCommand = function(receiver) {
    this.receiver = receiver;
}
AddSubMenuCommand.prototype.execute = function() {
    this.receiver.refresh();
}
var DelSubMenuCommand = function(receiver) {
    this.receiver = receiver;
}
DelSubMenuCommand.prototype.execute = function() {
    this.receiver.refresh();
}

var refreshMenuCommand = new RefreshMenBarCommand(MenuBar);
var addSubmenuCommand = new AddSubMenuCommand(subMenu);
var delSubmenuCommand = new DelSubMenuCommand(subMenu);

// 在这里可以造一个工厂函数生成 command

setCommand(button1, refreshMenuCommand);
setCommand(button2, addSubmenuCommand);
setCommand(button3, delSubmenuCommand);

// 就是把调用函数用对象封装一下

// 组合模式

var MacroCommand = function() {
    return {
        commandsList: [],
        add: function(command) {
            this.commandsList.push(command);
        },
        execute: function() {
            for (let i = 0; i < this.commandsList.length; i++) {
                let command = this.commandsList[i];
                command.execute();
            }
        }
    }
}

var openAcCommand = {
    execute: function() {
        console.log('打开空调');
    }
}
var openTvCommand = {
    execute: function() {
        console.log('打开电视');
    }
}
var openSoundCommand = {
    execute: function() {
        console.log('打开音响');
    }
};
var macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);

var closeDoorCommand = {
    execute: function() { console.log('关门');}
};
var openPcCommand = {execute: function() {console.log('打开电脑');}};
var openQQCommand = {execute: function() {console.log('登录QQ');}};
var macroCommand2 = MacroCommand();
macroCommand2.add(closeDoorCommand);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQCommand);

var macroCommand = MacroCommand();
macroCommand.add(openAcCommand);
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);

var setCommandM = (function(command) {
    document.getElementById('button').onclick = function() {
        command.execute();
    }
})(macroCommand);

var Folder = function(name) {
    this.name = name;
    this.files = [];
    this.parent = null;
}
Folder.prototype.add = function(file) {
    this.files.push(file);
    file.parent = this;
}
Folder.prototype.scan = function() {
    console.log('开始扫描文件夹:' + this.name);
    for (let i = 0; i < this.files.length; i++) {
        let file= this.files[i];
        file.scan();
    }
}

var File_ = function(name) {
    this.name = name;
    this.parent = null;
}
File_.prototype.add = function() {
    throw new Error('文件不能添加文件');
}
File_.prototype.scan = function() {
    console.log('开始扫描文件：' + this.name)
}

// 模板方法设计
// demo咖啡与茶

var Coffee = function() {}
Coffee.prototype.boilWater = function() {
    console.log('把水煮沸');
}
Coffee.prototype.brewCoffeeGriends = function() {
    console.log('用沸水冲泡咖啡');
}
Coffee.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子');
}
Coffee.prototype.addSugarAndMiki = function() {
    console.log('加糖和牛奶');
}
Coffee.prototype.init = function() {
    this.boilWater();
    this.brewCoffeeGriends();
    this.pourInCup();
    this.addSugarAndMiki();
}
class Coffee_ {
    constructor() {

    }
    boilWater() {

    }
    brewCoffeeGriends() {}
    pourInCup() {}
    addSugarAndMiki() {}
    init() {}
}

var Tea = function() {}
Tea.prototype.boilWater = function() {
    console.log('把水煮沸');
}
Tea.prototype.steepTeaBag = function() {
    console.log('用沸水浸泡茶叶');
}
Tea.prototype.pourInCup = function() {
    console.log('把茶水倒进杯子');
}
Tea.prototype.addLemon = function() {
    console.log('加柠檬');
}
Tea.prototype.init = function() {
    this.boilWater();
    this.steepTeaBag();
    this.pourInCup();
    this.addLemon();
}
class Tea_ {
    init(){}
    boilWater() {}
    steepTeaBag() {}
    pourInCup() {}
    addLemon() {}
}

var Beverage = function() {}
Beverage.prototype.boilWater = function() { console.log('把水煮沸');}
Beverage.prototype.brew = function() {}
Beverage.prototype.pourInCup = function() {}
Beverage.prototype.addCondiments = function() {}
Beverage.prototype.init = function() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
}
abstract class Beverage_ {
    boilWater() { console.log('把水煮沸');}
    abstract brew();
    abstract pourInCup();
    abstract addCondiments();
    customerWantsCondiments() {
        return true; // 做为一个钩子方法 判断用户是否要加调料 默认为true 
    };
    init() {
        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();
        if (this.customerWantsCondiments()) { // 判断钩子看看客户是否加调料 默认要加
            // 如果子类不想加 就自已覆盖customerWantsCondiments这个方法
            this.addCondiments();
        }
    }
}
var Coffee = function() {}
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function() {
    console.log('用沸水冲泡咖啡');
}
Coffee.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子');
}
Coffee.prototype.addCondiments = function() {
    console.log('加糖和牛奶');
}
class Coffee__ extends Beverage_ {
    constructor() {
        super();
    }
    pourInCup() {}
    brew() {}
    addCondiments() {}
    // init() {
    //     // this.brew();
    //     // this.pourInCup();
        
    // }
}
var coffee = new Coffee();
coffee.init();
// abstract class aa {

// }

// 例中 Beverage.prototype.init 才是模板方法， 该方法封装了子类的算法框架


// 享元模式

// 假设有个内衣工厂，目前的产品有 50 种男式内衣和 50 种女士内衣，为了推销产品，工厂决
// 定生产一些塑料模特来穿上他们的内衣拍成广告照片。 正常情况下需要 50 个男模特和 50 个女
// 模特，然后让他们每人分别穿上一件内衣来拍照。不使用享元模式的情况下，在程序里也许会这
// 样写：

var Model_ = function(sex, underwear) {
    this.sex = sex;
    this.underwear = underwear;
}
Model_.prototype.takePhoto = function() {
    console.log(`sex= ${this.sex} underwear= ${this.underwear}`);
}

for(let i = 0; i < 50; i++) {
    var maleModel = new Model_('male', 'underwear' + (i + 1));
    maleModel.takePhoto();
}
for (let i = 0; i < 50; i++) {
    var femalModel = new Model_('female', 'underwear' + (i + 1));
    femalModel.takePhoto();
}

// 改
var Model = function(sex) {
    this.sex = sex;
}
Model.prototype.takePhoto = function() {
    console.log(`sex= ${this.sex} underwear= ${this.underwear}`);
}
var maleModel = new Model('male'), femaleModel = new Model('female');
for (let i = 0; i < 50; i++) {
    maleModel.underwear = 'underwear' + (i + 1);
    maleModel.takePhoto();
}
for (let i = 0; i < 50; i++) {
    femaleModel.underwear = 'underwear' + (i + 1);
    femaleModel.takePhoto();
}

// demo 多文件上传
var id = 0;

var startUpload = function(uploadType, files) { // 区分是控件还是flash
    for (let i =0; i < files.length; i++) {
        let file = files[i];
        var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
        uploadObj.init(id++);
    }
}

var Upload = function(uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
}
Upload.prototype.init = function(id) {
    var that = this;
    this.id = id;
    this.dom = document.createElement('div');
    this.dom.innerHTML = `
        <span>文件名称：${this.fileName}，文件大小：${this.fileSize}</span>
        <button class='delFile'>删除</button>
    `;
    this.dom.querySelectory('.delFile').onclick = function() {
        that.delFile();
    }
    document.body.appendChild(this.dom);
}
Upload.prototype.delFile = function() {
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗？' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
}
    startUpload( 'plugin', [
    {
    fileName: '1.txt',
    fileSize: 1000
    },
    {
    fileName: '2.html',
    fileSize: 3000
    },
    {
    fileName: '3.txt',
    fileSize: 5000
    }
   ]);
   startUpload( 'flash', [
    {
    fileName: '4.txt',
    fileSize: 1000
    },
    {
    fileName: '5.html',
    fileSize: 3000
    },
    {
    fileName: '6.txt',
    fileSize: 5000
    }
   ]); 

// 改为享元上传
var Upload_ = function(uploadType) {
    this.uploadType = uploadType;
}
Upload.prototype.delFile = function(id) {
    uploadManager.setExternalState(id, this);
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗？' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
}

// 工厂进行对象实例化
var UploadFactory = (function() {
    var createdFlyWeightObjs = {};
    return {
        create(uploadType) {
            if (createdFlyWeightObjs[uploadType]) {
                return createProxyFactory[uploadType];
            }
            return createdFlyWeightObjs[uploadType] = new Upload_(uploadType);
        }
    }
})();

var uploadManager = (function() {
    var uploadDatabase = {};

    return {
        add(id, uploadType, fileName, fileSize) {
            var flyWeightObj = UploadFactory.create(uploadType);
            var dom = document.createElement('div');
            dom.innerHTML = `
                <span>文件名称：${fileName}，文件大小：${fileSize}</span>
                <button class='delFile'>删除</button>
            `;
            (dom.querySelector('.delFile') as HTMLElement).onclick = function() {
                flyWeightObj.delFile(id);
            }
            document.body.appendChild(dom);
            uploadDatabase[id] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            }
            return flyWeightObj;
        },
        setExternalState: function(id, flyWeightObj) { // 获取对象
            var uploadData = uploadDatabase[id];
            // flyWeightObj = 
            for (let i in uploadDatabase) {
                flyWeightObj[i] = uploadData[i]; // 设置外部属性
            }
        }
    }
})();
startUpload = function(uploadType, filse) {
    for (let i = 0; i < filse.length; i++) {
        let file = filse[i];
        var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
    }
}

// 对象池demo

var toolTipFactory = (function() {
    var toolTipPool = []; // toolTip对象池

    return {
        create() {
            if (toolTipPool.length === 0) { // 对象池为空
                var div = document.createElement('div');
                document.body.appendChild(div);
                return div;
            } else {
                return toolTipPool.shift(); // 从对象池中取出一个
            }
        },
        recover(tooltipDom) {
            return toolTipPool.push(tooltipDom); // 对象池回收dom
        }
    }
})();

// 通用对象池
var objectPoolFactory = function(createObjFn) {
    var objectPool = [];
    return {
        create(...args) {
            var obj = objectPool.length === 0 ?
            createObjFn.apply(this, args) : objectPool.shift();
            return obj;
        },
        recover(obj) {
            objectPool.push(obj);
        }
    }
};

// 装载一个iframe对象池
var iframeFactory = objectPoolFactory(function() {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.onload = function() {
        iframe.onload = null; // 防止iframe重复加载的bug
        iframeFactory.recover(iframe); // iframe加载完之后回收节点
    }

    return iframe;
});


// 职责链模式
// demo 定金用户 定金多少 是否交 库存

/**
 * 
 * @param orderType 用户类型是否下了订金订单 订金多少
 * @param pay 是否支付
 * @param stack 库存
 */
var order = function(orderType, pay, stack) {
    if (orderType === 1) { // 500元定金购买模式
        if (pay === true) { // 交了钱的
            console.log('交了500元定金，可以减100元尾款');
        } else {
            if (stack > 0) {
                console.log('有存库，正常支付');
            } else {
                console.log('无库存，无法购买');
            }
        }
    } else if (orderType === 2) { // 200元定金模式
        if (pay === true) { // 交了钱
            console.log('交了200无定金，可以减50元尾款');
        } else {
            if (stack > 0) {
                console.log('有存库');
            } else {

            }
        }
    }
}

// 上面通if判断 太多难读 重构
var order500 = function(orderType, pay, stack) {
    if (orderType ===1 && pay === true) {
        console.log('支付500定金')
    } else {
        // order200(orderType, pay, stack); // 这样直接调用函数 耦合太大 改为向后请求
        return 'nextSuccessor'; // 我不知道下一节点是谁，反正把请求往后面传递
    }
}
var order200 = function(orderType, pay, stack) {
    if (orderType === 2 && pay === true) {
        console.log('支付200定金');
    } else {
        // orderNormal(orderType, pay, stack);
        return 'nextSuccessor'; // 我不知道下一节点是谁，反正把请求往后面传递
    }
}
var orderNormal = function(orderType, pay, stack) {
    if (stack > 0) {
        console.log('可以购买');
    } else {
        console.log('没货');
    }
}
// 把函数包装进职责链节点，定义一个构造函数Chain, 在New Chain的时候传递的参数即为需要被包装的函数，同时它还拥
// 有一个实例属性this.successor,表示在链中的下一个节点
var Chain = function(fn) {
    this.fn = fn;
    this.successor = null;
}
Chain.prototype.setNextSuccessor = function(successor) { // 指定在链中的下一个节点
    this.successor = successor;
}

Chain.prototype.passRequest = function(...args) { // 传递给请求的某个节点
    var ret = this.fn.apply(this, args);
    if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor, args);
    }
    return ret;
}
Chain.prototype.nexr = function(...args) { // 手动传递请求给下一个节点
    return this.successor && this.successor.passRequest.apply(this.successor, args);
}
var orderAjax = function(orderType, pay, stack) {
    console.log('ajax');
    var _self = this;
    setTimeout(function() {
        _self.next(); // 在导步里没法返回 nextSuccessor 只能手动调用下个节点
    }, 2000)
}
// 开始包装为节点
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);
// 指定顺序
chainOrder500.nextSuccessor(chainOrder200);
chainOrder200.nextSuccessor(chainOrderNormal);
// 最后传给第一个节点
chainOrder500.passRequest(1, true, 500);


// 中介者
// demo
function Player(name, teamColor) {
    this.name = name;
    this.enemy = null; // 敌人
    this.partners = [];
    this.enemies = [];
    this.state = 'live';
    this.teamColor = teamColor;
}
Player.prototype.win = function() {
    console.log(this.name + 'win');
}
Player.prototype.lose = function() {
    console.log(this.name + 'lost');
}
Player.prototype.die = function() {
    this.lose();
    this.enemy.win();

    var all_dead = true;
    this.state = 'dead';
    for (var i = 0; i < this.partners.length; i++) {
        let partner = this.partners[i];
        if (partner.state !== 'dead') {
            all_dead = false;
            break;
        }
    }
    if (all_dead === true) {
        this.lose();
        for (let i = 0; i < this.partners.length; i++) {
            let partner = this.partners[i];
            partner.lose(); // 通知全队失败
        }
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            enemy.lose(); // 通知全队胜利
        }
    }

}
var player1 = new Player('p1', '');
var player2 = new Player('p2', '');
player1.enemy = player2;
player2.enemy = player1;
var p1, p2, p3, p4, p5, p6, p7, p8;
player1.partners = [p1, p2, p3, p4];
player1.enemies = [p5, p6, p7, p8];
player2.enemies = [p1, p2, p3, p4];
player2.partners = [p5, p6, p7, p8];


// 建一个工厂
var players = [];
var playerFactory = function(name, teamColor) {
    var newPlayer = new Player(name, teamColor);
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player.teamColor === newPlayer.teamColor) {
            player.partners.push(newPlayer);
            newPlayer.partners.push(player);
        } else {
            player.enemies.push(newPlayer);
            newPlayer.enemies.push(player);
        }
    }
    players.push(newPlayer);
    return newPlayer;
}

// 用中介者改造
// function Player_(name, teamColor) {
//     this.state = 'live';
//     this.teamColor = teamColor;
//     this.name = name;
// }
Player.prototype.die = function() {
    this.state = 'dead';
    playerDirector.reciveMessage('playDead', this); // 给中介者发消息，玩家死亡
}
Player.prototype.remove = function() {
    playerDirector.reciveMessage('removePlayer', this); // 给中介发消息，移除玩家
}
Player.prototype.changeTeam = function() {
    playerDirector.reciveMessage('changeTeam', this);
}

var playFactor = function(name, teamColor) {
    var newPlayer = new Player(name, teamColor);
    playerDirector.reciveMessage('addPlayer', newPlayer);
    return newPlayer;
}
var teamPlayers;
var playerDirector = (function() {
    var players = {}; // 保存所有的玩家
    var operations = {
        addPlayer(player) {
            var teamColor = player.teamColor;
            players[teamColor] = players[teamColor] || [];
            players[teamColor].push(player); // 添加玩家进队伍
        },
        removePlayer(player) {
            var teamColor = player.teamColor;
            teamPlayers = players[teamColor] || [];
            for (let i = 0; i < teamPlayers.length; i++) {
                let teamPlayer = teamPlayers[i];
                if (teamPlayer === player) {
                    teamPlayers.splice(i, 1);
                }
            }
        },
        playerDead(player) {
            var teamColor = player.teamColor;
            teamPlayers = players[teamColor];
            var all_dead = true;
            for (let i = 0; i < teamPlayers.length; i++) {
                let teamPlayer = teamPlayers[i];
                if (teamPlayer.stack !== 'dead') {
                    all_dead = true;
                }
            }
            if (all_dead === true) {
                for (var i = 0; i < teamPlayers.length; i++) {
                    player.lose();
                }
                for (var color in players) {
                    if (color !== teamColor) {
                        var tPlayer = players[color];
                        for (let i = 0; i < tPlayer.length; i++) {
                            tPlayer[i].win();
                        }
                    }
                }
            }
        }
    }; // 中介者可以执行的操作

    var reciveMessage = function(type, player) {
        // var message = Array.prototype.shift.call()
        operations[type].apply(this, [player]);

    }
    return {reciveMessage}

})();


// 装饰器模式
// demo
var Plane = function() {};
Plane.prototype.fire = function() {
    console.log('发射通子弹');
}
var MissileDecorator = function(plane) {
    this.plane = plane;
}
MissileDecorator.prototype.fire = function() {
    this.plane.fire();
    console.log("发射导弹");
}
var AtomDecorator = function(plane) {
    this.plane = plane;
}
AtomDecorator.prototype.fire = function() {
    this.plane.fire();
    console.log('发身原子弹');
}
var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire(); // 分别输出： 发射普通子弹、发射导弹、发射原子弹



// 状态模式
// demo 灯光
var Light = function() {
    this.state = 'off';
    this.button = null;
}
Light.prototype.init = function() {
    var button = document.createElement('button');
    var self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild(button);
    this.button.onclick = function() {
        self.buttonWasPressed();
    }
}
Light.prototype.buttonWasPressed = function() {
    if (this.state === 'off') {
        console.log('开灯');
        this.state === 'on';
    } else if (this.state === 'on') {
        console.log('关灯');
        this.state === 'off';
    }
}

// 当灯光有多个状态时
Light.prototype.buttonWasPressed = function() {
    if (this.state === 'off') {
        console.log('弱光');
        this.state === 'weakLight';
    } else if (this.state === 'weakLight') {
        console.log('强光');
        this.state === 'strongLight';
    } else if (this.state === 'strongLight') {
        console.log('关灯');
        this.state = 'off';
    }
}
// 使用状态模式优化
var OffLightState = function(light) {
    this.light = light;
}
OffLightState.prototype.buttonWasPressed = function() {
    console.log('弱光');
    this.light.setState(this.light.weakLightState);
}
var WeakLightState =function(light) {
    this.light = light;
}
WeakLightState.prototype.buttonWasPressed = function() {
    console.log('强光');
    this.light.setState(this.light.strongLightState);
}
var StrongLightState = function(light) {
    this.light = light;
}
StrongLightState.prototype.buttonWasPressed = function() {
    console.log('关灯');
    this.light.setState(this.light.OffLightState);
}
var Light = function() {
    this.offLightState = new OffLightState(this);
    this.weakLightState = new WeakLightState(this);
    this.strongLightState = new StrongLightState(this);
    this.button = null;
}
Light.prototype.init = function() {
    var button = document.createElement('button');
    var self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild(button);
    this.currState = this.offLightState;
    this.button.onclick = function() {
        self.currState.buttonWasPressed();
    }
}
Light.prototype.setState = function(newState) {
    this.currState = newState;
}

// demo 文件上传状态管理
//  文件在扫描状态中，是不能进行任何操作的，既不能暂停也不能删除文件，只能等待扫
// 描完成。扫描完成之后，根据文件的 md5 值判断，若确认该文件已经存在于服务器，则
// 直接跳到上传完成状态。如果该文件的大小超过允许上传的最大值，或者该文件已经损
// 坏，则跳往上传失败状态。剩下的情况下才进入上传中状态。
//  上传过程中可以点击暂停按钮来暂停上传，暂停后点击同一个按钮会继续上传。
//  扫描和上传过程中，点击删除按钮无效，只有在暂停、上传完成、上传失败之后，才能
// 删除文件。

window.external.upload = function(state) {
    console.log(state); // 可能为 sign, uploading, done, error;
}
var plugin = (function() {
    var plugin:any = document.createElement('embed') // embed定义嵌入的内容
    plugin.style.display = 'none';

    plugin.type = 'application/txftn-webkit';
    plugin.sign = function() {
        console.log('开始扫描');
    };
    plugin.pause = function() {
        console.log('暂停文件上传');
    };
    plugin.uploading = function() {
        console.log('开始文件上传');
    };
    plugin.del = function() {
        console.log('删除文件上传');
    }
    plugin.done = function() {
        console.log('文件上传完成');
    };

    document.body.appendChild(plugin);
    return plugin;
})();

Upload.prototype.init = function() {
    var that = this;
    this.dom = document.createElement('div');
    this.dom.innerHTML = 
    `
        <span>文件名称：${this.fileName}</span>
        <button data-action='button1'>扫描中</button>
        <button data-action='button2'>删除</button>
    `;

    document.body.appendChild(this.dom);
    this.button1 = this.dom.querySelector('[data-action="button1"');
    this.button2 = this.dom.querySelector('[data-action="button2"');
    this.bindEvent();
}
Upload.prototype.bindEvent = function() {
    var self = this;
    this.button1.onclick = function() {
        if (self.state === 'sign') {
            console.log('扫描中，点击无效...');
        } else if (self.state === 'uploading') { // 上传中，点击切换到暂停
            self.changeState('pause');
        } else if (self.state === 'pause') { // 暂停中，点击切换到上传
            self.changeState('uploading');
        } else if (self.state === 'done') {
            console.log('文件已完成上传，点击无效');
        } else if (self.state === 'error') {
            console.log('文件上传失败，点击无效');
        }
    }
    this.button2.onclick = function() {
        if (self.state === 'done' || self.state === 'error' || self.state === 'pause') {
            self.changeState('del'); // 上传完成，失败和暂停状态下可以删除
        } else if (self.state === 'sign') {
            console.log('文件正在扫描，不能删除');
        } else if (self.state === 'uploading') {
            console.log('文件正在上传，不能删除');
        }
    }
}

Upload.prototype.changeState = function(state) {
    switch(state) {
        case 'sign':
            this.plugin.sign();
            this.button1.innerHTML = '扫描中，任何操作无效';
            break;
        case 'uploading':
            this.plugin.uploading();
            this.button1.innerHTML = '正在上传，点击暂停';
            break;
        case 'pause':
            this.plugin.pause();
            this.button1.innerHTML = '已暂停，点击继续上传';
            break;
        case 'done':
            this.plugin.done();
            this.button1.innerHTML = '上传完成';
            break;
        case 'error':
            this.button1.innerHTML = '上传失败';
            break;
        case 'del':
            this.plugin.del();
            this.dom.parentNode.removeChild( this.dom );
            console.log( '删除完成' );
        break; 
    }
}

// 上面代码状态管理纷乱 下面状态模式优化

Upload = function(fileName) {{
    this.plugin = plugin;
    this.fileName = fileName;
    this.button1 = null;
    this.button2 = null;
    this.signState = new SignState(this);
    this.uploadState = new UploadState(this);
    this.pauseState = new PauseState(this);
    this.doneState = new DoneState(this);
    this.errorState = new ErrorState(this);
    this.currState = this.signState;
}}
// init不变
Upload.prototype.bindEvent = function() {
    var self = this;
    this.button1.onclick = function() {
        self.currState.clickHandler1();
    }
    this.button2.onclick = function() {
        self.currState.clickHandler2();
    }
}
Upload.prototype.sign = function(){
    this.plugin.sign();
    this.currState = this.signState;
};
Upload.prototype.uploading = function(){
    this.button1.innerHTML = '正在上传，点击暂停';
    this.plugin.uploading();
    this.currState = this.uploadingState;
}; 
Upload.prototype.pause = function() {
    this.button1.innerHTML = '已暂停，点击继续上传';
    this.plugin.pause();
    this.currState = this.pauseState; 
}
Upload.prototype.done = function(){
    this.button1.innerHTML = '上传完成';
    this.plugin.done();
    this.currState = this.doneState;
};
Upload.prototype.error = function(){
    this.button1.innerHTML = '上传失败';
    this.currState = this.errorState;
};
Upload.prototype.del = function(){
    this.plugin.del();
    this.dom.parentNode.removeChild( this.dom );
};
var StateFactory = (function() {
    var State = function(){};
    State.prototype.clickHandler1 = function() {
        throw new Error('必须重写1');
    }
    State.prototype.clickHandler2 = function() {
        throw new Error('必须重写2');
    }
    return function(param) {
        var F = function(uploadObj) {
            this.uploadObj = uploadObj;
        }
        F.prototype = new State();
        for (var i in param) {
            F.prototype[ i ] = param[ i ];
        }
        return F;
    }
})();
var SignState = StateFactory({
    clickHandler1() {
        console.log('扫描中，点击无效');
    },
    clickHandler2() {
        console.log('文件正在扫描不能删除');
    }
});

var UploadingState = StateFactory({
    clickHandler1: function(){
        this.uploadObj.pause();
    },
    clickHandler2: function(){
        console.log( '文件正在上传中，不能删除' );
    }
});
var PauseState = StateFactory({
    clickHandler1: function(){
        this.uploadObj.uploading();
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
});
var DoneState = StateFactory({
    clickHandler1: function(){
        console.log( '文件已完成上传, 点击无效' );
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
});
var ErrorState = StateFactory({
    clickHandler1: function(){
     console.log( '文件上传失败, 点击无效' );
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
}); 
