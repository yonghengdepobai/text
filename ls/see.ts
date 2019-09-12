
/**
 * 类和模块
 * 如果两个实例都从同一个原型对象上继承了属性，我们说它们是同一个类的实例
 * 使用new调用构造函数会自动创建一个新对象，因些构造函数本身只需要初始化这个新对象的状即可
 * 调用构造函数的一个重要特征，构造函数的prototype属性被用做新对象的原型 这意味着通过同一个构造函数创建的对象都继承自一个相同的的对象
 * 任何js函数都可以用作构造函数，并且调用构造函数是需要用到一个portotype属性的 因此每个函数都自动拥有一个prototype属性
 * （Function.bind()方法返回的函数除外） 这个属性的值是一个对象，这个对象包含唯一一个不可枚举属性constructor
 * constructor的属性值是一个函数对象
 * var F = function() {}; // 这是一个函数对象
 * var p = F.prototype; // 这是与F相关的原型对象
 * var c = p.constructor; // 这是与原型相关联的函数
 * c === F; // => true: 对于任意函数F.prototype.constructor == F
 * 
 * var o = new F(); // 创建类F的一个对象
 * o.constructor === F(); // true constructor 指代这个类
 * 
 * 实例字段 实例方法 类字段 类方法
 * 构造函数对象
 * 为js的类定义了名字。任何添加到这个构造函数的属性都是类字段和类方法（如果属性值是函数的话就是类方法）
 * 原型对象
 * 原型对象的属性被类的所有实例继承，如果原型对象的属性值是函数的话，这个函数就是作为类的实例方法来调用
 * 实例对象
 * 类的每个实例都是一个独立的对象，直接给这个实例定义的属性是不会为所有实例对象共享的
 * 定义类分三步
 * 第一步，先定义一个构造函数，并设置初始化新对象的实例属性。第二步，给构造函数的prototype对象定义实例的方法
 * 第三步给构造函数定义类字段和类属性
 * 
 * 子类
 * B.prototype = inherit(A.prototype); // 子类派生自父类
 * B.prototype.constructor = B; // 重载继承来的constructor属性
 * 
 */

 // 这个工厂方法返回一个新的‘范围对象’
 function range(from, to) {
   // 使用inherit()函数来创建对象，这个对象继承自在下面定义的的原型对象
   // 原型对象作为函数的一个属性存储，并定义所有‘范围对象’的所共享方法（行为）
   var r = inherit(range.methods); // 得到一个新对象 并将range.methods作为自已的原型

  // 存储新的‘范围对象’的起始位置和结束位置（状态）
  // 这两个属性是不可继承的，每个对象都有唯一的属性
  r.from = from;
  r.to = to;
  // 返回这个新的对象
  return r;

 }

 // 原型对象定义方法，这些方法为每个range对象继承
 range.methods = {
   // 如果x在范围内则返回true,否则返回false
   // 这个方法可以比较日期范围也比较字符串和日期
   includes: function(x) {
     return this.from <= x && x <= this.to; 
   },
   
   // 对范围内的每个整数都调用一个f
   foreach: function(f) {
     for (var x = Math.ceil(this.from); x < this.to; x++) {
       f(x);
     }
   },
   toString: function() { return '(' + this.from + '...' + this.to + ')';},
 };
 var r = range(1, 3);

 function Ranges(from, to) {
 // 存储新的‘范围对象’的起始位置和结束位置（状态）
 // 这两个属性是不可继承的，每个对象都有唯一的属性
 this.from = from;
 this.to = to;
}

// 所有的Ranges对象都继承自这个对象
// 注意 属性的名字必须是prototype
Ranges.prototype = {
  constructor: Ranges, // 显示设置构造函数的反向引用
  // 如果x在范围内则返回true,否则返回false
   // 这个方法可以比较日期范围也比较字符串和日期
   includes: function(x) {
    return this.from <= x && x <= this.to; 
  },
  
  // 对范围内的每个整数都调用一个f
  foreach: function(f) {
    for (var x = Math.ceil(this.from); x < this.to; x++) {
      f(x);
    }
  },
  toString: function() { return '(' + this.from + '...' + this.to + ')';},
}

// 一个用以定义简单的函数
function defineClass(constructor, // 用以设置实例属性的函数
   methods, // 实例的方法，复制至原型中
    statics) // 类属性，复制至构造函数中
{
  if (methods) extend(constructor.prototype, methods); // 将methods对象上的所有属性都复制到constructor.prototype上
  if (statics) extend(constructor, statics); 
  return constructor;
}

// 这是Range类的另一种实现
var simpleRange = defineClass(function(f, t) {this.f = f; this.t = t;},
  {
    includes: function(x) {
      return this.from <= x && x <= this.to; 
    },
    toString: function() { return '(' + this.from + '...' + this.to + ')';},
  },
  {upto: function(t) { return new simpleRange(0, t)}}
)

function set() {// 这是一个构造函数
  this.values = {}; // 集合属性保存在对象的属性里
  this.n = 0; // 集合属性的个数
  this.add.applly(this, arguments); // 把所有参数都添加进这个集合中
}

