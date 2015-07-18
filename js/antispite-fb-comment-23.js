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
    var worked = true;

    var SERVER = "http://antispite.tonyq.org/";
    // var SERVER = "http://localhost:3000/";    
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
    var cut = function(str,start,end){
      if(str == null ){
        return null;
      }
      var ind = str.indexOf(start);
      if(ind == -1){
        return null;
      }

      var endInd = str.indexOf(end,ind + start.length +1);
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
      //_ajax(url,valueObj,method,cb_ok,cb_err);
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
      findFBUserKey:function(post){
        //get user real id
        var profileName = post.querySelector(".UFICommentActorName");
        if(profileName.href != null){ //Facebook
          if(profileName.href.indexOf("profile.php?id=") != -1 ){
            userkey = "id="+profileName.href.split("id=")[1];
          }else{
            userkey = profileName.href.split("www.facebook.com/")[1];
          }
        }else if(profileName.nextSibling.innerHTML.indexOf("yahoo") != -1) {  //Yahoo
          userkey = "yahoo:" + profileName.innerHTML;
        }
        return userkey;
      },
      findFBUserID:function(post){
        var profileName = post.querySelector(".UFICommentActorName");
        if(profileName != null){ //Facebook
          var hovercard = profileName.getAttribute("data-hovercard");
          var fbid = cut(hovercard,"hovercard.php?id=","&");
          return fbid;
        }
        return null;
      },
      getUrl:function(){
        //https://www.facebook.com/plugins/comments.php?api_key=350231215126101&channel_url=http%3A%2F%2Fstatic.ak.facebook.com%2Fconnect%2Fxd_arbiter%2FKTWTb9MY5lw.js%3Fversion%3D41%23cb%3Df21a82297%26domain%3Dudn.com%26origin%3Dhttp%253A%252F%252Fudn.com%252Ff3a42af35%26relation%3Dparent.parent&colorscheme=light&href=http://www.appledaily.com.tw/realtimenews/article/new/20150107/538015/&locale=zh_TW&numposts=5&sdk=joey&skin=light&version=v2.3&width=683
        //console.log(JSON.stringify(self.location.href.toString()));
        var url = self.location.href.toString();
        var start = url.indexOf("href=");
        var data = null;
        if(start != -1){
          var end = url.indexOf("&",start+1);
          if(end == -1){
            data = url.substring(start+5);
          }else{
            data = url.substring(start+5,end);
          }
        }
        if(!data){
          IMPL.error();
        }
        //href=http://www.appledaily.com.tw/realtimenews/article/new/20150107/538015/&
        return data;
      },
      error:function(){
          worked = false;
          throw "unkown page of antispite,project stoped.";
      },
      checkHandled : function(post){
        if(post.classList.contains("handled")){
          return true;
        }
        return false;
      },
      getPostID:function(post){
        var key = null,parent_key = null;
        (function(){
          var dataid = getRid(post);
          if(dataid.indexOf(".0.0.2.0") == -1){
            IMPL.error();
          }
          var tokens = dataid.split(/[\$_]/);
          var id1 = tokens[1];
          var id2 = tokens[2].substring(0,tokens[2].length-1);

          var utime = lchild(post,1,0,1,0).querySelector(".livetimestamp").getAttribute("data-utime");
          if(dataid.indexOf("$right") !== -1){
            var parent_post = lparent(post,6);
            parent_key = IMPL.getPostID(parent_post);
            //fbc_682164288567311_682565851860488_682565851860488_reply
            key = "fbc2_" + tokens[5]+"_"+ utime +"_reply";
          }else{
            key = "fbc2_"+id1+"_"+utime;
          }
        })();

        return {key,parent_key:parent_key};
      },
      getPostMap:function(){
        var posts = IMPL.getPosts();
        var result = {};
        each(posts,function(p,ind){
          var data = IMPL.getPostID(p);
          result[data.key] = p;
        });
        return result;
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
      _analyticsPost:function(post,url,check){
        //get_id
        var key = null,
            parent_key = null;

        var data = IMPL.getPostID(post);
        key = data.key;
        parent_key = data.parent_key;

        if(!key){
          IMPL.error();
        }

        var username = post.querySelector(".UFICommentActorName").textContent;
        var userkey = IMPL.findFBUserKey(post);
        var userid = IMPL.findFBUserID(post);

        var likes = null;
        var container = lchild(post,1,0,1,0,2);
        if(container){
          each(container.querySelectorAll("img"),function(dom){
            if(dom.src.indexOf("fbfeed/like.png") != -1){
              likes = dom.nextSibling.textContent;
              return false;
            }
          });
        }

        if(userkey == null){
          return null;
        }

        // var content = post.querySelectorAll(" div > div ")[1]
        //   .querySelectorAll(" div > div")[0].textContent;
        var content = lchild(post,1,0,1,0,1).innerText;

        //livetimestamp

        var time = parseInt(lchild(post,1,0,1,0).querySelector(".livetimestamp").getAttribute("data-utime"),10)*1000;

        var obj = {
          type:"FBComment",
          name:username,
          userkey:userkey,
          content:content,
          time:time,
          key:key,
          url:url,
          check:check ? "true" : null,
          parent_key:parent_key,
          fbid:userid,
          likes:likes,
          version:"2.3"
        };
        return obj;
      },
      analyticsPost:function(post,url,check,callback){

        var more = null;//TODO: apply this
        var delay = 0;
        if(more != null){
          more.click();
          delay = 1000;
          setTimeout(function(){
            callback && callback(IMPL._analyticsPost(post,url,check));
          });
        }else{
          callback && callback(IMPL._analyticsPost(post,url,check));
        }
      },
      getPosts:function(){
        var pager = document.querySelectorAll("[data-reactid='.0.0.2']")[0];
        //lchild(document.body,0,0,0,0,2);
        var posts = [];
        for(var i = 0 ; i < pager.childNodes.length;++i){
          var rid = pager.childNodes[i].getAttribute("data-reactid");
          if(rid.indexOf(".0.0.2.0") !== -1){
            posts.push(pager.childNodes[i]);
            [].push.apply(posts,IMPL.getReplyPost(pager.childNodes[i]));
          }
        }

        return posts;
        //return $$(".fbFeedbackPost");
      },
      getReplyPost:function(post){
        var replys = lchild(post,1,0,1,0,3);
        if(post.querySelector(".spite-info")){
          replys = lchild(post,1,0,1,0,4);
        }
        var result = [];
        each(replys.childNodes,function(reply,i){
          var first = lchild(reply,0);
          if(first && first.tagName == "A"){
            return true;
          }
          result.push(reply);
        });
        return result;
      },
      getButtonContainer:function(post){
        return lchild(post,1,0,1,0,2);
      },
      analytics_ids:function(posts,url,cb){
        var all_post_ids = [];
        var ind = 0 ;
        var handled = 0 ;
        for(var i = 0 ; i < posts.length;++i){
          if(!IMPL.checkHandled(posts[i])){
            ind++;
          }
        }

        each(posts,function(post,i){
          if(!IMPL.checkHandled(post)){
            IMPL.analyticsPost(post,url,null,function(nowpost){
              handled++;
              if(nowpost == null){
                if(handled == ind){
                  return cb && cb(all_post_ids); 
                }
                return true;
              }

              all_post_ids.push({
                key:nowpost.key,
                type:nowpost.type,
                user:nowpost.userkey,
                fbid:nowpost.fbid,
                time:nowpost.time,
                likes:nowpost.likes
              });
              //console.log("add",nowpost.userkey,nowpost.key);
              if(handled == ind){
                cb && cb(all_post_ids); 
              }
            });
          }
        });
      },
      handledBadPosts:function(bad_posts){
        if(!bad_posts.length){
          return true;
        }
        var postDomMap = IMPL.getPostMap();
        // console.log(bad_posts);
        bad_posts.forEach(function(post){
          var domPost = postDomMap[post._id];

          var content = lchild(domPost,1,0,1,0,1);
          content.style.color ='gray';
          content.setAttribute("title","跳針內容");

          var span = document.createElement("p");
          span.style.color="red";
          span.className="spite-info";
          span.innerHTML="(反跳針偵測：注意，此篇可能有跳針內容。"+
              "<a href='" + SERVER + "/comment/provide/?key="+
                post._id+"' target='_blank'>提供更多資料</a>)";

          content.parentNode.insertBefore(span,content.nextSibling);

          var report = domPost.querySelector(".comment-report");
          report.parentNode.removeChild(report);
        });
      },
      getHEAD:function(){
        var header = document.body.querySelectorAll("body>div>div>div>div>div")[0];
        if(header && header.childNodes.length == 2 
            && header.childNodes[0].classList.contains("lfloat")
            && header.childNodes[1].classList.contains("rfloat")){
          return header;
        }
        return null;
      },
      clickPageButton:function(){
        var pagers = IMPL.getPagerButton();
        for(var i = 0; i < pagers.length ;++i){
          if(pagers[i] && !pagers[i].classList.contains("spite-clicked")){
            pagers[i].click();
            pagers[i].classList.add("spite-clicked");
          }

        }
      },
      getPagerButton:function(){
        var pager = document.body.querySelectorAll("body> div>div>div>div>div")[2];
        var result = [];
        if(pager && pager.childNodes.length){
          var lastchild = pager.childNodes[pager.childNodes.length-1];
          var input = lastchild.querySelector("[type=submit]");
          if(input){
            result.push(input);
          }
        }

        // var parent = document.body.querySelectorAll("body> div>div>div>div>div")[2];
        // for(var i = 0 ; i < parent.childNodes.length;++i){
        //   var replys = lchild(parent.childNodes[i],1,0,1,0,3);
        //     if(replys){
        //     var first = lchild(replys.childNodes[replys.childNodes.length-1],0);
        //     if(first && first.tagName == "A"){
        //       result.push(first);
        //     }
        //   }
        // }
        

        return result;
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


    // _log("Loading jQuery");
    // var s=document.createElement('script');s.setAttribute('src', 'https://code.jquery.com/jquery.js');
    // document.getElementsByTagName('body')[0].appendChild(s);
    var users = {};




    var applyoptions = function(post,url){
      if(IMPL.checkHandled(post)){
        return true;
      }
      post.classList.add("handled");
      var report = document.createElement("a");
      report.innerHTML = "回報跳針";
      report.style.color='#5b74a8';
      report.setAttribute("data-key",post.id);
      report.classList.add("comment-report");

      var link = document.createElement("a");
      link.innerHTML = "小幫手粉絲頁";
      link.style.color='#5b74a8';
      link.href="https://www.facebook.com/pages/跳針留言小幫手/558883377558652";
      link.target="_blank";

      report.onclick = function(){
        IMPL.analyticsPost(post,url,null,function(data){
          doPost(SERVER+"comment/report",
          {
            data:data
          },function(){
            report.innerHTML = "已回報";
            var actions = IMPL.getButtonContainer(post);
            actions.appendChild(document.createTextNode("· "));
            actions.appendChild(link);          
          });
        });

        return false;
      };
      var actions = IMPL.getButtonContainer(post);
      actions.appendChild(document.createTextNode("· "));
      actions.appendChild(report);
      return true;
    };    

    //assume 留言只有兩層，第二層的留言會跟第一層留言共用回覆。
    var findReplyComment = function(post){ 
      var reply = post.querySelector(".composerReply");  
      if(reply != null){ //第一層留言
        return reply;
      }

      var p = post.parentNode;
      while(p == null || p.classList.contains("fbFirstPartyPost")){ //找上一層的 fbFeedbackPost
         p = p.parentNode;
      }
      if(p!= null){
        return p.querySelector(".composerReply");
      }

      return null; //因故找不到回應窗
    };

    var findRelatedUsers = function(post){
      var p = post.parentNode;
      while(p == null || p.classList.contains("fbFirstPartyPost")){ //找上一層的 fbFeedbackPost
         p = p.parentNode;
      }

      if(p == null){
        p = post;
      }
      //p 是此時最外層最高階的 post
      var posts = [];
      posts.push.apply(posts,p.querySelectorAll(".fbFeedbackPost"));
      posts.push(post);
      var users = [];
      var check = {};

      for(var i = 0 ; i < posts.length;++i){
        var current = posts[i];
        var userkey = IMPL.findFBUserKey(post);

        if(userkey == null){
          continue;
        }

        if(check[userkey] == null){
          users.push(userkey);
        }
        check[userkey] = 1;

      }
      return users;
    };

    //===============helpers end ====================

    var open_all = false;

    var handleFBComment = function(){
      if(!worked){
        return true;
      }
      //open all implement - start      
      if(open_all){
        IMPL.clickPageButton();
      }

      if(document.querySelector(".open-helper") == null){
        var openBtn = document.createElement("a");
        openBtn.href='javascript:void 0;';
        openBtn.onclick = function(){
          open_all = true;
          IMPL.clickPageButton();
        };
        openBtn.innerHTML = "展開全部留言(by小幫手)"
        openBtn.classList.add("open-helper");

        var header = IMPL.getHEAD();
        if(header){
          header.childNodes[0].appendChild(openBtn);
        }
      }
      //open all implement - end


      var url = IMPL.getUrl();
      var posts = IMPL.getPosts();

      //apply options

      IMPL.analytics_ids(posts,url,function(all_post_ids){
        if(!all_post_ids.length ){
          return true;
        }
        doPost(SERVER+"comment/checkv2",
          {
            posts:all_post_ids,
            url:url
          },function(response){
            var result = JSON.parse(response);
            if(result.isSuccess){
              //mark spite result
              IMPL.handledBadPosts(result.data.bad_posts);
              IMPL.handledBadUsers(result.data.bad_users);
              // if(result.data.check_ids.length){
              //   result.data.check_ids.forEach(function(post){
              //     var ele = document.getElementById(post);
              //     IMPL.analyticsPost(ele,url,true,function(d){
              //       doPost(SERVER+"comment/report_check",
              //       {
              //         data:d
              //       });
              //     });
              //   });
              // }


            }
            //{"isSuccess":true,"errorCode":0,"data":{"bad_posts":[{"_id":"fbc_1474142749482507_322139_1474379669458815"}],"bad_users":[]},"errorMessage":null} 
            //console.log(response);
          }
        );
      });

      each(posts,function(p,i){
        applyoptions(p,url);
      });
      //console.log(JSON.stringify(results));

    };


    // var d= new Date().getTime();
    // //detect jQuery
    // var k = window.setInterval(function(){
    //   if(window.jQuery != null){
    //     _log("jQuery imported");
    //     window.clearInterval(k);
    //     handle(jQuery);
    //   }
    // },500);
    handleFBComment();
    setInterval(handleFBComment,3000);


  })();
} // wrapper end
// inject code into site context
// var script = document.createElement('script');
// script.appendChild(document.createTextNode('('+ wrapper +')();'));
// (document.body || document.head || document.documentElement).appendChild(script);

// function window_wrapper(){
//   function checktext(){
//     if(document.activeElement){
//       var targetText = document.activeElement;
//       if(targetText.classList.contains("target-text")){
//         window.run_with(targetText, ["legacy:control-textarea"], function() {TextAreaControl.getInstance(targetText)});
//       }
//     }
//   }
//   setInterval(checktext,2000);
// }

// var script = document.createElement('script');
// script.appendChild(document.createTextNode('('+ window_wrapper +')();'));
// (document.body || document.head || document.documentElement).appendChild(script);

wrapper();

