/**
 * 在解构赋值中，等号右侧是一个数组或对象（一个结构化的值），
 * 指定左侧一个或多个变量的语法和右侧的数组和对象直接量的语法格式保持一致
 * 
 * 　虽然循环语句语法简单，但如果将多个循环嵌套则需要追踪多个变量，代码复杂度会大大增加，
 * 一不小心就错误使用了其他for循环的跟踪变量，从而导致程序出错。迭代器的出现旨在消除这种复杂性并减少循环中的错误
 * 
 */

 /**
  * 当文档遇到<script>元素时，它默认必需先执行脚本，然后在恢复文档的解析和渲染
  * 脚本的执行默认情况下是同步和阻塞的 有defer 和async 属性
  * defer属性使得浏览器延迟脚本的执行，直到文档的载入和解析完成，并可以操作
  * async属性可以使得浏览器可以尽快的执行脚本，而不用在下载脚本时阻塞文档解析
  * 延迟的脚本会按它们在文档里的出现顺序执行。
  * 而异步脚本在它们载入后执行，这就可以是无序执行的
  * 
  * 1 Web浏览器创建Document对象，并且开始解析Web页面，解析HTML元素和它们的文本内容后添加Element对象和Text节点到文档中。
  * 在这个阶段document.readystate属性值是'loading'.
  * 2 当HTML解析器遇到没有async和defer属性的<script>元素时，它把这些元素添加到文档中，然后执行行内或外部脚本。
  * 这些脚本同步执行，并且在脚本下载（如果需要）和执行时解析器会暂停。这样脚本就可以用document.write()来把文本插入文本流。
  * 解析器恢复时这些文本会成为文档的一部分。同步脚本经常简单定义函数和注册后面使用的注册事件处理程序，但它们可以遍厉和操作文档树，
  * 因为它们执行时已经存在了。这样同步脚本可以看到它们自己的<script>元素和它们之前的文档内容
  * 3 当解析器遇到设置了async属性的<script>元素时，它开始下载脚本文本，并继续解析文档。脚本会在它下载完成后尽快执行，
  * 但是解析器没有停下来等它下载。导步脚本禁止使用document.write()方法。 它们可以看到自己的<script>元素和它之前的所有文档，
  * 并且可能或干脆不可能访问其他的文档内容
  * 4 当文档完成解析， document.readyState属性变成interactive
  * 5 所有的defer属性脚本，会按它们在文档里的出现顺序执行。 异步脚本可能也会在这个时间执行。
  * 延迟脚本能访问完整的文档树，禁止使用document.write()方法
  * 6 浏览器在Documenet对象上触发DOMContentLoaded事件。 这标志着程序执行从同步脚本阶段转换到了异步事件驱动事件。
  * 但要注意，这时可能还有异步脚本没有执行完成
  * 7 这时，文档已经完全解析完成，但是浏览器可能还在等待其他内容载入，如图片。当所有这些内容完成载入时，
  * 并且所有异步脚本完成载入和执行，document.readyState属性改变为'complete'， Web浏览器触发Window对象上的load事件。
  * 8 从此刻起，会调用异步事件，以异步响应用户输入事件、网络事件、计时器过期等。
  * 
  */

  /**
   * 同源策略
   * 同源策略是对javascript代码能够操作哪些Web内容的一条完整的安全限制
   * 同源策略负责管理窗口或窗体中的javascript代码以有和其他窗口或帧的交互
   * 脚本只能读取和所属文档来源相同的窗口和文档的属性
   * 
   * 跨域资源共亨
   * 
   */

   /**
    * Document类型代表一个HTML或XML文档，Element类型代表该文档中的一个元素。
    * HTMLDoument和HTMLElement只是针对HTML文档和元素
    * 
    * Document对象，它的Element对象和文档中表示文本的text对象都是Node对象 Node定义了以下几个属性
    * parentNode 该节点的父节点
    * childNodes 只读的类数组对象(NodeList)对象，它是该节点的子节点的实时表示
    * firstChild lastChild 该节点的子节点的第一个和最后一个
    * nextsibling previoursSibling 该节点兄弟节点的前一个和后一个
    * nodeType 节点类型
    * nodeValue Text节点或Comment节点的文本内容
    * nodeName 元素的标签名以大写表示
    * 
    * 基于元素的文档遍历API的第二部分是Elemnt属性
    * firstElementChild, lastElementChild
    * nextElementSibling previourElementSibling
    * 
    * 
    */

    /**
     * appendChild() 在需要插入的Element节点上调用的，它插入指定的节点使其成为那个节点的最后一个节点 父节点里面
     * insertBefore() 接收两个参数 第一个参数是待插入的节点，第二个参数是已存在的节点，新节点插入该节点前面 兄弟节点前面
     * 
     * removeChild() 方法是从文档树中删除一个节点。但是请小心：该方法是其父节点上调用的
     * n.parentNode.removeChild(n);
     * replaceChild() 方法删除一个子节点并用一个新的节点取而代之。在父节点上调用该方法
     * n.replaceChild(document.createTextNode('[redacted]'), n); 
     * 
     * DocumentFragment 是一种特殊的Node,它作为其他节点的一个临时的容器
     * var frag = document.createDocumentFragment();
     * 像Document节点一亲DocumentFragment是独产的 它的parentNode总是null.但类似Element,它可以有任意多的子节点
     * 可以用appendChild、insertBefore() 等方法来操作它们
     * DocumentFragment的特殊之处在于它使得一组节点被当做一个节点看待
     */

     // 以一个对象的x,y属性返回滚动条的偏移量
     function getScrollOffsets(w: Window = window) {
        if (w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
        var d = w.document;
        if (document.compatMode == 'CSS1Compat')
            return {x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop};
        return {x: d.body.scrollLeft, y: d.body.scrollTop};
     }

     function getViewportSize(w: Window = window) {
        if (w.innerWidth != null) return {x: w.innerWidth, y: w.innerHeight};
        var d = w.document;
        if (document.compatMode == 'CSS1Compat')
            return {x: d.documentElement.clientWidth, y: d.documentElement.clientHeight};
        return {x: d.body.clientWidth, y: d.body.clientHeight};
     }

     /**
      * 判断一个元素的尺寸和位置调用getBoundingClientRect()方法。返回left,right,top,bottom
      * left,top,y坐标 right和bottom表示右下角x,y坐标
      * 如果想查询内联元素每个独立的矩形，调用getClientRects()方法 所返回的对象并不是实现的
      * getElemntByClassName()这样的DOM返回的结果是实时的，当文档变化时这些结果能自动更新
      * 
      * elementFromPoint()方法判定坐标上有什么元素 不怎么用
      * scrollIntoView() 将要显示的html元素显示在屏幕上
      * 与window.location.hash为一个命名锚点（<a name=''>元素）的名字后浏览器产生的行为类似
      * 
      * HTML元素的只读属性offsetWidth和offsetHeigth以css像素返回它的屏幕尺寸 包含边框和内边距不包含外边距
      * HTML元素拥有offsetLeft和offsetTop属性返回元素的X和Y坐标
      * 对于很多元素，这些值是文档坐标，并直接指定元素位置。但对于已定位元素的后代元素和一些其他元素(如表格单元),
      * 这些属性返回的坐标是相对于祖先元素的而非文档
      * offsetParent属性指定这些属性所相对的父元素。如果offsetParent为null，这些属性都是文档坐标
      */

      // 用offsetLeft和offsetTop计算元素e的位置
      function getElementPosition(e) {
          var x = 0, y = 0;
          while(e != null) {
              x += e.offsetLeft;
              y += e.offsetTop;
              e = e.offsetParent;
          }
          return {x: x, y: y};
      }

      /**
       * clientWidth和clientHeight类似offsetWidth和offsetHeight, 不同的是他们不包含边框大小，只包含内容和它的内边距
       * 同时，如果浏览器在内边距和内边框之间添加了滚动条，clientWidth和clientHeight在返回值中也不包含滚动条
       * 类似<i>,<code>,<span>这些内联元素，clientWidth和clientHeight总是返回0
       * 在文档的根元素上查询这些属性时，它们的返回值和窗口的innerWidth和innerHegiht属性值相同
       * 
       * clientLeft和clientTop没什么用 相当于边框大小 对于内联元素也是0
       * 
       * scrollWidth和scrollHeight是指定元素的滚动条的位置。 可写属性 用来改变滚动条位置
       */

       // 当文档包含有滚动条的且有溢出内容时 重写getElementPostion
       function getElementPos(elt) {
            var x = 0, y = 0;
            // 循环以累加偏移量
            for (var e = elt; e != null; e.offsetParent) {
                x += e.offsetLeft;
                y += e.offsetTop;
            }
            // 再次循环所有的祖先元素，减去滚动的偏移量
            // 这也减去了主滚动条，并转换为视口坐标
            for (var e = elt.parentNode; e != null && e.nodeType == 1; e = e.parentNode) {
                y -= e.scrollTop;
                x -= e.scrollLeft;
            }
            return {x: x, y: y};
       }


/**
 * HTTP请求方法或“动作”（verb)
 * 正在请求的url
 * 一个可选的请求头集合，其中可能包含身份验证信息
 * 一个可选的请求主体
 * 
 * 状态码 响应头集合 响应主体
 * 
 */

 var request = new XMLHttpRequest();
 // 调用 request的open方法 两个参数  方法和URL
 request.open('GET', // 开始一个 HTTP GET 请求 不区分大小写
            'url'); // url的内容
// get用于常规请求 对服务器没有任何副作用以及服务器的响应是可缓存的

// 设置请求头 
request.setRequestHeader('Content-Type', 'text/plain');
// 如果对相同的头多次调用setRequestHeader()多次 新值不会取代之前的值， 相反，HTTP请包含这个头的多个副本或这个头将指定多个值

// 无法向setRequestHeader() 传递这些头：
/**
 *  Accept-Charset Content-Transfer-Encoding TE
 *  Accept-Encoding Date Trailer
 *  Connection Expect Transfer-Encoding
 *  Content-Length Host Upgrade
 * Cookie   Keep-Alive User-Agent
 * Cookie2 Referer Via
 */
// 你能指定Authorization 头

// 指定可先的请求主体并向服务器发送它
request.send(null); // get没有请求主体应用null或省略 post请求通常拥有主体
// 使用getResponseHeader() 和 getAllResponseHeader()能查询响应头
// 响应体可以从responseText 属性中得到文本形式的 从responseXML属性中得到document形式的
// 为了得到响应通知 要监听XMLHttpRequest对象上的readystatechange事件
request.onreadystatechange = function() {
    // if 
}

// HTTP响应也可以是同步的 如果给open()第三个参数传false ,那么send()方法将阻塞直到请求完成