set.prototype.add = function () {
  for (var i = 0; i < arguments.length; i++) {
    var val = arguments[i]; // 待添加到集合中的值
    var str = set._v2s(val); // 把它转化为字符串
    if (!this.values.hasOwnProperty(str)) { // 不在集合中
        this.values[str] = val; // 把字符串和值对应起来
        this.n++;
    }
  }
  return this; // 支持链式方法掉用
}

// 从集合删除元素
set.prototype.remove = function() {
  for (var i = 0; i < arguments.length; i++) {
    var str  = set._v2s(arguments[i]);
    if (this.values.hasOwnProperty(str)) { // 如果在集合中
        delete this.values[str]; // 删除它
        this.n--;
    }
  }
  return this;
}

// 如果集合包含这个值，则返回true, 否则，返回false
set.prototype.contains = function(value) {
  return this.values.hasOwnProperty(set._v2s(value));
}
// 返回集合的大小
set.prototype.size = function() {
  return this.n;
}
// 编厉集合中所有元素，在指定的上下文调用this
set.prototype.foreach = function (f, context) {
  for (var s in this.values) // 遍厉集合中所有的属性
    if (this.values.hasOwnProperty(s)) // 忽略继承属性
        f.call(context, this.values[s]);
}

// 这是一个内部函数 用以将任意js的值和唯一字符串对应起来
set._v2s = function(val) {
  switch(val) {
    case undefined: return 'u';
    case null: return 'n';
    case true: return 't';
    case false: return 'f';
    default :switch (typeof val) {
      case 'number': return '#' + val;
      case 'string': return '"' + val;
        default: return '@' + objectId(val);
    }
  }
  function objectId(o) {
    var prop = '|**objectid**|'; // 私有属性，用以存放id
    if (!o.hasOwnProperty(prop)) // 如果对象没有id
      o[prop] = set._v2s.next++;
      return o[prop];
  }
};
set._v2s.next = 100; // 初置一个初始id

function enumeration(namesToValues) {
  // 这个虚拟的构造函数是返回值
  var enumeration = function () { throw 'cant Instantiate Enumeration'};

  // 枚举值继承自这个对象
  var proto = enumeration.prototype = {
    constructor: enumeration, // 标识类型
    toString: function () { return this.name;}, // 返回名字
    valueOf: function () { return this.value;}, // 返回值 js 在进行运算或比较的时候会调用对象的valueOf方法
    toJSON: function () { return this.name;}, // 转换JSON
  };

  enumeration.values = []; // 用以存放枚举数组；
  // 现在创建新类型的实例
  for (var name in namesToValues) { // 遍厉每一个值
    var e = inherit(proto); // 创建一个代表它名的对象
    e.name = name; // 给它一个名字
    e.value = namesToValues[name]; // 给它一个值
    enumeration[name] = e; // 将它设置为构造函数的属性
    enumeration.values.push(e); // 将它存储到值数组中
  }
  // 一个类方法，用来对类的实例进行迭代
  enumeration.foreach = function (f, c) {
    for (var i = 0; i < this.values.length; i++) {
      f.call(c, this.values[i]);
    }
  };
  // 返回标识这个新类型的构造函数
  return enumeration;
}

var Coin = enumeration({penny: 1, Nicke: 5, Dime: 10, Quarter: 25});
var c = Coin.Dime; // 这是新类的实例
c instanceof Coin; // => true: instanceof正常工作
c.constructor == Coin; // => true: 构造函数属性正常工作
Coin.Quarter + 3 * Coin.Nicke; // 40: 将值转化为数字
Coin.Dime == 10;

// 定义一个玩牌的类
function Card(suit, rank) {
  this.suit = suit; // 每张牌的花色
  this.rank = rank; // 以及点数
}

// 使用枚举类型定义花色和点数
Card.Suit = enumeration({Clubs: 1, Diamonds: 2, Hearts: 3, Spades: 4});
Card.Rank = enumeration({Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine:9,
                        Ten: 10, Jack: 11, Queen: 12, King: 13, Ace: 14 });
// 定义用以描述牌面的文本
Card.prototype.toString = function () {
  return this.rank.toString + 'of' + this.suit.toString();
}

// 比较两个扑克牌大小
Card.prototype.compareTo = function (that) {
  if (this.rank < that.rank) return -1;
  if (this.rank > that.rank) return 1;
  return 0;
}

// 以扑克牌的玩法对牌进行排序
Card.orderByRank = function (a, b) {return a.compareTo(b);};
// 以桥牌的玩法规则对扑克牌进行排序
Card.orderBySuit = function (a, b) {
  if (a.suit < b.suit) return -1;
  if (a.suit > b.suit) return 1;
  if (a.rank < b.rank) return -1;
  if (a.rank < b.rank) return 1;
  return 0;
}
// 定义用于表示一副扑克牌的类
function Deck() {
  var cards = this.cards = []; // 一副牌就是由牌组成的数组
  Card.Suit.foreach(function (s) { // 初始化这个数组
    Card.Rank.foreach(function (r) {
        cards.push(new Card(s, r));
    });
  });
}

