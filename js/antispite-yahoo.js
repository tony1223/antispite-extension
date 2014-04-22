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
    var SERVER = "http://antispite.tonyq.org/";
    //var SERVER = "http://localhost/antispite/";

    // _log("Loading jQuery");
    // var s=document.createElement('script');s.setAttribute('src', 'https://code.jquery.com/jquery.js');
    // document.getElementsByTagName('body')[0].appendChild(s);
    var users = {};


    //===============helpers start ====================

    var $$ = function(){
        return document.querySelectorAll.apply(document,arguments);
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

    var analyticsTime = function(post){
      var key = post.id;
      var timestring = key.split(/[\-_]/)[2];

      if(timestring.indexOf("000000000000000") == -1){ //一般留言
        return { 
          time:parseInt(key.split(/[\-_]/)[2],10),
          exact:true
        };
      }
      
      //yui_3_9_1_1_1398190400467_1302
      //ugccmt-timestamp
      var timestamp = post.querySelector(".ugccmt-timestamp");

      var recordtime = timestamp.id.split("_")[4];

      var beforeText = timestamp.innerText;
      return { 
        time:new Date().getTime(),
        exact:false
      };
    }

    var analyticsPost = function(post,url){
        var key = post.id;
        try{
          var userDom = post.querySelector(".ugccmt-user-cmt");
          var username = userDom.innerText;
          var userkey = userDom.href.split("https://profile.yahoo.com/")[1];
          if(userkey == null){
            return null;
          }
          var content = post.querySelector(".ugccmt-commenttext").innerText;

          //ugccmt-comment_1398166000268-e9199a62-5dc4-4257-a7f8-6704ea416844

          var time = analyticsTime(post);
          //parseInt(post.querySelector("abbr").getAttribute("data-utime"),10)*1000;

          return {
            type:"YahooComment",
            name:username,
            userkey:userkey,
            content:content,
            time:time.time,
            key:key,
            url:url,
            exact:time.exact
          };
        }catch(ex){
          return null;
        }
    };

    var applyoptions = function(post,url){
      if(post.classList.contains("handled") || post.querySelector(".abuse") == null){
        return false;
      }
      post.classList.add("handled");


      // var datetime = new Date(parseInt(post.id.split(/[\-_]/)[2],10));
      // post.querySelector(".ugccmt-timestamp").title = datetime.toString();

      var report = document.createElement("a");
      report.innerHTML = "回報跳針";
      report.style.color='#5b74a8';
      report.style.cursor="pointer";
      report.setAttribute("data-key",post.id);
      report.classList.add("comment-report");

      var link = document.createElement("a");
      link.innerHTML = "小幫手粉絲頁";
      link.style.cursor="pointer";
      link.style.color='#5b74a8';
      link.href="https://www.facebook.com/pages/跳針留言小幫手/558883377558652";
      link.target="_blank";

      var actions = post.querySelector(".ugccmt-comment-meta");
      report.href="javascript:void 0;";
      report.onclick = function(){
        var more = post.querySelector(".ugccmt-commenttext .ugccmt-expand");
        if(more != null){
          more.click();
          setTimeout(function(){
            doPost(SERVER+"comment/report",
            {
              data:analyticsPost(post,url)
            },function(){
              report.innerHTML = "已回報";
              actions.appendChild(document.createTextNode("· "));
              actions.appendChild(link);                        
              //alert("success");
            });
          },1000);
        }else{
          doPost(SERVER+"comment/report",
          {
            data:analyticsPost(post,url)
          },function(){
            report.innerHTML = "已回報";
            actions.appendChild(document.createTextNode("· "));
            actions.appendChild(link);          
          });
        }
        

        //console.log(analyticsPost(post));
        return false;
      };
      actions.appendChild(document.createTextNode("· "));
      actions.appendChild(report);
      return true;
    };    

    //assume 留言只有兩層，第二層的留言會跟第一層留言共用回覆。
    // var findReplyComment = function(post){ 
    //   var reply = post.querySelector(".composerReply");  
    //   if(reply != null){ //第一層留言
    //     return reply;
    //   }

    //   var p = post.parentNode;
    //   while(p == null || p.classList.contains("fbFirstPartyPost")){ //找上一層的 fbFeedbackPost
    //      p = p.parentNode;
    //   }
    //   if(p!= null){
    //     return p.querySelector(".composerReply");
    //   }

    //   return null; //因故找不到回應窗
    // };

    var findRelatedUsers = function(post){
      var p = post.parentNode;
      while(p == null || p.classList.contains("ugccmt-cmt-item")){ //找上一層的 fbFeedbackPost
         p = p.parentNode;
      }

      if(p == null){
        p = post;
      }
      //p 是此時最外層最高階的 post
      var posts = [];
      posts.push.apply(posts,p.querySelectorAll(".ugccmt-cmt-item"));
      posts.push(post);
      var users = [];
      var check = {};

      for(var i = 0 ; i < posts.length;++i){
        var current = posts[i];
        var userkey = userDom.href.split("https://profile.yahoo.com/")[1];

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
    var url = null;
    var handleYahooComment = function(){
      if(url == null && document.querySelector("[property=\"og:url\"]") == null){
        return false;
      }

      url = url || document.querySelector("[property=\"og:url\"]").content;
      var posts = document.querySelectorAll(".ugccmt-cmt-item");
      var all_post_ids = [];
      for(var i = 0 ; i < posts.length;++i){
        var nowpost = analyticsPost(posts[i],url);          
        if(nowpost == null){
          continue;
        }
        if(applyoptions(posts[i],url)){
          all_post_ids.push({key:nowpost.key,type:nowpost.type,user:nowpost.userkey});
          users[nowpost.userkey] = users[nowpost.userkey] || {name:nowpost.name, posts:[],count:0}; //init
          users[nowpost.userkey].posts.push(nowpost.key); //push
          //console.log("add",nowpost.userkey,nowpost.key);
        }
      }

      if(all_post_ids.length){
        doPost(SERVER+"comment/check",
          {
            posts:all_post_ids,
            url:url
          },function(response){
            var result = JSON.parse(response);
            if(result.isSuccess){
              //mark spite result
              if(result.data.bad_posts.length){
                result.data.bad_posts.forEach(function(post){
                  var ele = document.getElementById(post._id);
                  var content = ele.querySelector(".ugccmt-commenttext");
                  content.style.color ='gray';
                  content.setAttribute("title","跳針內容");

                  var span = document.createElement("p");
                  span.style.color="red";
                  span.innerHTML="(反跳針偵測：注意，此篇可能有跳針內容。)";
                  content.appendChild(span);

                  var report = ele.querySelector(".comment-report");
                  report.parentNode.removeChild(report);
                });
              }

              if(result.data.bad_users.length){
                result.data.bad_users.forEach(function(user){
                  users[user.user].count = user.count;
                  users[user.user].posts.forEach(function(post_id){
                    var ele = document.getElementById(post_id);
                    var titles = ele.querySelector(".ugccmt-comment-meta");

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

                    // var replyText = findReplyComment(ele);
                    // if(replyText){
                    //   var related_users = findRelatedUsers(ele);
                    //   var reply = [];
                    //   related_users.forEach(function(user){
                    //     reply.push(users[user].name+" 的跳針指數("+users[user].count+"),看看他的留言清單:",
                    //         SERVER + "comment/user/?key="+encodeURIComponent(user)
                    //     );
                    //   }); 
                    //   var text = replyText.querySelector("textarea.textInput");
                    //   if(text){
                    //     text.classList.add("target-text");
                    //     //text.value = reply.join("\n");
                    //   } 
                    //   var btn = replyText.querySelector(".post .import-btn");
                    //   if(btn == null){
                    //     btn = document.createElement("a");
                    //     btn.classList.add("import-btn");
                    //     btn.href="javascript:void 0;"
                    //     btn.innerHTML="引用跳針紀錄(因技術限制需先在留言框先打一個字才能引用)";
                    //     btn.onclick = function(e){
                    //       if(text){
                    //         text.value += "\n" + this.getAttribute("data-text");
                    //       }
                    //       e.preventDefault();
                    //       e.stopPropagation();
                    //       return false;
                    //     };
                    //     replyText.querySelector(".post").appendChild(btn);
                    //   }
                    //   btn.setAttribute("data-text",reply.join("\n"));
                    //}
                  });
                });


              }

            }
            //{"isSuccess":true,"errorCode":0,"data":{"bad_posts":[{"_id":"fbc_1474142749482507_322139_1474379669458815"}],"bad_users":[]},"errorMessage":null} 
            //console.log(response);
          });
      }
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
    handleYahooComment();
    setInterval(handleYahooComment,2000);


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

