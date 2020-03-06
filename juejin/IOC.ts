/**
 *  IOC (Invsersion of Control) 控制反转， DI (Dependency Injection) 依赖注入
 Ioc 意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制
 理解谁控制谁，为何是反转，哪些方面反转了

 谁控制谁，控制什么： 我们一般直接在对象内部通过new进行创建对象，是程序主动去创依赖对象；
 而Ioc是有专门一个容器来创建这些对象，即由Ioc容器来控制对象的创建；
 也就是 Ioc容器控制了对象，主要控制了对外部资源的获取（不只是对象包括文件等）；

 为何是反转，哪些方面反转了：传统中是由我们自已在对象中主动控制去直接获取依赖对象，也就是正转；
 而反转则由容器来帮忙创建及注入依赖对象；
 为何是反转？因为由容器帮我们查找及注入依赖对象，对象只是被动接受依赖对象，所以是反转；
 依赖对象的获取被反转了

 Ioc 是一种思想，指导我们如何设计出松耦合、更优良的程序
 传统中都是由我们在类内部主动创建依赖对象，从而导致了类之类之间高耦合，难于测试
 有了Ioc容器后，把创建和查找依赖对象的控制权交给了容器，由容器注入对象，所以对象与对象之间是 松散耦合，这样也方便测
 利于功能复用，更复要的是使用程序的整个体系结构变得大非常灵活。

 DI：组件之间依赖关系由容器在运行期间决定，形象的说，即由容器动态的将某个依赖关系注入到组件中。
 依赖注入的目的并非为复软件系统带来更多的功能，而是为了提升组件重用的频率，并为系统搭建一个灵活，可扩展的平台
 通过依赖注入机制，我们只需要通过简单的配置，而无需任何代码就可以指定目标需要的资源，完成自身业务逻辑，
 而不需要关心具体的资源来自何处，由谁实现

 谁依赖谁：当然是程序依赖于IOC容器
 为什么需要依赖：应用程序需要Ioc容器来提供对象需要的外部资源；
 谁注入谁：Ioc容器注入应用程序的某个对象，应用程序依赖的对象；
 注入了什么：就是注入某信对象所需要的外部资源（包括对象，资源、常量数据）

 */

//  实现一个Ioc容器
// 因为key类型不一定是字符型，而数组遍历比较浪费性能，因此不选择Object和Array而选择Map作为容器的数据结构
// 目标是实现一个可以懒加载的Ioc容器，所以可以在类Injector里写两个私有类，一个存token和依赖，一个存token和
// 实例化的依赖实例
// 在需要某个依赖实例的时候，先去实例Map中根据token查找出对应的token实例，如果没有就从存依赖的Map中拿出
// 来实例化之后再放入存放实例的的Map

import 'reflect-metadata';

    export class Injector {
        private readonly providerMap: Map<any, any> = new Map(); // Provider 供应商
        private readonly instanceMap: Map<any, any> = new Map(); // instance 实例

        public setProvider(key: any, value: any): void {
            if (!this.providerMap.has(key)) { this.providerMap.set(key, value); }
        }

        public getProvider(key: any): any {
            return this.providerMap.get(key);
        }

        public setValue(key: any, value: any): void {
            if (this.instanceMap.has(key)) { this.instanceMap.set(key, value); }
        }
    }

// 创建一个容器实例
export const rootInjector = new Injector();

// 实现一个服务
// 仿ng的Injectable,通过类装饰器存入容器
export function Injectable(): (_constructor: any) => any {
    return function(_constructor: any): any {
        // 把类作为token，把该类存入provider容器，提供给需要信赖的类
        rootInjector.setProvider(_constructor, _constructor);
        return _constructor;
    }
}

// 实现基于注解的属性注入
// 之所以不实现构造注入，setter注入是因为像ng和react这类框架会直接对构造函数进行或者是限制构造函数的参数，
// 为了尽量跨框架跨前后端使用，所以还是用装饰器对属性注入尽量减少侵入性

// 属性装饰器和反射能帮我们实现这一功能
export function Inject(): (_constructor: any, propertyName: string) => any {
    return function(_constructor: any, propertyName: string) {
        const propertyPtye: any = Reflect.getMetadata();
    }
}