// 洗牌的方法 重新洗牌并返回洗的牌
Deck.prototype.shuffle = function () {
  // 遍厉数组中的每一个元素，随机找出牌面最小的元素，并与之（当前遍厉的元素） 交换
  var deck = this.cards, len = deck.length;
  for (var i = len - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1)), temp; // 随机数
    temp = deck[i];
    deck[i] = deck[r];
    deck[r] = temp; // 交换
  }
  return this;
}

// 发牌的方法：返回牌的数组
Deck.prototype.deal = function (n) {
  if (this.cards.length < n) throw 'out of Cards';
  return this.cards.splice(this.cards.length - n, n);
}

// 创建一副新的扑克牌，洗牌并发牌
var deck = (new Deck()).shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);

// 给set添加转换方法
extend(set.prototype, {
  toString: function () {
    var s = '{', i = 0;
    this.foreach(function (v) {s += (i++ > 0) ? ", " : "" + v;});
    return s + '}';

  },
});

// 用一个简单的函数创建一个简单的子类 
function defineSubclass (superclass, // 父类的构造函数
                         constructor, // 新的子类的构函数
                         methods, // 实例方法 复制到原型中
                         statics, // 类型属性 复制到构造函数中
  )
  {
    // 建立子类的原型对象
    constructor.prototype = inherit(superclass.prototype);
    constructor.prototype.constructor = constructor;
    // 像对常规类一样复制方法和属性
    if (methods) extend(constructor.prototype, methods);
    if (statics) extend(constructor, statics);
    // 返回这个类
    return constructor;
  }

  // 也可以通过父类构造函数的方法做到这一点
  Function.prototype.extend = function (constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
  }

  function SingletonSet(member) {
    this.member = member; // 记住集中的唯一成员
  };

  // 创建一个原型对象 这原型个对象继承自set的原型
 SingletonSet.prototype = inherit(set.prototype);
 extend(SingletonSet.prototype, {
   constructor: SingletonSet,
  add: function() {throw 'read only set';} ,
  remove: function () {throw 'read only set'},
  size: function () {return 1;},
  foreach: function (f, context) { f.call(context, this.number);},
  contains: function (x) { return x === this.number;},
 });

 // 在子类中调用父类的构造函数和方法
 function NonNullSet() {
   // 仅链接到父类
   // 作为普通函数父类的构造函数来初始化通过该构造函数调用创建的对象
   set.apply(this, arguments);
 }

 // 将NonNullSet设置为set的子类
 NonNullSet.prototype = inherit(Set.prototype);
 NonNullSet.prototype.constructor = NonNullSet;

 // 为了将null和undefined排除在外，只须重写add方法
 NonNullSet.prototype.add = function() {
   // 检查参数是不是null或undefined
   for (var i = 0; i < arguments.length; i++) {
     if (arguments[i] == null)
        throw new Error('cant add null or');
     return set.prototype.add.applly(this, arguments);
   }
 }

 // 这个函数返回set类的子类，并重写该类的add()方法用以对添加元素做特殊过滤
 function filteredSetSubclass(superclass, filter) {
    var constructor = function () { // 子类构造函数
      superclass.applly(this, arguments); // 调用父类构造函数
    };
    var proto = constructor.prototype = inherit(superclass.prototype);
    proto.constructor = constructor;
    proto.add = function () {
      // 在添加任何成员之前首先使用过滤器将所有参数进行过滤
      for (var i = 0; i < arguments.length; i++) {
        var v = arguments[i];
        if (!filter(v)) throw ('value' + v + 'rejected by filter');
      }
      // 调用父类的add方法
      superclass.prototype.add.apply(this, arguments);
    }
    return constructor;
 }

 var NonNullSet = (function () { // 定义并产即调用这个函数
  var superclass = Set; // 仅指定父类
  return superclass.extend(function () { superclass.apply(this, arguments);}, // 构造函数
    { // 方法
      add: function() {
        // 检查参数是否是null或者undefined
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] == null) 
            throw new Error('cant add null or');
        }
        // 调用父类add()方法以执行实际插入操作
        return superclass.prototype.add.apply(this, arguments);
      }
    }
  );
} ());

/**
 * 实现一个FilteredSet, 它包装某个指定的‘集合’对象
 * 并对传入add()方法的值应用了某种指定的过滤器
 * 类中其他所有核心方法延续到包装后的实例中
 */

//  var FilteredSet = set.extend()

// 这个函数可以用做任何抽象方法
function abstractmethod() { throw new Error('abstract method');}

