// /**
//  * 硬盘 {多个盘片={独立磁头(所有记录面上的相同序号的磁道构成一个圆柱面，其编号与与磁道编号相同 
//  *      将文件存储在在硬盘上时尽量放在同一个柱面或相邻柱面上 这样可以缩短寻道时间)，
//  *      } => 盘片组}
//  * 将盘片划分为许多同心圆，称为磁道，从外住里编 最外面是0
//  * 沿径向的单位距离称为密度单位tpi(每英寸磁道数)
//  * 将磁道沿首圆周等分为若干段，第段称为一个扇区或扇段，每个扇区内可存放固定长度的数据块，如512b
//  * 磁道上单位距离可以记录的位数称为位密度，单位bpi(每英寸位数)
//  * 每条磁道扇区数相同 扇区大小又不一样 每条磁道记录同样多的信息
//  * 里圈磁道圆周比外圈磁道圆周小 所以里圈磁道的位密码比外圈磁道高 最内圈的位密度称为最大位密度
//  * 
//  * 硬盘的寻信息同硬盘的驱动号、圆柱面号、磁头号（记录面号）、数据块号(或扇区号) 以及交换量组成
//  * 磁盘容量分两种：1 非格式化容量 它指一个磁盘所能存储的总位数
//  * 非 = 面数 * (磁道数/面) * 内周长 * 最大位密度
//  * 2格式化容量 它指各个扇区中数据区容量的总和
//  * 格 = 面数 * (磁道数/面) * (扇区数/道) * (字节数/扇区)
//  * 
//  * 多中断信号线法 每一个中断源都有属于自已的一根中断请求信号线向cpu提出中断请求
//  * 中断软件查询法 当CPU检测到一个请法求信号以后，即转入到中断服务程序去轮询每个中断源以确定是是谁发出了中断请求信号 对各个设
//  * 备的响应优先级由软件设定
//  * 菊花链法 软件查询的缺陷在于花费时间太多。 菊花链法际上是一个种硬件查询法 所有的I/O模块共享一根共同的中断请求线，而中断确认
//  * 信号则以链式在各模块间相连。 当CPU检测到中断请求信号时，则发出确信信号。中断确认信号依次在I/O模块传递 直到发出请求的模块，
//  * 该模块则把它的ID送住数据线由CPU读取
//  * 中断向量表法 中断向量表用来 保存各个中断源的中断服务程序入中地址。当外设发出中断请求信号(INTR)以后，由中断控制器(INTC)
//  * 确定中断号，并根据中断号查找中断向量表来取得其中断服务程序入中地址，同时把INTC把中断请求信号提交给CPU
//  * 
//  * 
//  * 总线 是指计算机设备和设备之间传输信息公共数据通道
//  * 总线分为三类 数据总线、地址总线、和控制总线
//  * 数据总线(DB)用来传输数据信息，双向的
//  * 地址总线(AB) 用于传送CPU发出的地址信息，单向的 传送地址信息的目的指明与CPU交换信息的内存单元或I/O设备
//  * 地址总线的宽度 决定了CPU的最大寻址能力
//  * 控制总线(CB) 用于传送控制信号和时序信息和状态信息
//  * 
//  * 方法和语言的形式描述
//  * 字母表、字符串、字符串集合及运算
//  * 
//  * 语言是有限字母表上的有限长度字符串的集合，这个集合中的每个字符串都是按照一定的规则生成的
//  * 所谓产生语言 是指制定出有限个规则，借助他们就能产生此语言的的全部句子
//  * 
//  * 文法的定义 描述语言语法结构的规则称为文法  文法 G 是一个四元组， 可表示为 G = (Vn,Vt,P,S),
//  * 其中Vt是一个非空有限集，其每一个元素称为一个终结符；
//  * Vn是一个非空有限集，其每一个元素称为非终结符； Vn和Vt含公共无素
//  * 令 V = Vn和Vt的交集 和V为文法G的词汇表，V中的符号称为文法符号
//  * P是生产式的有限集合
//  * S称为开始符号，它至少要在一条生产式中作为左部出现。
//  * 
//  * 结点的度 一个结点的子树数个数记为该结点的度
//  * 叶子结点 称为终端结点 指度为0的结点
//  * 内部结点 度不为0的结点也称分支结点
//  * 结点的层次 根结点为第一层 根的孩子的为第二层 以此类推
//  * 树的高度 一棵树的最大层数为树的高度
//  * 有序(无序)树 若将树中结点的各子树看成是从左到右具有次序的，即不能交换 则称之为有序 反之无序
//  * 二叉树先序 根左右 中序 左根右 后序 左右根
//  * 
//  * 二叉树的遍历实质上是对一个非线性进行线性化的进程，它使得每一个点（除第一个和是最一个）
//  * 在这线性序列中有且仅有一个直接前驱和直接后继 但在二叉链表存储结构中，只能找到一个结点的左、右孩子
//  * 不能直接得到结点的在任一遍历序列中的前驱和后继，这些信息只有在遍历的动态过程才能得到，因些，引入线索二叉树来保存这些
//  * 动态过程得以的信息
//  * 
//  * 按某种次序将二叉树线索化，实质上是遍历中用线索取代空指针 因此，若设指针p指向正在访问的结点，则遍历时设
//  * 立一个指针pre，使其始终指向刚刚访问过的结点（即p所示结点的前驱结点），这样就记下了遍历过程中结点被访问的先后关系
//  * 在遍历过程中，设指针p指向正在访问的结点
//  * 1.若P所指向的结点有空指针域，则将相应的标志域置为1
//  * 2.若pre!=NULL且pre所指结点的ltag等于1，则令pre->rchild=p;
//  * 3.若p所指向结点的ltag等于1，则令p->child=pre.
//  * 4.使pew指向刚刚访问的结点，即令 pre = p
//  * 
//  * 最优二叉又称为哈夫曼树，它是一类带权路径长度最短的树
//  * 路径是从树中一个结点到另一个结之间的通路，路径上的分支数目称为路径长度
//  * 树的路径长度是从树根到每一个叶子结点之间的路径长度之和。
//  * 结点带权路径长度为从该结点到树根之间的路径长度与该结点权值的乘积
//  * 树的带权路径长度为树中所有叶子结点的带权路径长度之和，记为 WPL=（求和 k->n）（wklk）
//  * 
//  */

