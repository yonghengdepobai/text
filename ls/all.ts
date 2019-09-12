
/**
 * tsc 文件名
 * node 文件名
 * ts-node 文件名
 */


 /**
  * 最短路径
  */

class vex{
    data;
    firstEdge;
    in;
	constructor(value){
		this.data = value;
		this.firstEdge = null;
		this.in = 0;   //用于存放顶点的入度
	}

}

class adjvex{
    node;
    weight;
    next;
	constructor(node,weight){
		this.node = node;
		this.weight = weight;
		this.next = null;
	}
}

class Graph{
    adjList: any[];
	constructor(v,vr){
		let len = v.length;
		let vexs = new Array(len);
		let v1=0,v2=0;
		let newvex = null;
		for (let i=0;i<len;i++){
			vexs[i] = new vex(v[i]);
		}
		for (let arc of vr){
			v1 = v.indexOf(arc[0]);
			v2 = v.indexOf(arc[1]);

			newvex = new adjvex(v2,arc[2]);
			newvex.next = vexs[v1].firstEdge;
			vexs[v1].firstEdge = newvex;
			vexs[v2].in++;
		}
		this.adjList = vexs;
	}
}

let a = new Graph(['v0','v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','v12','v13'],[['v0','v11',1],['v0','v4',1],['v0','v5',1],['v1','v4',1],['v1','v8',1],['v1','v2',1],['v2','v5',1],['v2','v6',1],['v3','v2',1],['v3','v13',1],['v4','v7',1],['v5','v8',1],['v5','v12',1],['v6','v5',1],['v8','v7',1],['v9','v11',1],['v9','v10',1],['v10','v13',1],['v12','v9',1]]);
console.log(a);

function topoSort(G){
	let stack = [];    //辅助栈
	for (let i=0;i<G.adjList.length;i++){   //寻找入度为0的顶点推入栈
		if (G.adjList[i].in === 0){
			stack.push(i);
		}
	}

	let currentVex = null;
	let count = 0;         //用于计数已经输出的顶点
	while(stack.length > 0){
		currentVex = G.adjList[stack.pop()];
		console.log(currentVex.data);      //输出栈顶顶点
		count++;
		currentVex = currentVex.firstEdge;
		while(currentVex){        //删除当前顶点，遍历其邻接顶点，使它们入度减1
			if ((--G.adjList[currentVex.node].in) === 0){  //当邻接顶点入度为0时
				stack.push(currentVex.node);    //将邻接顶点压入栈中
			}
			currentVex = currentVex.next;
		}
	}

	if (count < G.adjList.length){   //若输出的顶点数少于图中顶点数，则存在环
		console.log("存在环路");
		return false;
	}else{
		return true;
	}
}



 /**
  * 普里姆prime最小生成树
  * 
  */
let maxValue: number = Number.MAX_VALUE;
let matrix: number[][] = [
   [ maxValue, 6, 1, 5, maxValue, maxValue],
   [ 6, maxValue, 5, maxValue, 3, maxValue],
   [ 1, 5, maxValue, 5, 6, 4],
   [ 5, maxValue, 5, maxValue, maxValue, 2],
   [ maxValue, 3, 6, maxValue, maxValue, 6],
   [ maxValue, maxValue, 4, 2, 6, maxValue,]
];

function miniSpanTree_prime(index: number) {
    let k: number = index; // 起点
    let edges = [];
    let closedge = initClosedge(index);

    for (let i = 1; i < matrix.length; i++) { // 选择之后的matrix.length - 1 个顶点
        k = locate(closedge);
        edges.push({
            start: closedge[k].adjvex,
            end: k,
        })
        closedge[k].lowcost = 0; // 将顶点k加入最小生成树
        // 调整closedge
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[k][j] < closedge[j].lowcost) { // 比较新加入的点
                closedge[j].adjvex = k;
                closedge[j].lowcost = matrix[k][j];
            }
        }

    }
    return edges;

}

/**
 * 初始化closedge数组
 * closedge数组表示每个不是最小生成树中的顶点到最小生成树的最小权值
 * closedge[i](i可以理解发下标)是一个对象， 对象中有两对键值，分别是adjvex和lowcost
 * lowcost表示顶点i到最小生成树的最短边的权值，adjvex那个最短边的另一个顶点，这个顶点一定在最小树中生成
 * closedge数组会随着构成最小生成树的过程更新
 * @param index
 */
function initClosedge(index: number): {adjvex: number, lowcost: number}[] {
    let result: {adjvex: number, lowcost: number}[] = [];
    for (let i = 0; i < matrix.length; i++) {
        let temp: {adjvex: number, lowcost: number}; // = {adjvex: 0, lowcost: 0};
        if (i !== index) {
            temp = {adjvex: index, lowcost: matrix[index][i]};
        } else {
            temp = {
                adjvex: 0, lowcost: 0
            }
        }
        result.push(temp);
    }
    return result;
}

/**
 * closedge更新后需要获取closedge中lowcost最小的值
 * 然后根据这个值获取到下一个加入最小生成树的顶点
 * @param closedge
 */
function locate(closedge): number {
    let min: number = 0;
    let index: number = 0;
    for (let i = 0; i < matrix.length; i++) {
        if (closedge[i].lowcost !== 0) {
            min = closedge[i].lowcost;
            index  = i;
            break;
        }
    }

    for (let i = index + 1; i < closedge.length; i++) {
        if (closedge[i].lowcost !== 0 && closedge[i].lowcost < min) {
            min = closedge[i].lowcost;
            index = i;
        }
    }
    return index;
}

// function check() {
    // 验证
    for(let m = 0; m < matrix.length; m++){
        let result = miniSpanTree_prime(m);
        console.log(result);
    }
// }
// check();