/**
 * AbstractSet()类定义了一个抽象方法： contains()
 */
 function AbstractSet() { throw new Error('cant instantiate abstract classes');}
 AbstractSet.prototype.contains = abstractmethod;

 /**
  * Notset是AbstractSet的一个非抽象子类
  * 所有不在其他集合中的成员都在这个集合中
  * 因为它是在其他集合不可写的条件下定义的
  * 同时由于它的成员是无限个， 因此它是不可枚举的
  * 我们只能用它来检测元素成员的归属情况
  * 我们使用Function.prototype.extend()方法来定义这个子类
  */
 var Notset = AbstractSet.extend(
   function Notset(set) { this.set  = set; },
    {
      contains: function(x) { return !this.set.contains(); },
      toString: function(x) { return '~' + this.set.toString(); },
      equals: function(that) {
        return that instanceof Notset && this.set.equals(that.set);
      }
    }
 );

 /**
  * AbstractEnumerableSet 是AbstractSet的一个抽象子类
  * 它定义了抽象方法size()和foreach()
  * 然后实现了非抽想方法isEmpty(), toArray(), to[Locale]String() 和equals() 方法
  * 子类实现了contains(), size()和foreach(), 这三个方法可以很轻易地调用这五个非抽象方法
  */
 var AbstractEnumerableSet = AbstractSet.extend(
   function() { throw Error( 'cant instantiate abstract classes'); },
   {
     size: abstractmethod,
     foreach: abstractmethod,
     isEmpty: function() { return this.size() == 0; },
     toString: function() {
       var s = '{', i = 0;
       this.foreach(function (v) {
         if (i++ > 0) s+= ',';
         s+= v; 
       })
       return s += '}';
     },
     toLocaleString: function () {
      var s = '{', i = 0;
      this.foreach(function (v) {
        if (i++ > 0) s+= ',';
        if (v == null) s+= v; // null和undefined
        else s += v.toLocaleString(); // 其他情况 
      });
      return s += '}';
    },
    toArray: function () {
      var a = [];
      this.foreach(function (v) {a.push(v);});
      return a;
    },
    equals: function (that) {
      if (! (that instanceof AbstractEnumerableSet)) return false;
      // 如果它们大小不同，则它们不相等
      if (this.size() != that.size()) return false;
      // 检查每一个元素是否在that中
    }

   }
 )

 /**
  * SingletonSet是AbstractEnumberableSet的非抽象子类
  * singleton集合是只读的，它只包含一个成员
  */
 var SingletonSet = AbstractEnumerableSet.extend(
   function SingletonSet(member) { this.member = member; },
   {
     contains: function (x) { return x ==  this.member; },
     size: function() { return 1; },
     foreach: function(f, ctx) { f.call(ctx, this.member); },
   } 
 );

 /**
  * AbstractWritableSet 是AbstractEnumberableSet的抽象子类
  * 它定义了抽象方法add()和remove()
  * 然后实现了非抽象方法union()、intersection()和 difference()
  */
 var AbstractWritableSet = AbstractEnumerableSet.extend(
   function () { throw new Error('cant instantiate abstract classes')},
   {
      add: abstractmethod,
      remove: abstractmethod,
      union: function (that) {
        var self = this;
        that.foreach(function (v) { self.add(v); });
        return this;
      },
      intersection: function (that) {
        var self = this;
        this.foreach( function(v) { if (! (that.contains(v))) self.remove(v); });
        return this;
      },
      difference: function (that) {
        var self = this;
        that.foreach( function(v) { self.remove(v);});
        return this;
      }
   }
 );

//定义不可枚举的属性
// 将代码包装在一个匿名函数中，这样定义的变量就在这个函数作用域内
(function() {
  var idprop = '|**objectId**|';
  var nextid = 1; // 给它设置初使值
  // 定义不可枚举的属性objectId,它可以被所有对象继承
  // 当读取这个属性时调用getter函数
  // 它没有定义setter，因此它是只读
  // 它不可配置，因此它是不能删除的
  Object.defineProperty(Object.prototype, 'objectId', {
    get: idGetter, // 取值器
    enumerable: false, // 不可枚举的
    configurable: false, // 不可删除的
  });
  // 当读取objectId的时候直接调用这个getter函数
  function idGetter() { // getter函数返回该id
    if ( ! (idprop in this)) { // 如果对象中不存在id
        if (!Object.isExtensible(this)) // 并且可以增加属性
          throw Error('cant define id for nonextensible objects');
        Object.defineProperty(this, idprop, { // 给它一个值
                              value: nextid++, // 就是这个值
                              writable: false, // 只读
                              enumerable: false, // 不可枚举
                              configurable: false,  // 不可删除
        });
        return this[idprop]; // 返回已有的或新的值
    }
  }
}()); // 立限执行这个包装函数



