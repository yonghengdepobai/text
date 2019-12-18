/*************************程序信息********************************
  SimpleWebGL.2.0           作者：次碳酸钴(admin@web-tinker.com)
  接口文档：http://www.web-tinker.com/files/SimpleWebGL.2.0.html
*****************************************************************/

(function(){
    var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame; //
    SimpleWebGL=function(canvas,config){
      var webgl=this._=canvas.getContext("experimental-webgl",config); // 获取webgl止
      this.setting=function(map,value){
        if(value!==undefined)arguments[2]={},arguments[2][map]=value,map=arguments[2];
        for(var i in map){
          webgl[map[i]===null?"disable":"enable"](webgl[i]);
          if(!(map[i] instanceof Array))map[i]=[map[i]];
          for(var j=0;j<map[i].length;j++)map[i][j]=webgl[map[i][j]];
          webgl[{DEPTH_TEST:"depthFunc",BLEND:"blendFunc"}[i]].apply(webgl,map[i]);
        };return this;
      },this.clear=function(){
        for(var v=0,n,i=0;n=arguments[i];i++)v|=webgl[n+"_BUFFER_BIT"]
        return v&&webgl.clear(v),this;
      },this.color=function(e){
        return webgl.clearColor.apply(webgl,e instanceof Array?e:arguments),this;
      },this.unbindArrayBuffer=function(){
        return webgl.bindBuffer(webgl.ARRAY_BUFFER,null),this;
      },this.unbindElementBuffer=function(){
        return webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER,null),this;
      },this.unbindTexture2D=function(i){
        webgl.activeTexture(webgl["TEXTURE"+i]);
        return webgl.bindTexture(webgl.TEXTURE_2D,null),this;
      },this.unbindRenderbuffer=function(){
        return webgl.bindRenderbuffer(webgl.RENDERBUFFER,null),this;
      },this.unbindFramebuffer=function(){
        return webgl.bindFramebuffer(webgl.FRAMEBUFFER,null),this;
      },this.namespace=function(callback){
        var s=[],i,e=(callback+"").match(/\(([\s\S]*?)\)/)[1].split(/,/g);
        for(i=0;i<e.length;i++)s.push(this.namespace[e[i].replace(/\W+/g,"")]);
        return callback.apply(this,s),this;
      },this.namespace.Shader=function(type){
        this.init=function(source){
          this._=webgl.createShader(webgl[type]);
          return source?this.compile(source):this;
        },this.source=function(source){
          if(!source)return webgl.getShaderSource(this._);
          return webgl.shaderSource(this._,source.textContent||source),this;
        },this.compile=function(source){
          webgl.compileShader((source?this.source(source):this)._);
          if(!webgl.getShaderParameter(this._,webgl.COMPILE_STATUS))
            console.log(webgl.getShaderInfoLog(this._));
          return this;
        },this.attachTo=function(e){
          return e.attach(this),this;
        },this.free=function(){
          this._=webgl.deleteShader(this._);
        };
      },this.namespace.VertexShader=function(source){
        this.init(source);
      },this.namespace.FragmentShader=function(source){
        this.init(source);
      },this.namespace.Buffer=function(type){
        this.init=function(data){
          this._=webgl.createBuffer();
          return data?this.data(data):this;
        },this.bind=function(){
          return webgl.bindBuffer(webgl[type],this._),this;
        },this.unbind=function(){
          return this.isBinding()&&webgl.bindBuffer(webgl[type],null),this;
        },this.isBinding=function(){
          return webgl.getParameter(webgl[type+"_BINDING"])==this._;
        },this.data=function(e){
          if(!e)return this._data;
          this.bind(),this._data=e,e=new (type=="ARRAY_BUFFER"?Float32Array:Uint16Array)(e);
          return webgl.bufferData(webgl[type],e,webgl.STATIC_DRAW),this;
        },this.free=function(){
          this._=webgl.deleteBuffer(this._);
        };
      },this.namespace.ArrayBuffer=function(data){
        this.init(data);
      },this.namespace.ElementBuffer=function(data){
        this.init(data);
      },this.namespace.Program=function(){
        var vertexShader,fragmentShader,interface={};
        this._=webgl.createProgram();
        this.attach=function(){
          for(var i=0,o;o=arguments[i];i++)
            if(webgl.attachShader(this._,o._)||!webgl.getError())
              o instanceof VertexShader && (vertexShader=o),
              o instanceof FragmentShader && (fragmentShader=o);
          return this;
        },this.detach=function(){
          for(var i=0,o;o=arguments[i];i++)
            if(webgl.detachShader(this._,o._)||!webgl.getError())
              o instanceof VertexShader && (vertexShader=null),
              o instanceof FragmentShader && (fragmentShader=null);
          return this;
        },this.link=function(){
          var program=this._,source,regexp;
          if(webgl.linkProgram(program)||!webgl.getProgramParameter(program,webgl.LINK_STATUS))
            return console.log(webgl.getProgramInfoLog(program)),this;
          regexp=/\b(attribute|uniform)\b[^;]+?(\w+)\s+(\w+)\s*;/g;
          source=vertexShader.source()+fragmentShader.source();
          return source.replace(regexp,function($0,$1,$2,$3){
            var location,type,size=$2.match(/\d+$|$/g,"")[0]|0||1;
            if($1=="attribute"){
              location=webgl.getAttribLocation(program,$3);
              if(location<0)return;
              webgl.enableVertexAttribArray(location),
              interface[$3]=function(e){e.bind(),webgl.vertexAttribPointer(location,size,webgl.FLOAT,false,0,0);};
            }else{
              location=webgl.getUniformLocation(program,$3);
              if(!location)return;
              type=/int|sampler/.test($2)?"i":"f",
              interface[$3]=/^mat/.test($2)?function(e){webgl["uniformMatrix"+size+"fv"](location,false,new Float32Array(e));}
              :function(e){webgl["uniform"+size+type+"v"](location,e instanceof Array?e:Array.prototype.slice.call(arguments,0));}
            };
          }),this;
        },this.use=function(){
          return webgl.useProgram(this._),this;
        },this.data=function(map,value){
          if(value!==undefined)arguments[2]={},arguments[2][map]=value,map=arguments[2];
          for(var i in map)if(i in interface)interface[i](map[i]);
          return this;
        },this.draw=function(object,type){
          type=webgl[type||"TRIANGLES"];
          return object._?webgl.drawElements(
            type,object.bind().data().length,webgl.UNSIGNED_SHORT,0
          ):webgl.drawArrays(type,0,object),this;
        },this.free=function(){
          this._=webgl.deleteProgram(this._);
        };
        if(arguments.length)this.attach.apply(this,arguments);
      },this.namespace.Texture2D=function(data,color,width,height){
        this._=webgl.createTexture(),this._i=19;
        this.bind=function(i){
          webgl.activeTexture(webgl["TEXTURE"+(this._i=i)]);
          webgl.bindTexture(webgl.TEXTURE_2D,this._);
          return this;
        },this.unbind=function(){
          return this.isBinding()&&webgl.bindTexture(webgl.TEXTURE_2D,null),this;
        },this.isBinding=function(){
          return webgl.activeTexture(this._i),this._==webgl.getParameter(webgl.TEXTURE_BINDING_2D);
        },this.data=function(object,color,width,height){
          this.bind(this._i),color=webgl[color];
          return webgl.texImage2D.apply(webgl,
            object instanceof HTMLElement?[webgl.TEXTURE_2D,0,color,color,webgl.UNSIGNED_BYTE,object]
            :[webgl.TEXTURE_2D,0,color,width,height,0,color,webgl.UNSIGNED_BYTE,object?new Uint8Array(object):null]
          ),this;
        },this.setting=function(map,value){
          this.bind(this._i);
          if(value!==undefined)arguments[2]={},arguments[2][map]=value,map=arguments[2];
          for(var i in map)webgl.texParameteri(webgl.TEXTURE_2D,webgl[i],webgl[map[i]]);
          return this;
        },this.generate=function(){
          return this.bind(this._i),webgl.generateMipmap(webgl.TEXTURE_2D),this;
        },this.readPixels=function(x,y,width,height){
          var width=width||1,height=height||1,r=new Uint8Array(width*height*4);this.bind(this._i);
          return webgl.readPixels(x,y,width,height,webgl.RGBA,webgl.UNSIGNED_BYTE,r),r;
        },this.free=function(){
          this._=webgl.deleteTexture(this._);
        };
        if(arguments.length)this.data.apply(this,arguments).setting({
          TEXTURE_MIN_FILTER:"LINEAR",TEXTURE_MAG_FILTER:"LINEAR"
        });
      },this.namespace.Renderbuffer=function(){
        this._=webgl.createRenderbuffer();
        this.bind=function(){
          return webgl.bindRenderbuffer(webgl.RENDERBUFFER,this._),this;
        },this.unbind=function(){
          return this.isBingding()&&webgl.bindRenderbuffer(webgl.RENDERBUFFER,null),this;
        },this.isBinding=function(){
          return webgl.getParameter(webgl.RENDERBUFFER_BINDING)==this._;
        },this.setting=function(type,width,height){
          return this.bind(),webgl.renderbufferStorage(webgl.RENDERBUFFER,webgl[type],width,height),this;
        },this.free=function(){
          this._=webgl.deleteRenderbuffer(this._);
        };
        if(arguments.length)this.setting.apply(this,arguments);
      },this.namespace.Framebuffer=function(){
        this._=webgl.createFramebuffer();
        this.bind=function(){
          return webgl.bindFramebuffer(webgl.FRAMEBUFFER,this._),this;
        },this.unbind=function(){
          return this.isBinding()&&webgl.bindFramebuffer(webgl.FRAMEBUFFER,null),this;
        },this.isBinding=function(){
          return webgl.getParameter(webgl.FRAMEBUFFER_BINDING)==this._;
        },this.attach=function(){
          this.bind();
          for(var i=0,o;o=arguments[i];i++)
            o instanceof Texture2D && webgl.framebufferTexture2D(webgl.FRAMEBUFFER,webgl.COLOR_ATTACHMENT0,webgl.TEXTURE_2D,o._,0),
            o instanceof Renderbuffer && webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER,webgl.DEPTH_ATTACHMENT,webgl.RENDERBUFFER,o._);
          return this;
        },this.free=function(){
          this._=webgl.deleteFramebuffer(this._);
        };
        if(arguments.length)this.attach.apply(this,arguments);
      },this.namespace.__proto__=SimpleWebGL.namespace;
      this.EXTRACT=(function(){
        var i,s=this.namespace,o=[];
        for(i in s)o.push(i+"=this.namespace[\""+i+"\"]");
        return "var "+o.join(",")+";";
      }).call(this);
      eval(this.EXTRACT);
      VertexShader.prototype=new Shader("VERTEX_SHADER");
      FragmentShader.prototype=new Shader("FRAGMENT_SHADER");
      ArrayBuffer.prototype=new Buffer("ARRAY_BUFFER");
      ElementBuffer.prototype=new Buffer("ELEMENT_ARRAY_BUFFER");
    };
    SimpleWebGL.prototype={
      play:function(callback){
        var time=0,func=function(){
          callback.call(func.obj,time++),func.obj.isRunning&&requestAnimationFrame(func);
        };return func.obj=this,this.isRunning=true,setTimeout(func,0),this;
      },stop:function(){
        return this.isRunning=false,this;
      },isRunning:false
    },SimpleWebGL.namespace={};
  })();