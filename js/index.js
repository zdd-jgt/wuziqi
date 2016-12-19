$(function(){
    var canvas=$("#canvas").get(0),
        ctx=canvas.getContext("2d"),
        shizhong=$("#canvas_shizhong").get(0),
        ctx1=shizhong.getContext("2d"),
        audio=$("#audio").get(0),
        audio1=$("#audio1").get(0),
        gameState="puse",
        kaiguan=true,
        AI=false,
        panduan={},
        kongbai={},
        spe=40,
        sr=4,
        br=18,
        i=0,
        a=0,
        b=0,
        t;
    
    function l(x){
        return (x+0.5)*spe+0.5;
    }
    //棋盘
    function pan(){
        ctx.save();
        ctx.beginPath();
        for(var i=0;i<15;i++){
            ctx.moveTo(l(0),l(i));
            ctx.lineTo(l(14),l(i));
            ctx.moveTo(l(i),l(0));
            ctx.lineTo(l(i),l(14)) 
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                kongbai[m(i,j)]=true;
            }
        }
    }
    
    //棋盘的点
    function circle(x,y){
        ctx.save();
        ctx.translate(l(x),l(y));
        ctx.beginPath();
        ctx.arc(0,0,sr,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    
    //落子
    function luozi(x,y,color){
        ctx.save();
        ctx.translate(l(x),l(y));
        ctx.beginPath();
        if(color=="black"){
            var g=ctx.createRadialGradient(-5,-6,4,0,0,18);
            g.addColorStop(0.1,"#eee");
            g.addColorStop(0.4,"black");
            g.addColorStop(1,"black");
            ctx.fillStyle=g;
        }else{
            var g=ctx.createRadialGradient(-5,-8,3,0,0,18);
            g.addColorStop(0.1,"#fff");
            g.addColorStop(0.4,"#eee");
            g.addColorStop(1,"#eee");
            ctx.fillStyle=g;
        }
        ctx.arc(0,0,br,0,Math.PI*2);
        ctx.fill()
        ctx.closePath();
        ctx.restore(); 
        panduan[x+"_"+y]=color;
        gameState="play";
        delete kongbai[m(x,y)];
        audio1.play();
    }
    
    //钟表
    function zhong(){
        ctx1.save();
        ctx1.translate(100,130)
        ctx1.rotate(Math.PI/180 *6*i);
        ctx1.beginPath();
        ctx1.arc(0,0,4,0,Math.PI*2)
        ctx1.moveTo(0,-4)
        ctx1.lineTo(0,-64)
        ctx1.moveTo(0,4)
        ctx1.lineTo(0,20)
//      ctx.strokeStyle="yellow";
        ctx1.stroke();
        ctx1.closePath();
        
        ctx1.restore();
        if(i==60){
            audio1.pause();
            return ;
            
        }
        i+=1;
    }
    function render(){
        ctx1.clearRect(0,0,200,200);
        zhong();
    }
      
    //添加点击事件给画布
    function dianji(){
        $(canvas).on("click",false,function(e){
            audio.play();
            var x=Math.floor(e.offsetX/spe);
            var y=Math.floor(e.offsetY/spe);
            if(panduan[x+"_"+y]){
                return;
            }
    //      var t= setInterval(render,500)
             if(panduan[x+"_"+y]=="black"){
                if(panduan[x+"_"+y]){
                    return;
                }
                clearInterval(t);
                t= setInterval(render,200);
            }else if(panduan[x+"_"+y]=="#fff"){
                if(panduan[x+"_"+y]){
                    return;
                }
               clearInterval(t);
               t= setInterval(render,200);
            }
            i=0;
            //人机
            if(AI){
                luozi(x,y,"black");
                a+=1;
                $(".shijian").html(a);
                if(shuying(x,y,"black")>=5){
                    $(".zhi").html("黑棋获胜")
                    $(canvas).off("click");
                    $(".zhezhao_L").addClass("zL_active");
                    $(".zhezhao_R").addClass("zR_active");
                    $(".zhi").addClass("zhi_active");
                    audio1.pause();
                    clearInterval(t);
                    i=0;
                }
                var p=intel();
                luozi(p.x,p.y,"#fff");
                b+=1;
                $(".shijian1").html(b);
                if(shuying(p.x,p.y,"#fff")>=5){
                    $(".zhi").html("白棋获胜");
                    $(canvas).off("click");
                    $(".zhezhao_L").addClass("zL_active");
                    $(".zhezhao_R").addClass("zR_active");
                    $(".zhi").addClass("zhi_active");
                    audio1.pause();
                    clearInterval(t)
                    i=0;
                }
                return false;
            }
           
            //人人
            if(kaiguan){
                luozi(x,y,'black');
                if(shuying(x,y,"black")>=5){
                    $(".zhi").html("黑棋获胜")
                    $(canvas).off("click");
                    $(".zhezhao_L").addClass("zL_active");
                    $(".zhezhao_R").addClass("zR_active");
                    $(".zhi").addClass("zhi_active");
                    audio1.pause();
                    clearInterval(t);
                    i=0;
                }
                a+=1;
                $(".shijian").html(a)
            }else{
                luozi(x,y,'#fff');
                b+=1;
                $(".shijian1").html(b)
                if(shuying(x,y,"#fff")>=5){
                    $(".zhi").html("白棋获胜");
                    $(canvas).off("click");
                    $(".zhezhao_L").addClass("zL_active");
                    $(".zhezhao_R").addClass("zR_active");
                    $(".zhi").addClass("zhi_active");
                    audio1.pause();
                    clearInterval(t)
                    i=0;
                }
            }
            kaiguan=!kaiguan;
        })
    }
    //  再来一次
    function next(){
        ctx.clearRect(0,0,600,600);
        pan();
        circle(3,3);
        circle(11,3);
        circle(7,7);
        circle(3,11);
        circle(11,11);
        a=0;
        b=0;
        $(".shijian1").html(0)
        $(".shijian").html(0)
        ctx1.clearRect(0,0,200,200)
        i=0;
        zhong();
        clearInterval(t);
         $(".kaishi").addClass("qi");
//      panduan清空对象里的数据
        panduan={};
        $(canvas).off("click");
        $(".zhezhao_L").removeClass("zL_active");
        $(".zhezhao_R").removeClass("zR_active");
        $(".zhi").removeClass("zhi_active");
        gameState="puse";
    }
     //人机
     function intel(){
         var max=-Infinity;
         var pos={};
         for(var k in kongbai){
             var x=parseInt(k.split("_")[0]);
             var y=parseInt(k.split("_")[1]);
             var m=shuying(x,y,"black")
             if(m>max){
                 max=m;
                 pos={x:x,y:y};
             }
         }
         var max2=-Infinity;
         var pos2={};
         for(var k in kongbai){
             var x=parseInt(k.split("_")[0]);
             var y=parseInt(k.split("_")[1]);
             var m=shuying(x,y,"#fff")
             if(m>max2){
                 max2=m;
                 pos2={x:x,y:y};
             }
         }
         if(max>max2){
             return pos;
         }else{
             return pos2;
         }
     }
    //判断输赢
    function m(c,d){
        return c+'_'+d;
    };
    function shuying(x,y,color){
        var i;
        var zy= 1;
        i=1;while(panduan[m(x+i,y)]==color){zy++; i++;};
        i=1;while(panduan[m(x-i,y)]==color){zy++; i++;};
        var sx=1;
        i=1;while(panduan[m(x,y+i)]==color){sx++; i++;};
        i=1;while(panduan[m(x,y-i)]==color){sx++; i++;};
        var zxy=1;
        i=1;while(panduan[m(x-i,y-i)]==color){zxy++; i++;};
        i=1;while(panduan[m(x+i,y+i)]==color){zxy++; i++;};
        var yxy=1;
        i=1;while(panduan[m(x+i,y-i)]==color){yxy++; i++;};
        i=1;while(panduan[m(x-i,y+i)]==color){yxy++; i++;};
        return Math.max(zy,sx,zxy,yxy);
    };
    //做棋谱   
     qipu=function(){
        var i=1;
        ctx.save()
        ctx.font ="20px/1 微軟雅黑";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        
        for(var k in panduan){
            var arr=k.split("_");
            if(panduan[k]==="#fff"){
                ctx.fillStyle="black";
            }else{
                ctx.fillStyle="white";
            }
            ctx.fillText(i++,l(parseInt(arr[0])),l(parseInt(arr[1])));
        }
        ctx.restore();
        
        if($(".zhezhaoda").find('img').length){
            $(".zhezhaoda").find('img').attr("src",canvas.toDataURL());
        }else{
            $("<img>").attr("src",canvas.toDataURL()).appendTo(".zhezhaoda");
        }
        if($(".zhezhaoda").find('a').length){
            $('a').attr('href',canvas.toDataURL()).attr("download","qipu.png");
            
        }else{
            $('a').attr('href',canvas.toDataURL()).attr("download","qipu.png");
        }    
    };
    
    pan();
    circle(3,3);
    circle(11,3);
    circle(7,7);
    circle(3,11);
    circle(11,11);
    render()
    dianji();
    
    //出现棋盘
    $(".kaishi").on("click",function(){
//      $("#canvas").css({"width":600,"height":600});
        $("#canvas").addClass("can");
        kaiguan=true;
        dianji();
        $(".kaishi").toggleClass('qi');
         if($(".kaishi").hasClass('qi')){
            return;
        }else{
            t= setInterval(render,200);
        }
        $("img").remove();
        audio1.play();
        $(".zhi").removeClass("zhi_active");
        gameState="play";
    })
    
//  关掉棋盘
    $(".jieshu").on("click",function(){
//      $("#canvas").css({"width":0,"height":0});
        $("#canvas").removeClass("can");
        ctx1.clearRect(0,0,200,200)
        i=0;
        zhong();
        clearInterval(t);
        $(".kaishi").addClass("qi");
        $(".zhongjian").removeClass("da");
        $(".zhezhao_L").removeClass("zL_active");
        $(".zhezhao_R").removeClass("zR_active");
        $(".kaishiyouxi").css({"opacity":1,"z-index":100});
        $("img").remove();
        $(".zhi").removeClass("zhi_active");
        $(".biaoti").removeClass("biaoti_active");
        $(".biaoti1").removeClass("biaoti1_active");
        $(".log").removeClass("log-active");
        $(".right_top").removeClass("right_top-active");
        $(".kaishi").removeClass("anniu_active");
        $(".jieshu").removeClass("anniu_active");
        $(".heizi").removeClass("anniu_active");
        $(".baizi").removeClass("anniu_active");
        $(".shijian").removeClass("anniu_active");
        $(".shijian1").removeClass("anniu_active");
        $(".next").removeClass("anniu_active");
        $(".moshi").removeClass("anniu_active");
        $(".chakanqipu").removeClass("anniu_active");
        $(".moshi").html("人-人");
        audio1.pause();
    })
//  模式
    $(".moshi").on("click",function(){
        if($(".moshi").text()=="人-机"){
            AI=false;
            if(gameState=="play"){
                $(".moshi").off('click');
                return;
            }
            $(".moshi").html("人-人");
        }else if($(".moshi").text()=="人-人"){
            AI=true;
            if(gameState=="play"){
                $(".moshi").off('click');
                return;
            }
            $(".moshi").html("人-机");
        }
    });
//再來一次
    $(".next").on("click",function(){
        next();
        $("img").remove();
        $(".zhi").removeClass("zhi_active");
        audio1.pause();
    })
   
    //开始游戏
    $(".kaishiyouxi").on("click",function(){
        $(".zhongjian").addClass("da");
        $(".kaishiyouxi").css({"opacity":0,"z-index":-1});
        $(".biaoti").addClass("biaoti_active");
        $(".biaoti1").addClass("biaoti1_active");
        $(".log").addClass("log-active");
        $(".right_top").addClass("right_top-active");
        $(".kaishi").addClass("anniu_active");
        $(".jieshu").addClass("anniu_active");
        $(".heizi").addClass("anniu_active");
        $(".baizi").addClass("anniu_active");
        $(".shijian").addClass("anniu_active");
        $(".shijian1").addClass("anniu_active");
        $(".next").addClass("anniu_active");
        $(".moshi").addClass("anniu_active");
        $(".chakanqipu").addClass("anniu_active");
        
        
        
        next();
    })
    //查看棋譜
    $(".chakanqipu").on("click",function(){
        qipu()
        $(".zhezhaoda").addClass("zhezhaoda_active");
        for(var k in panduan){
            var x=parseInt(k.split('_')[0]);
            var y=parseInt(k.split('_')[1]);
            luozi(x,y,panduan[k]);
        }
    })
    //關閉棋譜
    $(".guanbi").on('click',function(){
        $(".zhezhaoda").removeClass("zhezhaoda_active");
    })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});