/**
 * 
 * 函数
 * 函数可以嵌套在其他函数的中定义，这样它们就可以访问它们被定义时所处的作用域的任何变量 这就意味着构成了闭包
 * 函数定义表达式 函数声明语句 会提升作用域
 * 函数调用分4种
 *  1作为函数
 *  调用表达式 以函数形式调用的函数通过不使用this
 * 如果在嵌套调用 以函数方式调用 this不是全局对象就是undefined
 *  2作为方法
 *  保存在对象里的函数 在这样的方法调用表达式中 对象成为调用上下文 该函数体可以使用this关键字引用该对象
 * 任何函数只要作为方法调用实际上都会传入一个隐式的实参——————这个实参是一对象，方法调用的母体就是这个对象
 * 方法链 当方法返回值是一个对象，这个对象还可以调用它的方法 这种方法调用序列中（通常称为链或者级联）每次的调用结果都是另外一个
 * 表达式的组成部分
 * 当方法不需要返回值时 最好直接返回this
 * 3作为构造函数
 * 如果函数或者方法在调用之前带有关键字new，它就是构造函数调用
 * 构造函数调用创建一个新的空对象，这个对象继承自构造函数的prototype属性
 * 构造函数试图初始化这个新创建的对象，并将这个对象用做其调用上下文 因此构造函数可以使用this关键字来引用新创建的对象
 * 注意 new o.m()中， 调用上下文不是o
 * 构造函数一般不使用return关键字
 *  4通过他们的call()和apply()方法间接调用
 * 两个方法允许显示的指定调用所需的this值 也就是说 任何函数可以作为任何对象的方法来调用 也都可以指定调用实参
 * call()方法使用自有的的实参作为函数的参数 ，apply()则要求以数组的形式传入参数
 * 形参和实参
 * 当调用函数时传入的实参比函数声明的形参个数少，剩下的开参都将设置为undefined
 * 在函数体内，标识符arguments 是指向实参的引用 不是数组是一个实参对象
 * callee caller
 * callee属性指代当前正在执行的函数 可以访问调用自身栈 比如在匿名函数来递归调用自身
 * var factorial = function(x) {
 *    if (x < 1) return 1;
 *    return x * arguments.cellee(x - 1);
 * }
 * caller 非标准的 它指代调用当正在执行函数的函数
 */

 var extend = (function() { // 将这个函数的返回值赋值组extend
  // 在修复之，首先检测版本问题
  for (var p in {toString: null}) {
    // 如果执行到这for/in循环会正确工作并返回
    // 一个简单版本的extend()函数
    return function extend(o, s) {
      for (var i = 1; i < arguments.length; i++) { // i 从1开始 表示从第二个实参开始全都复制到第一个形参o上
        var source = arguments[i];
        for (var prop in source) o[prop] = source[prop];
      }
      return o;
    }
  }
  // 如果代码执行到这 说明for/in循环不会枚举测试对象的toString属性
  return function patched_extend(o) {
    // 需要的特殊属性列表
    var protoprops = ['toStringg', 'valueOf', 'constructor', 'hasOwnProperty', 'isPrototypeOf',
      'propertyIsEnumerable']
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]; 
      for (var prop in source) o[prop] = source[prop];
    }
    for (var j = 0; j < protoprops.length; j++) {
      prop = protoprops[j];
      if (source.hasOwnProperty(prop)) o[prop] = source[prop];
    }
    return prop;


  }


 }());
 
 /* 闭包
 * 一个变量的作用域(scope)是程序源代码中定义这个变量的区域 分全局和局部
 * js的函数作用域是指在函数内声明的所有的变量在函数体内始终是可见的。 这意味着变量在声明之前已经可用
 * 这个被非正式的称为声明提前 即函数体声明的变量都被提长到函数体内顶部
 * 函数的执行依赖于变量的作用域，这个作用域是在函数定义的时候决定的，而不是函数调用时决定的
 * 作用域链是一个对象列表或者链表
 * 当定义一个函数时，它实际上保存一个作用域链。当调用这个函数的对象来存储存它的局部变量，并将这个对象添加到保存的那个作用域链上
 * 同时创建一个新的更长的表示函数调用的作用域的链
 * 对于嵌套函数来讲，每次调用外部函数时，内部函数都会重新定义
 * 
 * var scope = 'global scope'; // 全局
 * function checkscope() {
 *  var scope = 'local scope'; // 局部
 *  function f() {return scope;} // 在作用域中返回值
 *  return f();
 * }
 * checkscope(); // => local scope
 * 
 * var scope = 'global scope'; // 全局
 * function checkscope() {
 *  var scope = 'local scope'; // 局部
 *  function f() {return scope;} // 在作用域中返回这个值
 *  return f;
 * }
 * // 正常情况下 在checkscope调用之后就会销毁自身 局部变量scope就会回收
 * checkscope()(); // => ???? 仍然是local scope
 * 
 * 函数定义时的作用域链到函数执行时依然有效
 * 
 * 闭包可以捕捉到单个函数调用的局部变量，并将这些局部变量变成私有状态
 * var uniqueInteger =(function() { // 定义函并产即调用
 *    var counter = 0; // 函数的私有状态
 *    return function() {return counter++;};
 * }());
 * 
 * function counter() {
 *    var n = 0;
 * return {
 *  count: function() {return n++;},
 *  reset: function() {n = 0;}
 * }
 * }
 * 
 * function counter(n) { // 函数参数n是一个私有变量
 *  return {
 *    // 属性getter方法返回并给私有计数器var递增1
 *    get count() {return n++},
 *    // 属性setter不允许民递减
 *    set count(m) {
 *      if (m >= n) n = m;
 *      else throw Errow('........'); 
 *    }
 * };
 * }
 * 
 *  利用闭包实现私有属性的存取
 * // 这个函数给对象增加了属性存取方法
 * function addPrivateProperty(o, name, predicate) {
 *    var value; // 属性
 *    // 使用get方法简单的返回
 *    o['get' + name] = function() {return value};
 *    // set 检测predicate是否合法
 *    o['set' + name] = function(v) {
 *      if (Predicate && !predicate(v))
 *          throw Error('........');
 *      else 
 *          value = v;
 *    }
 * }
 * 
 * // 这个函数返回一个总是返回参数的函数
 * function constfunc(v) { return function () { return v; }};
 * 
 * var funcs = [];
 * for (var i = 0; i < 10; i++) funcs[i] = constfunc(i); 
 * // 这里要注意不能把这个for循环放在constfunc函数里面去 不然里面的变量i会被共享了
 * funcs[5]() // => 5;
 * 
 * 函数自己的length是指期望传入的实参个数
 * bind() 将函数绑定在某个对象上
 * 
 * function f(y) { return this.x + y};
 * var o = {x: 1};
 * var g = f.bind(o); // 通过调用g(x) 来调用o.f(x);
 * g(2) // => 3
 * 
 * function bind(f, o) {
 *    if (f.bind) return f.bind(o);
 *    else return function() {
 *        return f.applly(o, arguments); 
 *    }
 * }
 * bind 除了第一个实参之外，传入bind()的实参也会绑定至this
 * 
 * var sum = function(x, y) { return x + y;}; // 返回两个实参的和值
 * // 创建一个类似sum的新函数，但this的值绑定到null
 * // 并且第一个参数绑定到1，这个新的函数期望只传入一个实参
 * var succ = sum.bind(null, 1);
 * succ(2) // => 3: x绑定到1， 并传入2作为实参y
 * 
 * function f(y, z) {return this.x + y + z}; // 另一人做累加的函数
 * var g = f.bind({x: 1}, 2); // 绑定this和y
 * g(3) // -> 6: this.x绑定到1，y绑定到2，z绑定到3
 */ 
  if (!Function.prototype.bind) {
     Function.prototype.bind = function(o /* , args */) {
       // 将this和arguments的值保存至变量中
       // 以便在后面嵌套的函数可以使用到它们
       var self = this, boundArgs = arguments;
       // bind方法返回的是一个函数值
       return function() {
                 // 创建一个实参列表，将传入bind()的第二个及后续的实参都传入这个函数
                  var args = [];
                  var i;
                   for (i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);
                   for (i = 0; i < arguments.length; i++) args.push(arguments[i]);
                 // 现在将self作为o的方法来调用，传入这些实参
                 return self.apply(o, args);  
             }
    }
  
  }
 /* 如果bind方法返回的函数做构造函数，将忽略传入bind()的this, 原始函数就会以构造函数的形式调用， 其形参已经绑定
 * 由bind()方法所返回的函数并不包含prototype属性，并且将这些绑定的函数用作构造函数时所创建的对象从原始的未绑定的构造函数中
 * 继承prototype
 * 
 * 通过Function()构函数来定义
 * var f = new Function('x', 'y', 'return x*y');  // 创建的是一个匿名函数
 * 可以传任意数量的实参 最后一个实参所表示的文本就是函数体
 * 允许js在运行时动态地创建并编译函数 它创建的函数不使用词法作用域 函数代码体的编译总是会在顶层函数执行
 */ 
  // 对每个数组元素调用函数f()，并返回一个结果数组
  // 如果Array.prototype.map 定义了的话，就使用这个方法
  var map = Array.prototype.map ? function (a, f) { return a.map(f)} // 如果已经存在map()方法，就直接使用
            : function (a, f) { // 否则自已实现一个
            var results = [];
            for (var i = 0, len = a.length; i < len; i++) {
                if (i in a) results[i] = f.call(null, a[i], i, a); // 调用回调函数变收集它的返回值
            }
            return results;
     }
     var reArr = map([1, 2,3], function(item, index, arr) {console.log(item); return index});

     // 使用函数f()和可选的初值将数组a减到一个值
     // 如果Array.prototype 存在就使用这个这个
     var reduce = Array.prototype.reduce ? function (a, f, initial) { // 如果reduce方法存在
        if (arguments.length > 2) return a.reduce(f, initial); // 如果传入了初始值
            else return a.reduce(f);
     }
     : function(a, f, initial) { // es5规范
        var i = 0, len = a.length, accumulator;
        // 以特定初使值开始, 否则第一个取自a
        if (arguments.length > 2) accumulator = initial;
          else { // 打到数组第一个已定义的索引
            if (len == 0) throw TypeError();
            while (i < len) {
              if (i in a) {
                accumulator = a[i++];
                break;
              }
              else i++;
            }
            if (i == len) throw TypeError();
          }
          // 对数组中剩下的元素依次调用f()
          while(i < len) {
            if (i in a) {
              accumulator = f.call(undefined, accumulator, a[i], i, a);
            }
            i++;
          }
          return accumulator;

     }