// //  Graph() {
// //      let vertices: string[]; vertices = [];
// //  }

// /**
//  * 顶点接口
//  */
// interface V {
//     name: string;
//     color?: string;
// }

// class Graph {
//     vertices: V[] = []; //  用来存放图中所有的顶点
//     adjList: Map<V, V[]> = new Map(); // 存放邻接表 使用顶点来做键，邻接顶点来做值
//     constructor() {
//     }

//     /**
//      * 添加顶点的方法
//      * @param v
//      */
//     addVertices(v: V) {
//         // 将顶点存放到顶点数组中
//         this.vertices.push(v);
//         // 生成一个没有邻接顶点列表的Map，因为这时我们已经有顶点了，所以要生成以待使用
//         this.adjList.set(v, []);
//     }

//     /**
//      * 添加边
//      * 要注意的是，实际上，在代码中，我们是没有一个东西（变量或者其他什么）来代表边的
//      * 我们为两个顶点之间添加一个边实际上只是为两个顶点的邻接表中加入彼此。这样就代表了这两个顶点是相邻的
//      */
//     addEdge(v: V, w: V) {
//         // 无向图， 需要给两个顶点所对应的邻接表加入彼此
//         // 如果是有向图加入一个就可以了
//         this.adjList.get(v).push(w);
//         this.adjList.get(w).push(v);
//     }

//     /**
//      * 初始化树中各顶点的状态（颜色），并返回该状态数组
//      */
//     initializeColor(): {} {
//         let color: {} = {};
//         for (let i = 0; i < this.vertices.length; i++) {
//             color[this.vertices[i].name] = 'white';
//         }
//         return color;
//     }

