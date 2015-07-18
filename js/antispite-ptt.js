// ==UserScript==
// @id             antispike@tonyq
// @name           Anti-Spike Plugin
// @version        0.0.1
// @namespace      http://antispike.tonyq.org/antispike.user.js
// @updateURL      http://antispike.tonyq.org/antispike.user.js
// @downloadURL    http://antispike.tonyq.org/antispike.user.js
// @description    Antispike extension
// @match          https://www.facebook.com/plugins/comments.php*
// @match          http://www.facebook.com/plugins/comments.php*
// ==/UserScript==


function wrapper() {
  (function(){
    //https://github.com/blueimp/JavaScript-MD5/blob/master/js/md5.min.js
    !function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);

    var worked = true;
    var report = null;
    var current_push = null;
    var current_push_data = null;

    // var SERVER = "http://antispite.tonyq.org/";
    var SERVER = "http://localhost:3000/";    
    //===============helpers start ====================
    var each = function(ary,cb){
      for(var i = 0; i < ary.length;++i){
        if(cb){ 
          var r = cb(ary[i],i);
          if(r === false){
            break;
          }
        }
      }
    };
    function offset(obj) {
      var ol = ot = 0;
      if (obj.offsetParent) {
        do {
          ol += obj.offsetLeft;
          ot += obj.offsetTop;
        } while (obj = obj.offsetParent);
      }
      return {
        left: ol,
        top: ot
      };
    }

    var cut = function(str,start,end){
      if(str == null ){
        return null;
      }
      var ind = str.indexOf(start);
      if(ind == -1){
        return null;
      }

      var endInd = str.indexOf(end,ind+1);
      if(endInd == -1){
        return str.substring(ind+start.length);  
      }
      return str.substring(ind+start.length,endInd);

    };
    var $$ = function(){
        return document.querySelectorAll.apply(document,arguments);
    };
    var _ajax = function(url,valueObj,method,cb_ok,cb_err){
      if(url&&valueObj&&method){
        var request = new XMLHttpRequest();

        if(method=='POST'){

          var requestValue="";
          var length=0;

          for (var i in valueObj)
          {
              if(requestValue!="") requestValue+="&";

              requestValue+=i+"="+escape(valueObj[i]);
              length+= parseInt(escape(valueObj[i]).length);

          }

          request.open("POST", url, true);
          request.setRequestHeader("content-length",length);
          request.setRequestHeader("Content-Type",
                      "application/x-www-form-urlencoded");
          request.onreadystatechange = function(){
              callBackFunction(request,cb_ok,cb_err);
          };

          request.send(requestValue);

        }else{  // "GET" Mode
          var requestValue="";

          for (var i in valueObj)
          {
              if(requestValue!="") requestValue+="&";
              requestValue+=i+"="+escape(valueObj[i]);
          }

          if(requestValue.length>256){
              alert('長度超過Get上限,無法送出!');
              return false;
          }
          request.open("GET", url+"?"+requestValue, true);

          request.onreadystatechange = function(){
              if (request.readyState == 4) {
                 if (request.status == 200) {
                      cb_ok && cb_ok(request.responseText);
                  } else{
                      cb_err && cb_err(request.responseText);
                  }
              }
          };

          request.send(null);

        }

      }else{
        alert('<url>,<valueObj>,<method>,<cbfunction>');
      }

    };
    var ajax = function(url,valueObj,method,cb_ok,cb_err) {
      chrome.runtime.sendMessage({
        method: method,
        action: "xhttp",
        data: valueObj,
        url:url
      }, cb_ok);
       
    };
    var doPost = function(url,valueObj,cb_ok,cb_err){
        return ajax(url,valueObj,"POST",cb_ok,cb_err);
    };
    var doGet = function(url,valueObj,cb_ok,cb_err){
        return ajax(url,valueObj,"GET",cb_ok,cb_err);
    };

    var getRid = function(dom){
      return dom.getAttribute("data-reactid") ;
    };

    var lchild = function(){
      var dom = arguments[0];
      var d = dom;
      for(var i=1;i<arguments.length && d;++i){
        d = d.childNodes[arguments[i]];
      }
      return d;
    };
    var lparent = function(post,level){
      var dom = post;
      var d = dom;
      for(var i= 0 ;i < level && d;++i){
        d = d.parentNode;
      }
      return d;
    }

    window.IMPL = {
      users:{},
      getUrl:function(){
        var url = self.location.href.toString();
        return url;
      },
      error:function(){
        worked = false;
        throw "unkown page of antispite,project stoped.";
      },
      getPostID:function(){
        var url = self.location.href.toString();
        var key = cut(url,"M.",".html");
        return key;
      },
      getUserMap:function(){
        var posts = IMPL.getPosts();
        var result = {};
        each(posts,function(p,ind){
          var data = IMPL.findFBUserKey(p);
          if(!result[data]){
            result[data] = [];
          }
          result[data].push(p);
        });
        return result;
      },
      _analyticsPost:function(url,check){
        //get_id
        var key = IMPL.getPostID();
        if(!key){
          IMPL.error();
        }

        var metas = document.querySelectorAll(".article-metaline,.article-metaline-right");

        var metaprop = {};
        each(metas,function(meta){
          try{
            var key = meta.querySelector(".article-meta-tag").textContent;
            var value =  meta.querySelector(".article-meta-value").textContent;
            metaprop[key] = value;
          }catch(ex){
            console.log(ex);
          }
        });

        var author = metaprop["作者"];
        var tokens = null, username = null, userid = null;

        if(author){
          tokens = author.split(/[\(]/g)
          username = tokens[1].substring(0,tokens[1].length-1).trim();
          userid = tokens[0].trim();
        }

        var board = metaprop["看板"];

        var actions = document.querySelectorAll(".push");

        var push_count = 0;
        var dislike_count = 0;
        var comment_count = 0;


        var time = new Date(metaprop["時間"]+" GMT+800");

        var last_time = time;
        var pushs = [];
        each(actions,function(push){

          var pushtag = push.querySelector(".push-tag");
          var word = pushtag.textContent.trim();
          var push_type = 0;

          if(word == "→"){
            comment_count++;
            push_type = 3;
          }else if(word == "推"){
            push_count++;
            push_type = 1;
          }else if(word == "噓"){
            dislike_count++;
            push_type = 2;
          }

          var push_time = push.querySelector(".push-ipdatetime").textContent;

          var nowtime = new Date(last_time.getFullYear() +"/"+push_time);
          if(nowtime < last_time){
            nowtime.setFullYear(nowtime.getFullYear()+1);
          }
          last_time = nowtime;

          var userdom = push.querySelector(".push-userid");

          var obj = {
            push_type:push_type,
            push_word:word,
            userid:userdom.textContent,
            content:push.querySelector(".push-content").textContent,
            raw_time:push_time,
            time:nowtime.getTime()
          };

          obj.key = md5(obj.push_type + obj.push_word
            + obj.userid + obj.content + obj.raw_time);

          userdom.classList.add("user-"+obj.userid);
          push.classList.add("push-"+obj.key);

          push.onmouseenter = function(){
            
            current_push = this;
            current_push_data = obj;

            report.style.top = offset(this).top+"px";

            if(!this.classList.contains("push-bad")){
              report.style.display = "block";
            }else{
              report.style.display = "none";
            }
            
            this.style.borderBottom = "1px solid red";
            report.innerHTML = "回報跳針";
          };
          push.onmouseout = function(){
            current_push = this;
            current_push_data = obj;
            this.style.borderBottom = "0";
          };
          pushs.push(obj);
        });

        var count = {
          actions:actions.length,
          comment:comment_count,
          push:push_count,
          dislike:dislike_count
        };

        var content = document.querySelectorAll("#main-content")[0].textContent;
        //livetimestamp

        var obj = {
          type:"Ptt",
          checksum:md5(content),
          metas:metaprop,
          board:board,          
          name:username,
          userkey:userid,
          content:content,
          time:time.getTime(),
          key:key,
          url:url,
          check:check ? "true" : null,
          count:count,
          pushs:pushs,
          version:"v1"
        };
        return obj;
      },
      analyticsPost:function(url,check,callback){
        callback && callback(IMPL._analyticsPost(url,check));
      },
      handledBadUsers:function(bad_users){
        if(!bad_users.length){
          return true;
        }
        var userDomMap = IMPL.getUserMap();        
        bad_users.forEach(function(user){

          if(user.count < 5){ //小於五筆的略過不顯示
            return true;
          }

          each(userDomMap[user.user],function(post){
            var ele = post;
            var titles = ele.querySelector(".UFICommentActorName").parentNode;

            if(titles.querySelector(".anti-title") == null){
              var anti_link = document.createElement("a");
              anti_link.style.color='red';
              anti_link.target="_blank";
              anti_link.classList.add("anti-title");
              anti_link.innerHTML = " 使用者跳針指數("+user.count+")";
              anti_link.href = SERVER + "comment/user/?key="+encodeURIComponent(user.user);
              titles.appendChild(anti_link);
            }else{
              titles.querySelector(".anti-title").innerHTML = " 使用者跳針指數("+user.count+")";
            }

          });
        }); 
      }
    };


    var users = {};
    //===============helpers end ====================

    var handleFBComment = function(){
      if(!worked){
        return true;
      }
      //open all implement - start      

      //open all implement - end


      var url = IMPL.getUrl();

      var post = IMPL._analyticsPost(url,true);
      //apply options

      doPost(SERVER+"comment/ptt_check",{
        post:post
      },function(res){
        res = JSON.parse(res);
        if(res.isSuccess){
          if(res.data.pushs){
            res.data.pushs.forEach(function(p){
              var content = document.querySelectorAll(".push-"+p.key+" .push-content");
              var tag = document.querySelectorAll(".push-"+p.key+" .push-tag");
              tag[0].innerHTML = "(跳針) "+tag[0].innerHTML;
              tag[0].style.color = "gray";
              content[0].style.color = "gray";

              document.querySelector(".push-"+p.key).classList.add("push-bad");
              document.querySelector(".push-"+p.key+" .push-userid").style.color = "gray";
            });
          }
          if(res.data.users){
            res.data.users.forEach(function(u){
              var users = document.querySelectorAll(".user-"+u.user);
              each(users,function(udom){
                udom.style.color="red";
                udom.innerHTML += ("("+ u.count+ ")");
              });
            });
          }
        }
      });

      report = document.createElement("a");
      report.innerHTML = "回報跳針";
      report.style.color='white';
      report.style.position="absolute";
      report.style.top = "20%";
      report.style.display = "none";
      // report.style.right = "20px";

      var ref = document.querySelectorAll(".push-ipdatetime");
      if(ref.length){
        report.style.left = (offset(ref[0]).left+50) + "px";
      }

      report.style.padding = "5px";
      report.style.cursor = "pointer";
      report.style.backgroundColor = "blue";
      report.setAttribute("data-key",post.id);

      report.onclick= function(){
        var data = current_push_data;
        this.innerHTML = "已回報";
        doPost(SERVER+"comment/ptt_report",{
          url:post.url,
          userid:data.userid,
          board:post.board,
          post:post.key,
          content:data.push_word+" "+data.userid+":"+data.content,
          push:data.key
        },function(){
        });
      };
      report.onmouseover = function(){
        current_push.style.borderBottom = "1px solid red";
      };
      report.onmouseout = function(){
        current_push.style.borderBottom = "0";
      };
      report.classList.add("comment-report");

      var link = document.createElement("a");
      link.innerHTML = "(跳針留言小幫手 啟用中)";
      link.style.color='#5b74a8';
      link.href="https://www.facebook.com/pages/跳針留言小幫手/558883377558652";
      link.target="_blank";
      document.getElementById("navigation").appendChild(link);
      document.body.appendChild(report);      
    };

    handleFBComment();


  })();
} // wrapper end

wrapper();

