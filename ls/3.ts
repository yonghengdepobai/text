/**
 * 在Angular框架中，所有的状态其实是挂在全局上的，每次更新和修改都是通知全局，然后由全局通知所有用到这个状态的组件。
 * 因为是状态集中管理和分发机制，所有组件都没有全部所有权。
 * 
 * 前端状态管理实际上解决的就是组件通讯以及状态集中管理和分发的问题。
 * 
 * 大致一讲 项目为了实现状态管理，新增了几个模块：reducers、effects、services、models.如果是angualr还有actions\
 * models: 数据模型。存放了数据本身和修改数据的方法。在angular2中models存放的是实体（entity）.是对数据的一种声明
 * reducers：负责进行同步操作。比如把请求来的表单数据存到数据模型中，用户添加/删除了某条数据，对原有数据进行修改
 * services：对请求数据这一动作的封装，一般包含获取数据的方法。 如getList()，getUsers()。
 * effects：负责进行异步操作。比如接到用户的请求动作后，调用services,向服务器请求数据，成功了就调用reducers保存数据
 * ，如果失败了就执行另一个动作
 * angular2+ 还抽象出了一层actions,是对各种动作的封装。比如加载数据，数据请求成功，用户删除数据等。包含了数据的
 * type以及payload（修改数据用到的数据）
 * 
 * 用户发出指令 -> dispatch调用redurcers修改状态，相应组件进入loading状态 -> effects调用services获取数据 -> 获取数据成功，
 * 调用redurces保存数据并结束loading -> 渲染到视图。当调用reducers更新数据的时候，所有跟model绑定的视图都会同步更新，
 * 每个处理逻辑也变得相当清晰明了。虽然在项目复杂度上会有所增加，但是维护起来肯定是要方便很多的。
 * 
 */

 /**
  * ngrx/store的灵感来源于Redux,是一款集成RXJS的Angular状态管理库，由Angular的布道者Rob Wormald开发
  * 它和Redux的核心思想相同，但使用RXJS实现观察者模式
  * 基本原则：
  * State（状态）是指单一不可变数据
  * Action (行为) 描述状态的变化
  * Reducer (归约器/归约函数)
  * 状态用State的可观察对象，Action的观察者————Store来访问
  * 
  */

  /**
   * Actions(行为)
   * Actions是信息的载体，它发送数据到reducer,然后reducer更新store. Actions是Store能接收数据的唯一方式。
   */

//   Action接口
export interface Action {
    type: string; // 描述我们期待的状态变化类型。比如，添加待办‘ADD_TODO',增加’DECREMENT'等
    payload?: any; // 发送到待更新store中的数据。
}
var store;
// store派发action代码类似如下 派发action,从而更新store
store.dispatch({
    type: 'ADD_TODO',
    payload: 'Buy milk'
});

/**
 * Reducers (归约器)
 * Reducers规定了行为对应的具体状态改变。它是纯函数，通过接收前一个状态和派发行为返回新对象作为下一个状态的方式来改变状态，
 * 新对象通常用Object.assgin和扩展语法来实现
 */

 // reducer定义了action被派发时state的具体改变方式
 export const todoReducer = (state = [], action: Action) => {
     switch(action.type) {
         case 'ADD_TODO':
             return [...state, action.payload];
        default: 
            return state;
     }
 };

 /**
  * Store(存储)
  * store中存储了应用中所有的不可变状态。ngrx/store中的store是Rxjs状态的可观察对象，以及行为的观察者
  * 我们可以利用Store来派发行为。当然也可以用Store的select()方法获取可观察对象，然后订阅观察，在状态变化之后做出反应
  */

  /**
   * 任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，
   * 那么它的内容就被视为全局可见
   */