/**
 * 所谓高阶函数 就是操作函数的函数，它接一个或多个函数作主参数，并返回一个新的函数
 */

 // 实现一个工具函数将类数组对象(或对象)转换为真正的数组
 function array(a, n = 0) { return Array.prototype.slice.call(a, n || 0)}; // 从0开始切或从指定位置切

 // 这个函数的实参传递到左侧
 function partialLeft(f /** .... */) {
   var args  = arguments; // 保存外部参数
   return function () { // 并返回这个函数
     var a = array(args, 1); // 开始处理外部的第1个args
     a = a.concat(array(arguments));  // 然后增加内部所有参数
     return f.apply(this, a); //然后基于这个实例调用f
  }
 }

 // 这个函数将实参传到右侧
 function partialRight(f /** */) {
   var args = arguments;
   return function() {
     var a = array(arguments);
     a = a.concat(array(args, 1));
     return f.apply(this, a);
   }
 }

  function partail(f /** */) {
    var args = arguments;
    return function () {
      var a = array(args, 1);
      var i = 0, j = 0;
      for (; i < a.length; i++) {
        if (a[i] == undefined) a[i] = arguments[j++];
        a = a.concat(array(arguments, j));
        return f.applly(this, a);
      }
    }
  }

 var f = function(x, y, z) { return x * (y - z)};
 partialLeft(f, 2)(3, 4); // => -2 绑定第一人实参：2 * （3 - 4）；
 partialRight(f, 2)(3, 4); // => 6 绑定最后一个实参：3 * (4 - 2);
 partail(f, undefined, 2)(3, 4); // -6 绑定中间实参: 3 * (2 - 4);


