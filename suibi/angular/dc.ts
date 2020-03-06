// change detection

const h1 = `
angular 有一个zone.js库 对所有可以发生值改的事件做了一层处理
Events: click, mouseover, mouseout, keyup, keydown等所有浏览器事件
Timer: setTimeout, setInterval
XHR

Angular还为我们提供了禁用zone.js的方法
禁用zone.js后不会自动更新视图

Angular是一个组件树
默认情况下（ChangeDetectionStrategy.Default），父组件的变更检测发生时，子组件也会触发变更检测

生命周期构子
ngOnChanges() 当Angular（重新）设置数据绑定输入属性时。该方法接受当前和上一属性值的SimpleChanges对象
在ngOnInit 之前以及绑定的一个或多个输入属性的值发生变时都会调用

ngOnInit() 在Angular第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件
在第一轮ngOnChanges()完成之后 只调用一次

ngDoCheck() 检测，并在发生Angular无法或不愿意检测的变化时作出反应
在每个变更检测周期中，紧跟在ngOnChanges()和ngOnInit()后面调用

ngAfterContentInit() 当Angualr把外部内容投影进组件/指令之调用
第一次ngDoCheck()之后调用，只调用一次

ngAfterContentChecked() 每当Angular完成被投影组件内容的变更检测之后调用
ngAfterContentInit()和每次ngDocheck()调用之后

ngAfterViewInit() 当Angular初始化完组件视图和子视图之后调用
第一次ngAfterContentCheckec()之后调用 只调用一次

ngAfterViewChecked() 每当Angular做完组件视图和子视图的变更检测之后调用
ngAfterviewInit()和每次ngAfterContentInit()之后调用

ngOnDestroy() 每当Angular每次销毁指令/组件之前调用并清扫。在这反订阅可观察对象和分离事件处理器，以防内存泄漏
在Angular销毁指令/组件之前调用


变更检测顺序 Detection Sequence
1. 更新所有子组件的绑定属性
2. 调用所有子组件的onChanges, OnInit, DoCheck, AfterContentInit生命周期构子 ？OnInit
3. 更新当前组件的DOM
4. 子组件触发变更检测
5. 调用所有子组件的AfterViewInit的生命周期构子

ChangeDetectionStrategy默认为Default，也就是父组件的CD会触发子组件的CD
在有些情况下我们可以自行判断出某行子组件在父组件CD时并不用触发，而OnPush就是这样一个选择

Angular给每一个组件都关联了一份组件视图，通过ChangeDetectorRef可以拿到相关联的视图


`;
// platform 平台 browser浏览器 dynamic 平台
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import AppModule from '';
import {ApplicationRef, Component} from '@angular/core';

platformBrowserDynamic().bootstrapModule(AppModule, {
    ngZone: 'noop', // 禁用zone.js
})
.then(ref => {

})
.catch(err => console.error(err))

@Component({
    select: 'my-app',
    templateUrl: './',
    styleUrls: './',
})
export class AppComponent {

    constructor(private applicationRef: ApplicationRef) {

    }

    name;

    normalClick() {
        this.name = '....';
        this.applicationRef.tick(); // 直接调用这个方法 会更新视图
    }

}

export declare abstract class ChangeDetectionRef {
    // detach 的组件不会被检测变更
    abstract checkNoChanges(): void;
    abstract detach(): void; // deetach 分离
    abstract detachChanges(): void; // 触发一次变更检测
    abstract markForCheck(): void;
    abstract reattach(): void; // 让被detach的组件重可以被重新检测变更
    // reattach 只会重新启用对当前组件的变更检测，但是如果父组件没有启动变更检测，那么reattach并不会起得作用
    // markFroCheck 可以很好的解决这个问题
}