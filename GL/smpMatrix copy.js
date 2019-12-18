/*****************************程序信息********************************
  SimpleWebGL.Matrix.1.0       作者：次碳酸钴(admin@web-tinker.com)
  文档: http://www.web-tinker.com/files/SimpleWebGL.Matrix.1.0.html
**********************************************************************/

(function(){
    SimpleWebGL.namespace.Matrix=Matrix;
    function Matrix(e){
      if(typeof e=="number"){
        for(var i=0;i<e;i++)for(var j=0;j<e;j++)this.push(i==j?1:0);
        this.dimension=e;
      }else if(e instanceof Array)
        this.dimension=Math.sqrt(e.length)|0,this.equate(e);
    };Matrix.prototype={
      data:function(i,j,e){
        var l=this.dimension;(i=i%l)<0&&(i+=l),(j=j%l)<0&&(j+=l);
        if(e===undefined)return this[i*l+j];else return this[i*l+j]=e,this;
      },equate:function(e){
        for(var i=0;i<e.length;i++)this[i]=e[i];
        return this.length=e.length,this;
      },plus:function(e){
        if(typeof e=="number")
          for(var i=0;i<this.length;i++)this[i]+=e;
        else if(e.dimension==this.dimension)
          for(var i=0;i<this.length;i++)this[i]+=e[i];
        return this;
      },multiply:function(e,type){
        if(typeof e=="number")
          for(var i=0;i<this.length;i++)this[i]*=e;
        else if(e.dimension==this.dimension){
          var i,j,k,s,l=this.dimension,r=Array(l*l);
          if(type)for(i=0;i<l;i++)for(j=0;s=0,j<l;r[i*l+j]=s,j++)
            for(k=0;k<l;k++)s+=this[k*l+j]*e[i*l+k];
          else for(i=0;i<l;i++)for(j=0;s=0,j<l;r[i*l+j]=s,j++)
            for(k=0;k<l;k++)s+=e[k*l+j]*this[i*l+k];
          this.equate(r);
        };return this;
      },determinant:function(){
        var i,j,s,o,l;
        switch(l=this.dimension){
          case 1:return this[0];
          case 2:return this[0]*this[3]-this[1]*this[2];
          case 3:return (
            this[0]*this[4]*this[8]-this[0]*this[5]*this[7]+
            this[1]*this[5]*this[6]-this[1]*this[3]*this[8]+
            this[2]*this[3]*this[7]-this[2]*this[4]*this[6]
          );default:
            for(i=s=0;i<l;s+=new Matrix(o).determinant()*this[i]*(i%2?-1:1),i++)
              for(j=l,o=[];j<this.length;j++)if(j%l!=i)o.push(this[j]);
            return s;
        };
      },inverse:function(){
        var i,j,s,m,n,o,l=this.dimension,r=[],b=l%2==0;
        if(!(s=this.determinant()))return console.error("该矩阵不可逆");
        for(i=0;i<l;i++)for(j=0;o=[],j<l;r[i+j*l]=(b&&(i+j)%2?-1:1)*new Matrix(o).determinant(),j++)
          for(m=0;m<l-1;m++)for(n=0;n<l-1;n++)o.push(this[((i+m+1)%l)*l+(j+n+1)%l]);
        return this.equate(r).multiply(1/s);
      },yaw:function(s,c){
        if(!s)return this;else if(c==null)s=Math.PI*s/180,c=Math.cos(s),s=Math.sin(s);
        return this.multiply(new Matrix(this.dimension).data(2,2,c).data(2,0,s).data(0,2,-s).data(0,0,c));
      },pitch:function(s,c){
        if(!s)return this;else if(c==null)s=Math.PI*s/180,c=Math.cos(s),s=Math.sin(s);
        return this.multiply(new Matrix(this.dimension).data(1,1,c).data(1,2,s).data(2,1,-s).data(2,2,c));
      },roll:function(s,c){
        if(!s)return this;else if(c==null)s=Math.PI*s/180,c=Math.cos(s),s=Math.sin(s);
        return this.multiply(new Matrix(this.dimension).data(0,0,c).data(0,1,s).data(1,0,-s).data(1,1,c));
      },move:function(e){
        var e=e instanceof Array?e:Array.prototype.slice.call(arguments,0);
        return this.multiply(new Matrix(this.dimension).moveTo(e));
      },moveTo:function(e){
        var d=this.dimension,e=e instanceof Array?e:Array.prototype.slice.call(arguments,0),l=e.length;
        return Array.prototype.splice.apply(this,[d*(d-1),l].concat(e)),this;
      },toString:function(){
        var i=this.length,l=this.dimension,s=[];
        while(i--)s.unshift(this[i],(i+1)%l?"\t":"\n");
        return s.join("");
      },__proto__:Array.prototype
    },Matrix.__proto__={
      projection:function(a,p,n,f){
        var a=1/Math.tan(a*Math.PI/360),l=f-n;
        return new Matrix([a/p,0,0,0, 0,a,0,0, 0,0,-(f+n)/l,-1, 0,0,-2*f*n/l,0 ]);
      },view:function(p,yaw,pitch,roll){
        return new Matrix(4).moveTo(-p[0],-p[1],-p[2]).yaw(-yaw).pitch(-pitch).roll(-roll);
      },model:function(p,yaw,pitch,roll){
        return new Matrix(4).yaw(yaw).pitch(pitch).roll(roll).moveTo(p);
      }
    };
  })();