// 返回f()的带有记忆功能的版本
// 只有f()实参的字符都不相同时才会工作
function memorizef(f) {
  var cache = {}; // 将值保存在闭包内
  return function() {
    // 将实参转为字符串形式，并将其用做缓存的键
    var key = arguments.length + Array.prototype.join.call(arguments, ',');
    if (key in cache) return cache[key];
    else return cache[key] = f.applly(this, arguments);
  }
}
  
 
  
 /* 
 * 数组
 * reverse() 反转元素
 * concat() 拼接数组
 * slice() 返回一个切割后数组 不改变原数组 两个参数位置
 * splice() 返回一个由删除元素组成的数组 如果没有返回空
 * 
 * 
 * 对象可以从一个称为原型的对象继承属性
 * 每个对象拥有三个个相关的对象特性
 * 对象的原型prototype 指向另一个对象（指的就是原型）， 本对象的的属性继承自它的原型对象
 * 所有通过对象直接量创建的对象都具有同一个原型对象 并可以通过代码Object.prototype获取对象原型的引用
 * 通过关键字new和构造函数调用创建的对象的原型就是构造函数的prototype属性的值
 * 例：通过new Object()创建的和{}是一样的都是Object.prototype 通过new Array()创建的对象原型就是Array.prototype
 * 没有原型的对象不多 Object.prototype就是其中之一 它不继承任何属性
 * 对象的类class 是一个标识对象类型的字符串
 * 对象的扩展标记 extensible flag es5中指明了是否可以向该对象添加属性
 * Object.create() 它创建一个新对象 其中第一个参数是这个对象的原型 第二个是可选参数 用以对对象的属性进行进一步描述
 * Object.create() 是一个静态函数 可以通过传入参数null来创建一个没有原型的新对象 创建一个普通的空对象 需要传入Object.prototype
 * Object.create(null) // 不继承任何属性和方法
 * Object.create(Object.prototype) // 和{} new Object() 一样
 * 可以通过任意原型创建对象(可以使任意对象可继承) 
 */ 
  function inherit(p) {
     if (p == null) throw TypeError();
     if (Object.create)
         return Object.create(p);
     var t = typeof p;
     if (t !== 'object' && t !== 'function') throw TypeError();
     function f() {};  // 定义一个空的构造函数
     f.prototype = p;  // 将其原型属性设置为p
     return new f();   // 使用f()创建p的继承对象
  }
 /* 
 * Object.getOwnPropertyDescriptor() 可以获取某个对象特定属性的属性描述符
 * // 返回 {value: 1, writeable:true, enumerable:true, configurable: true}
 * Object.getOwnPropertyDescriptor({x:1}, 'x');
 * 想要设置属性的特性，或者让新建属性具有某种特性则需要调用Object.defineProperty()
 * var o = {}; // 创建一个空对象
 * // 添加一个不可枚举属性x,并赋值1
 * Object.defineProperty(o, 'x', {value: 1, writeable: true, enumerable: false, configurable: true});
 * // 对 x作修改让只可读
 * Object.defineProperty(o, 'x', {writeable: false});
 * o.x = 2 // 不能修改
 * // 可以通过配置方式修改
 * Object.defineProperty(o, 'x', {value: 2});
 * 注意这个方法只能修改已有属性或新建属性，但不能修改继承属性
 * 如果同时要修改或创建多个属性，使用Object.definePropertys({}, {
 *    x: {value: 1, writeable: true, enumerable: false, configurable: true},
 *    y: {value: 1, writeable: true, enumerable: false, configurable: true},
 *    r: {
 *  get: function() {return Math.sqrt(this.x * this.y)},  
 * enumerable: false, configurable: true}
 * })
 * 
 * 
 * 给Object.prototype添加一个不可枚举的extend方法
 * 这个方法继承自调用它对象，将作为参数传入的对象的属性一一复制
 * 除了值之外，也复制属性的所有特性，除非在目标对象中存在同名的属性
 * 参数对象的所有自有对象（包括不可枚举对象）也会一一复制
 */
 Object.defineProperty(Object.prototype, 'extend', {
     writable: true,
     enumerable: true,
     configurable: true,
     value: function(o) { // 值就是这个函数
          // 得到所有的自身属性，包括不可枚举属性
         var names = Object.getOwnPropertyNames(o);
         // 遍厉它们
         for (var i = 0; i < names.length; i++) {
         // 如果属性存在则跳过
         if (names[i] in this) continue;
         // 获取o中的属性描述符
         var desc = Object.getOwnPropertyDescriptor(o, names[i]);
         // 用它给this创建一个属性
         Object.defineProperty(this, names[i], desc);
  }          
  
  }
  });
  
 /* 
 * 对象的原型属性是用来继承的 通常叫做对象的原型 它是在实例对象创建之初就设置好了的
 * 在es5中 将对象作为参数传入Object.getPrototypeOf() 可以查询它的原型
 * 检测一个对象是否是另一个对象的原型（或处于原型链中）使用isPrototypeOf()方法
 * 能过p.isPrototypeOf(o) 来检测p是否是o的原型
 * 
 * 对象的类的属性 (class attribute) 是一个字符串， 用以表示对象的类型信息 只能和toString() 来间接读取
 * function classOf(o) {
 *  if (o === null) return 'Null';
 *  if (o === undefined) return 'Undefined';
 *  return Object.prototype.toString.call(o).slice(8, -1); 
 * // 这里用Object.prototype.toString是防止o中的toString方法被重写了
 * }
 * 
 * 对象的可扩展性是用以表示是否可以给对象添加新属性
 * 通过将对象传入Object.esExtensible() 来判断对象是否可扩展
 * 将对象转为不可扩展的调用 Object.preventExtensions() 注意一旦将对象转为不可扩展的就不能转回来了
 * 同样它只影响到对象本身的可扩展性。 如果给一个不可扩展的对象的原型添加属性，这个不可扩展的对象同样会继承这些新属性
 * Object.seal()与Object.preventExtensions()类似 通过Object.isSealed()来检测是否封闭
 * Object.freeze() 冻结对象 Object.isFrozen() 检测是否冻结对象
 * 
 * 对象序列化 （serialization）是指将对象的状态转换为字符串， 也可以将字符串还原为对象
 * es5提供内置函数 JSON.stringify()和JSON.parse() 用来序列化和还原javascript对象  
 * 
 * 
 * 
 * 
 * 
 * 
 * ADM规范 asynchronous module defintion 导步模块定义
 * 模块导步加载 加载不影响后面语句运行 依赖某些模块的语名均放置在回调i函数中
 * define(id?, dependencies?, factory)
 * id 模块名字 如果提示必须是顶级不能重名
 * dependencies 依赖
 * factory 工厂化方法 模块初始化要执行的函数或对象 如果是对象，此对象是模块的输出值
 * 例： 创建一个alpha的模块 用require, exports, beta
 * define('alpha', ['require', 'exports', 'beta'], function (require, exports, beta) {
 *  exports.verb = function() {
 *      return beta.verb();
 *  }
 * });
 * 
 *  commonjs 是服务端模块的规范 一个单独的文件就是一个模块 每一个模块都一个单独的作用域 也是就模块内部变量无法被其他模块读取
 * commonjs 采用的是用步加载 如果依赖三个模块代码会一个一个依次加载他们
 * 他需要一个兼容的脚本加载器 必须支持名为require 和module.exports的函数 它们将模块相互导入导出
 * 如果require参数一"/"开头，那么就以绝对路径的方式查找模块名称，如果参数一"./"、"../"开头，那么则是以相对路径的方式来查找模块。
 * 如果require参数不以"/"、"./"、"../"开头，而该模块又不是核心模块，那么就要通过查找node_modules加载模块了。我们使用的npm获取的包通常就是以这种方式加载的。
 * 输出模块变量的最好方法是使用module.exports
 * var i = 1;
var max = 30;

module.exports = function () {
  for (i -= 1; i++ < max; ) {
    console.log(i);
  }
  max *= 1.1;
};

requirejs 模块加载器
实现文件的异步加载，避免网页失去响应
管理模块之间的依赖，便于代码的编写和维护

CMD (common module definition) 通用模块定义。 该规范明确了模块的基本书写格式和基本交互规则 
ADM 依赖关系前置 CMD是按需加载
CMD中一个模块就是一个文件
define(factory)
factory 为对象、字符串时，表示模块的接口就是该对象、字符串。比如可以如下定义一个 JSON 数据模块：
factory是函数时表示构造方法 执行该构造方法，可以得到模块向外提供的接口 
factory方法执行时 默认会传入三个参数
define(function(require, exports, module) {

  // 模块代码

});
require是可以把其他模块导入进来的一个参数，而export是可以把模块内的一些属性和方法导出的。
define define(id?, deps?, factory)
define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖。比如：

define('hello', ['jquery'], function(require, exports, module) {

  // 模块代码

});
id 和 deps 参数可以省略。省略时，可以通过构建工具自动生成。

AMD:提前执行（异步加载：依赖先执行）+延迟执行
CMD:延迟执行（运行到需加载，根据顺序执行）
UMD  统一模块定义（universal Module Definition）将ADM 和commjs合在一起的尝试

 * 
 */
