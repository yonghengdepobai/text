/**
  Angular的基本构造块是NgModule, 它为组件提供了编译的上下文环境。NgModule会把相关的代码收集到一些功能中。
  Angluar 就是由一组NgModule定义出来的。应用至少会有一个用于引导应用的根模块，通常还会有很多特性模块
    组件定义视图。视图是一组可见的屏幕元素，Angular可以根据你的程序逻辑和数据来选择和修改它们。每一个应用都至少有一个组件
    组件使和服务。 服务会提供那些与视图不直接相关的功能。服务提供商可以作为依赖被注入到组件中，这能让代码更加模块化、更加
    可复用、更加高效

  服务和组件都是简单的类，这些类使用装饰器来标出它们的类型，并提供元数据以告知Angular该如何使用它们
    组件的元娄据将组件和一个用来定义视图的模板关联起来。模板把普通的HTML和Angular指令与绑定标记（markup）组合
    起来，这样Angular就可在呈现HTML之前先修改这些HTML
    服务类的元数据提供了一些信息，Angular要用这些信息来让组件可以通过依赖注入（DI）使用该服务

  应用的组件通常会定义很多视图，并进行分级组织。Angular提供了Router服务来帮助定义视图之间的导航路径。
  路由器提供了先进的浏览器内导航功能

  模块
  Angular定义了NgModule，它和JavaScript的模块不同且有一定的互补性。NgModule为一个组件集集声明了编译上下文，
  它专注于某个应用领域、某个工作流或一组紧密相关的功能。NgModule可以将其组件和一组相关代码（如服务）关相起来，形成功能单元

  每个angular应用都一个根模块，通常命名为AppModule。根模块提供了用来启动应用的引导机制。一个应用通常会包含很多功能模块

  ngModule可以从其他NgModel中导入功能，并请允许导出他们自已的功能供其它NgModule使用。比如，要在应用中使用路由器Router
  服务，就要导入Router这个NgModule
  把你的代码组织成一些清晰的功能模块，可以帮助管理复杂应用的开发工作并实现可复用性设计。
  另外，这项技术还能让你获得惰性加载（也就是按需加载模块）的优点，以尽可能减小启动时需要加载的代码体积。

  一个NgModule就是一个容器，用于存放一些内聚的代码块，这些代码块专注于某个应用领域、某个工作流或一组紧密相关的功能。它可
  以包含一些组件、服务提供商或其它代码文件，其作用域由包含它们的NgModule定义。它还可以导入一些由其它模块中导出的功能，并导出一
  些指定的功能供其它的NgModule使用

  引导根模块就可以启动这应用
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  @NgModule 元数据
  NgModule是一个带有@NgModule()装饰器的类。 @NgModule()装饰器是一函数。它接收一个元数据对象，该对象用来描述这个模块
  其重要属性：
    declarations(可声明对象表) —— ——那些属于本NgModule的组件、指令、管道
    exports(导出表) —— —— 那些能在其它模块组件模板中使用的可声明对象的子集
    imports (导入表) —— —— 那些导出了本模块中的组件的模板所需的类的其它模块
    providers —— —— 本模块向全局服务中贡献的那些服务的创建器。这些服务能被本应用中的任何部分使用。（你可以在组件级别指
    定服务提供商）
    bootstrap - - 应用的主视图，称为根组件。它是应用中所有其它视图的宿主。只有根模块才能设置bootstrap属性
  
 */

 import {NgModule} from '';
 import {BrowserModule} from '';
 @NgModule({
     imports: [BrowserModule],
     providers: [Logger],
     declarations: [AppComponent],
     exports: [AppComponent], // 根模块没有任何理由导出任何东西，因为其它模块永远不需要导入根模块。
     bootstrap: [AppModule],
 })
 export class AppModule{
    // 根模块总会有一个根组件，并在引导期间创建它。
    // 任何模块都包含做任意数量的组件，这些件可以通过路由器加载，也可以通过模板创建。那些属于这个NgModule的组件会共享一个
    // 编译上下文环境
 }

 /**
    组件及其模板共同定义视图、组件还可以包含视图层次结构，它能让你定义任意复杂的屏幕区域，可以将其作为一个整体进行创建、修改和
    销毁。一个视图层次结构中可以混合使用由不同NgModule中的组件定义的视图。

    当你创建一个组件时，它直接与一个叫做宿主视图的视图关联起来。宿主视图可以是视图层次结构的根，该视图层次结构可以包含
    一些内嵌视图，这些内嵌视图又是其它组件的宿主。这些组件可以位于相同的NgModule中，也可以从其它NgModule中导入。树
    中的视图可以嵌套到任意深度
  */

  /**
    Angular会作为一个组JavaScript模块进行加载，你可以把它们看成库模块。每个Angular库的名称都带有@angular前缀。
    使用npm包管理器安装Angular的库，并使用JavaScript的import语名导入其中的各个部分
   */

   /**
    组件控制屏幕上被称为视图的一小片区域。
    组件的元数组
    @component 装饰器会指出紧随其后的那个类是组件类，并为其指定元数据。 以决定该组件在运行期间该如何处理、实例化和使用
    元数据说明
    changeDetection 用于当前组件的变更检测策略
    viewProviders   定义一组可注入对象，它们在视图的各个子节点中可用
    moduleId        包含该组件的那个模块的ID。该组件必须能解析模析和样式表中使用的相对URL。
    templateUrl     Angular组件模板文件的URL。如果提供了它，就不在用template来提供内联模板了。
    styleUrls       一个或多个URL，指向包含组件CSS样式表的文件
    animations      一个或多个动画trigger()调用，包含一些state() 和 transition()定义。
    entryComponents 一个组件的集合，它应该和当前组件一起编译。
    preserverWhitespaces 为true 则保留，为false则从编译后的模板移处可以多余的空白字符
    继承自Directive装饰器
    selector        这个css选择器用于在模板中标记出该指令，并触发该指令的实例化
    inputs          列举某个指令的一组可供数据绑定的输入属性
    outputs         列举一组可供事件绑定的输出属性
    providers       一组依赖注入令牌，它允许DI系统为这个指令或组件提供依赖
    exportAs        定义一个名字，用于在模板中把该指令赋值给一个变量
    queries         配置一些查询，它们将被注入到该指令中。
    host            使用一组键-值对，把类的属性映射宿主元素的绑定（Property, Attriblute 和事件）
    jit             如果为true，则该指令/组件将会被AOT编译器忽略，始终使用JIT编译
    */

    /**
      带有@Pipe 装饰器类中会定义一个转换函数用来把输入值转换成供视图显示用的输出值
     */
    @Pipe({name: 'testPipe'})
    export class TestPipe implements PipeTransform {
        transform(value, exponent?) {
            return '';
        }
    }

    /**
      依赖注入
      组件是服务的消费者 在Angular中把一个类定义为服务，就要用@Ingectable() 装饰器来提供元数据，以便让Angular
      可以把它作为依赖注放到组件中。同样，也要使用@Ingectable()装饰器来表明一个组件或其它类（比如另一服务、管理
      或NgModule）拥有一个依赖
        注入器是主要的机制。Angular 会在启动过程中为你创建一个全应用级注入器以及所需要的其它注入器。不用自己创建
        该注入器会创建依赖、维护一个容器来管理这些依赖，并尽可能复用它们
        提供商是一个对象，用来告诉注入器应该如何获取或创建依赖
    
      你应用的所需的任何依赖，都必须使用该应用的注入器来注册一个提供商，以便注入器可以使用这个提供高来创建新实例。
      对于服务，该提供商通常就是服务本身
      依赖不一定是服务 - - 它还有可能是函数或值

      在你在根一级提供服务时，Angular会为服务创建一个单一的共享实例，并且把它注入到任何想要它的类中

      当你使用特定的 NgModule 注册提供商时，该服务的同一个实例将会对该 NgModule 中的所有组件可用。
      要想在这一层注册，请用 @NgModule() 装饰器中的 providers 属性：

      当你在组件级注册提供商时，你会为该组件的每一个新实例提供该服务的一个新实例。
       要在组件级注册，就要在 @Component() 元数据的 providers 属性中注册服务提供商。
     */

     /**
      * ngFor 可以为任何可迭代的（iterable)对象重复渲染条目
      * 
      * typescript 用构造函数的参数直接定义属性
      * ngIf 并不是显示和隐藏这条消息，它是从DOM中添加和移除这个段落元素。这会提高性能
      * 
      * 模板输入变量 和模板引用变量
      * 表达式中的上下文变量是由模板变量、指令的上下文变量（如果有）和组件的成员叠加而成的。
      * 模板表达式不能引用全局命令空间的任何东西，比如window或document。它们也不能调用console.log或Math.max
      * 它们只能引用表达式上下文的成员
      * 模板表达指南：没有可见的副作用，执行迅速，非常简单
      * 
      * 模板语句用来响应由绑定目标（如HTML元素、组件或指令）触发的事件
      * 语句只能引用语句上下文中的语句 典型的语句上下文就是当前组件的实例
      * 语句上下文可以引用模板自身上下文中的属性，就把模板的$event对象、模板输入变量和模板引用变量
      * 
      * HTML attribute 和 DOM property 之间的区别
      * attribute 是由HTML定义的。 property是由DOM定义的
      * attribute初始化DOM property, 然后它们的任务就完成了。property的值可以改变；attribute的值不能改变
      * 
      * 模板绑定是通过property和事件来工作的，而不是attribute
      * 在Angular的世界中，attribute唯一的作用是用来初始化元素和指令的状态。当进行数据绑定时，只是在与元素和指令的property
      * 和事件打交道
      * 
      * 绑定目标
      * 数据绑定的目标是DOM中的某些东西。这个目标可能是（元素|组件|指令的）property、（元素|组件|指令的）事件
      * 或（极少数的情况下）attribute名
      * 
      * 属性绑定还是插值
      * 在多数情况下，插值是更方便的备选项 但数据类型不是字符串时，就必须使用属性绑定了
      * 
      * attribute绑定 [attr.colspan]
      * 
      * 为目标事件设置事件处理器 绑定会通过名收$event 的事件对象传递关于此事件的信息（包括数据值）
      * 如果目标事件是原生DOM元素事件，$event就是DOM事件对象，它有像target和target.value这样的属性
      * 
      * 使用ngModel时必须导入ForsModule并把它添加到NgModule的imports列表中
      * 
      * 属性型指令  结构型指令
      * 给结构型指令加上（*）前缀
      * 用<ng-container>对元素进行分组
      * 一个元素应用一个结构型指令
      * ngIf表达式为假时 NgIf会从DOM中元素级其子元素
      * 可以防止空指针错误
      * 
      * ngFor 指令上下文中的index属性返回一个从零开始的索引，表示当前条目在迭代中的须序
      * index: number：可迭代对象中当前条目的索引。
      first: boolean：如果当前条目是可迭代对象中的第一个条目则为 true。
      last: boolean：如果当前条目是可迭代对象中的最后一个条目则为 true。
      even: boolean：如果当前条目在可迭代对象中的索引号为偶数则为 true。
      odd: boolean：如果当前条目在可迭代对象中的索引号为奇数则为 true。

      trackBy   ngFor的性能优化 后面跟一个方法面（不传参数 内置 index和item）方法返回一个item的属性
      angular后面就检测item的这个属性改变没有 有改变才去刷新dom

      ngSwitch指令它可以从多个可能的元素中根据switch条件来显某一个。Angular只会把选中的元素放进DOM中
      ngSwitch ngSwitchCase ngSwitchDefault

      模板引用变量通常用来引用模板中的某个DOM元素，它还可以引用Angular组件或指令或Web Component
      使用#来声明引用变量
      大多数情况下，Angular会把模板引用变量的值设置为声明它的那个元素。
      不过指令可以修改这个行为，让这人值引用到别处，比如它自身
      模板引用变量的作用范围是整个模板 也可以ref- 代替前缀#

      每个组件都有被Angular管理的生命周期 Angular提供生命周期钩子

      ngOnChanges()     当Angular重新设置数据绑定输入属性时响应。该方法接受当前和上一属性值的SimpleChanges对象
                        在ngOnInit() 之前以及所绑定的一个或多个输入属性的值发生变化时都会调用
      ngOnInit()        在Angular第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件
                        在第一轮ngOnChanges()完成之后调用，只调用一次
      ngDoCheck()       检测，并在发生Angular无法或不愿意自已检测的变化时作出反应
      ngAfterContentInit()  当Angular把外部内容投影进组件/指令视图之后调用、
      ngAfterContentCheckec()   每当Angular完成被投影组件内容的变更检测之后调用
      ngAfterViewInit()   当Angular初始化完组件视图及其子视图之后调用
      ngAfterViewChecked  每当Angular做完组件视图和子视图的变更检测之后调用
      ngOnDestroy()     每当Angular每次销毁指令/组件之前调用并清扫。
      * 
      */

      /**
        NgModule把组件、指令和管道打包成内聚的功能块，每个模块聚焦于一个特性区域、业务领域、工作流或通用工具
        模块还可以把服务加到应用中。
        模块可以在应用启动时急性加载，也可以由路由器进行异步的惰性加载
        基本模块 BorwserModule  当你想要在浏览中运行应用时
         NgModule
          FormsModule 当要构建模板驱动表单时（它包含ngModel)
          ReactiveFormsModule 当要构建响应式表单时
          RouterModule  要使用路由功能
          HttpClientModule 当要和服务器对话时
        CommonModule  当你想要使用NgIf或NgFor时

        特性模块  JavaScript模块和NgModule模块  常用模块
        特性模块分类
          领域特性模块
          带路由的特性模块 所有惰性加载的模块都是路由特性模块
          路由模块  为其它模块提供路由配置
          服务特性模块
          可视部件特性模块

          入口组件：入口组件是Angular命令式加载的任意组件（也说是说你没有在模板中引用过它），可以在NgModule中引导它
          有两种类型：
            1引导用的根组件
            2在路由定义中指定的组件
            entryComponents数组
          惰性加载只有当需要的时候才加载模块 对于惰性加载它们的providers数组中列出的服务都是不可用的，因为根注入器
          并不知道这些模块
          当Angular的路由器惰性加载一个模块时，它创建一个新的注入器。这个注入器是应用的根注入器的一个子注入器
          路由器会把根注入器中的所有提供商添加到子注入器中。如果路由器在惰性加载时创建组件，Angular会更倾向于使用从这些提供商
          中创建的服务实例，而不是来自应用的根注入器的服务实例

          任何在惰性加载的上下文中创建的组件，都会获取该服务的局部实例，而不是应用的根注入器中的实例。而外部模块中的组件，仍然
          会收到来自于应用的根注入器创建的实例

          提供单例服务
            把@Injectable() 的providedIn属性声明为root
            把该服务包含在AppModulde或某个只会被AppModule导入的模块中。

          forRoot()
            如果模块同时定义了Providers(服务)和declarations(组件、管理、指令),那么，当你同时在多个特性模块中加载此模块时，
            这些服务就会被册在多个地方。这会导致出现多个服务实例，并且该服务的行为不再像单例一样

            forRoot()把提供商从该模块中分离出去，这样你就能在根模块中导入该模块时带上providers, 并且在子模块中导入它时
            不带providers
       */
      /**
        依赖，是当类需要执行其功能时，所需要的服务或对象。DI是一种编码模式，其中的类会从外部源中请求获取依赖，而不是自已创建
        Angular中DI框架会在实例化该类时向其提供这个类所声明的依赖项
       */

       /**
          每一个带路由的Angular应用都有一个Router（路由器）服务的单例对像。当URL变化时，路由器会查找对应的Router，
          并根据此决定该显示哪个组件
          路由器需先配置才会有路由信息

          路由器使用先匹配者优先的策略来匹配路由，所以，具体路由应放在通用路由前面
          RouterModule.forRoot(appRoutes, {enableTracing: true});
          enableTracing它会把每个导航生命周期中的事件输出到浏览器的控制台

          路由出口
            RouterOutlet是一个来自路由器模块中的指令，它的用法类似于组件。它扮演一个占位符的角色。用于在模板中标出
            一个位置，路由器将会把要显示在这个出口处的组件显示在这里
          路由器链接
            a标签上的RouterLink指令让路由器得以控制这个a元素
          路由链接的激活状态
            RouterLinkActive 指令会基于当前的RouterState为活动的RouterLink切换所绑定的css类
            路由器链接的激活状态会向下级联到路由树中的每个层级，所以，父子路由链接可能会同时激活。要覆盖这种行为可以
            [routerLinkActiveOptions]绑定为{exact: true} 这样RouterLink只有当URL与当前URL精确匹配时才会激活
          路由状态
            在导航时的每个生命周期成功完成时，路由器会构建出一个ActivatedRoute组成的树，它表示路由器的当前状态
            可以应用中的任何地方用Router服务及其routerState属性来访问当前的RouterState值
          激活的路由
            该路由的路径和参数可以注入进来的一个名叫ActivatedRouter的路由服务来获取
            url 路由路径的Observable 对象，是一个由路由路径中的各个部分组成的的字符串数组
            data  一个Observable，其中包含提供的data对象。也包含由解析守卫（resolve guard）解析而来的值
            paramMap  一个Observable, 其中包含一个由当前路由的必要参数和可选参数组成的map对象。用这个map可以
            获取来自同名参数的单一值或多重值
            queryParamMap 一个Observable,其中包含一个对所有路由都有效的查询参数组成的map对象
            fragment  一个适用于所有路由的URL的fragment（片段）的observable
            outlet  要把该路由渲染到的RouterOutlet的名字。对于无名路由，它的路由名是primary, 而不是空串
            routerConfig  用于该路由的配置信息，其中包含原始路径
            parent  当该路由是一个子路由时，表示该路由的父级ActivatedRouter
            firstChild  包含该路由的子路列表中的第一个ActivatedRouter
            children  包含当前路由下所有已激活的子路由
          路由事件
            Router会通过Router.events属性发布一些导航事件
            NavigationStart 导航开始
            RouteConfigLoadStart  加载某个懒加载之前
            RiyteConfigLoadEnd    加载某个懒加载之后
            RoutesRecognized    解析完URL，并识别出了相应的路由时触发
            GuardsCheckStart    路由开始Guard之前   Guard警卫
            ChildActivationStart  开始激活路由和子路由时触发
            Activation    路由器激活某个路由时触发
            GuardsCheckEnd
            ResolveStart  Router开始解析（Resolve）阶段时触发
            REsolveEnd
            ChildActivationEnd
            ActivationEnd
            NavigationEnd
            NavigationCancel  导航被取消
            NavigationError 
            Scroll
          路由器部件
            Router(路由器)    为激活的URL显示应用组件。管理从一个组件到另一个组件的导航
            RouteModule     一个独立的NgModule，用于提供所需的服务提供商，以及用来在应用视图之间进行导航的指令
            Routes(路由器数组)  定义了一个路由数组，每一个都会把一个URL路径映射到一个组件
            Route(路由)     定义路由器该如何根据URL模式（pattern)来导航到组件。大多数路由都由路径和组件类构成
            RouterOutlet(路由出口)    指令<router-outlet> 标记哪显示视图
            RouterLink(路由链接)
            RouterLinkActive(活动路由链接)  为每一个路由提供一个服务
            RouterState(路由器状态)
          
          路由重定向需要一个pathMatch属性，来告诉路由器如何去匹配路由的路径

          Snapshot（快照）当不需要Observable时的替代产品
          this.route.snapshot.paraMap.get('id');

          设置可选路由参数
          第二路由
          <div [@routeAnimation]="getAnimationData(routerOutlet)">
            <router-outlet #routerOutlet="outlet"></router-outlet>
          </div>
          <router-outlet name="popup"></router-outlet>
          {
            path: 'compose',
            component: ComposeMessageComponent,
            outlet: 'popup'
          },
          <a [routerLink]="[{ outlets: { popup: ['compose'] } }]">Contact</a>

          路由守卫
            守卫返回一个值用以控制导航过程 true/false/UrlTree
            但在多数情况下不会同步处理 所以路由守卫可以 返回一下Observable 或Promise
          守卫接口
            用CanActivate来处导航到到某路由的情况
            用CanActivateChild来处理导航到某子路由的情况
            用canDeactivate来处理从当前路由离开的情况
            用Resolve在路由激活之前获取路由数据
            用CanLoad来处理异步导航到某特性模块的情况
            在分层路由的每个级别上，你都可以设置多个守卫。路由器会先按照从最深的子路由由下往上检查的顺序来检查
            CanDeactivate()和CanActivateChild()守卫

        */
/**
 Angular提供两种编译来编译你的应用
    即时编译（JIT），它会在运行期间在浏览中编译你的应用
    预先（AOT）编译，它会在构建时编译你的应用
    默认是JIT编译 AOT要自已指定 ng build --aot 带有--prod标志的ng build命令会默认使用AOT编译

    渲染更快
    使用AOT，浏览器下载预编译版本的应用。浏览器直接加载运行代码，所以它可以立即渲染该应用，而不用等应用完成首次编译
    需要的异步请求更少
    编译器把外部的HTML模板和CSS样式表内联到了应用的Javascript中，消除了用来下载那些源文件的Ajax请求
    提早检测模板错误
    更安全

    Angular的AOT编译会把元数据提取出来，以告诉Angular应该如何管理应用程序的哪些部分

 */