//     /**
//      * 广度优先
//      * @param v 图的某一个顶点
//      * @param callback
//      */
//     bfs(v: V, callback: (x: V) => {} ) {
//         let color: {} = {};
//         let d: {} = {}; // d是传入顶点距每个顶点距离
//         let pred: {} = {}; // 就是当前顶点沿着路径找到的前一个顶点是什么，没有就是null;
//         let queue: Queue<V> = new Queue();
//         // 初始化距离和前置点数组。一个都为0，一个都为null
//         for (let i = 0; i < this.vertices.length; i++) {
//             d[this.vertices[i].name] = 0;
//             pred[this.vertices[i].name] = null;
//         }
//         // 将传入的顶点入队
//         queue.enqueue(v);
//         // 如果队列非空，也就是说队列中始有已发现但是未探索的顶点，那么执行逻辑
//         while(!queue.isEmpty()) {
//             // 队列遵循先进先出的原则，所以我们声明一个变量来暂时保存队列中的第一个顶点元素。
//             let u: V = queue.dequeue();
//             let neighbors: V[] = this.adjList.get(u);
//             // 将把状态数组中u的状态设置为已发现但是未过完全探索的灰色状态
//             color[u.name] = 'grey';
//             //我们循环当前的u的所有的邻接顶点，并循环访问每一个邻接顶点并改变它的状态为灰色。
//             for (let i = 0; i < neighbors.length; i++) {
//                 let w: V = neighbors[i];
//                 if (color[w.name] === 'white') {
//                     color[w.name] = 'grey';
//                     d[w.name] = d[u.name] + 1;
//                     pred[w.name] = u;
//                     // 入队一个w,这样while循环会在队列中没有任何，也就是完全访问完所有顶点的时候结束
//                     queue.enqueue(w);
//                 }
//             }
//             // 完访问完后设置color状态
//             color[u.name] = 'black';
//             if (callback) {
//                 callback(u);
//             }
//         }
//     }

//     /**
//      * 深度优先
//      * @param v
//      */
//     dfs(v: V) {

//     }

//     /**
//      * 输出图
//      */
//     gToString(): string {
//         let s:string = '';
        
//         for (let i = 0; i < this.vertices.length; i++) {
//             s += this.vertices[i].name + '->';
//             let neighbors: V[] = this.adjList.get(this.vertices[i]);
//             for (let j = 0; j < neighbors.length; j++) {
//                 s += neighbors[j].name + '  ';
//             }
//             s += '\n';
//         }
//         return s;

//     }

// }

// class Queue<T> {
//     queue: T[] = [];
//     constructor() {

//     }
//     /**
//      * 入队列
//      */
//     enqueue(v: T) {
//         this.queue.push(v);
//     }
//     /**
//      * 出队列
//      */
//     dequeue(): T {
//         // 先进先出
//         let re: T = this.queue.splice(0, 1)[0];
//         return re;
//     }
//     /**
//      * 判断队列是否为空
//      */
//     isEmpty():boolean {
//         if (this.queue.length < 1) {
//             return true;
//         }
//         return false;
//     }
// }

// let graph: Graph = new Graph();

// let tempVertices: V[] = [{name: 'A'}, {name: 'B'}, {name: 'C'}, {name: 'D'}, {name: 'E'}, {name: 'F'},
//  {name: 'G'}, {name: 'H'}, {name: 'I'}];

//  for (let i = 0; i < tempVertices.length; i++) {
//      graph.addVertices(tempVertices[i]);
//  }

//     graph.addEdge(tempVertices[0], tempVertices[1]);
//     graph.addEdge(tempVertices[0], tempVertices[2]);
//     graph.addEdge(tempVertices[0], tempVertices[3]);
//     graph.addEdge(tempVertices[2], tempVertices[3]);
//     graph.addEdge(tempVertices[2], tempVertices[6]);
//     graph.addEdge(tempVertices[3], tempVertices[6]);
//     graph.addEdge(tempVertices[3], tempVertices[7]);
//     graph.addEdge(tempVertices[2], tempVertices[5]);
//     graph.addEdge(tempVertices[2], tempVertices[4]);
//     graph.addEdge(tempVertices[4], tempVertices[6]);
//     graph.addEdge(tempVertices[4], tempVertices[8]);
//     console.log(graph.gToString());