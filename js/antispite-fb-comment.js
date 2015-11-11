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
    if(self.location.href.toString().indexOf('version=v2.3') !=-1){
      //alert("not supported v2.3");
      return true;
    }

    var log = false;
    var SERVER = "http://antispite.tonyq.org/";
     // var SERVER = "http://localhost:9090/";    
    //===============helpers start ====================

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


    var w = function(ary){
      var o = [];
      for(var i = 0 ; i < ary.length;++i){
        o.push(ary[i]);
      }
      return o;
    };

    window.IMPL = {
      users:{},
      findFBUserKey:function(post){
        var profileName = post.querySelector(".UFICommentActorName");
        if(profileName.href != null){ //Facebook
          if(profileName.href.indexOf("profile.php?id=") != -1 ){
            userkey = "id="+profileName.href.split("id=")[1];
          }else{
            userkey = profileName.href.split("www.facebook.com/")[1];
            if(userkey.indexOf("-")){
              userkey = userkey.split("-")[userkey.split("-").length-1];
            }
          }
        }else if(profileName.nextSibling.innerHTML.indexOf("yahoo") != -1) {  //Yahoo
          userkey = "yahoo:" + profileName.innerHTML;
        }
        return userkey;

      },
      getUrl:function(){
        var u = self.location.href.toString();
        u = u.substring(u.indexOf("href=")+4,u.indexOf("&",u.indexOf("href=")));
        // console.log("URL",decodeURIComponent(u));
        return decodeURIComponent(u);
      },
      checkHandled : function(post){
        if(post.classList.contains("handled")){
          return true;
        }
        return false;
      },
      getPostKey:function(post){
        if(post == null){
          return null;
        }
        if(post.querySelectorAll(".uiLinkSubtle")[0]){
          return post.querySelectorAll(".uiLinkSubtle")[0].href.split("fb_comment_id=")[1];
        }
        return IMPL.getPostKey(IMPL.getParentPost(post)) + "_"+ post.querySelector("abbr").getAttribute("data-utime");
      },
      getParentPost:function(post){
        var p = post;
        while(p){
          if(p.classList.contains("UFIImageBlockContent")){
            return p.parentNode.parentNode;
          }
          p = p.parentNode;
        }
      },
      getContentDOM:function(post){
        return post.querySelector(".uiLinkSubtle,.livetimestamp").parentNode.parentNode.previousSibling;
      },
      _analyticsPost:function(post,url,check){


        var key = IMPL.getPostKey(post);
        var reply = false;
        if(key.split("_").length >=3){
          parent_key = IMPL.getPostKey(IMPL.getParentPost(post)) ;
          reply = true;
        }

        log && console.log("post keys:"+key,parent_key);

        var username = post.querySelector(".UFICommentActorName").innerHTML;
        var userkey = IMPL.findFBUserKey(post);

        if(userkey == null){
          return null;
        }

        var parent_key = null;
        var p = post.parentNode;
        
        var utime = post.querySelector("abbr").getAttribute("data-utime");
        var time = parseInt(utime,10)*1000;
        var fbkey = null;
        if(reply){ //reply
          fbkey = "fbc2_"+key.split("_")[1]+"_"+utime +"_reply";
        }else{
          fbkey = "fbc2_"+key.split("_")[1]+"_"+utime ;
        }


        var content = IMPL.getContentDOM(post).innerText;
        var likes = 0;

        var likedom = w(post.querySelector(".uiLinkSubtle,.livetimestamp").parentNode.parentNode.querySelectorAll("img"));
        
        likedom.filter(function(img){
          return img.src.indexOf("like.png") != -1;
        }).forEach(function(o){
          likes = o.nextSibling.textContent;
        });

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
          fbkey:fbkey,
          //fbid:userid,
          likes:likes,
          version:"1.0"
        };
        return obj;
      },
      analyticsPost:function(post,url,check,callback){

        var more = post.querySelector(".postText .see_more_link");
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
        return w(document.querySelectorAll(".UFIImageBlockContent")).filter(function(o){
          return o.classList.contains("clearfix");
        }).map(function(o){
          return o.parentNode.parentNode;
        });
      },
      getButtonContainer:function(post){
        return post.querySelector(".uiLinkSubtle,.livetimestamp").parentNode.parentNode;
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
        for(var i = 0 ; i < posts.length;++i){
          if(!IMPL.checkHandled(posts[i])){
            IMPL.analyticsPost(posts[i],url,null,function(nowpost){
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
                time:nowpost.time,
                likes:nowpost.likes
              });
              IMPL.users[nowpost.userkey] = IMPL.users[nowpost.userkey] || {name:nowpost.name, posts:[],count:0}; //init
              IMPL.users[nowpost.userkey].posts.push(nowpost.key); //push
              //console.log("add",nowpost.userkey,nowpost.key);
              if(handled == ind){
                cb && cb(all_post_ids); 
              }
            });
          }
        }
      },
      getPostMap:function(){
        return IMPL.getPosts().reduce(function(now,p){
          now[IMPL.getPostKey(p)] = p;
          return now;
        },{});
      },
      handledBadPosts:function(bad_posts){
        if(!bad_posts.length){
          return true;
        }
        // console.log(bad_posts);
        var postMap = IMPL.getPostMap();
        bad_posts.forEach(function(post){
          var ele = postMap[post._id];

          var content = IMPL.getContentDOM(ele).childNodes[0];
          content.style.color ='gray';
          content.setAttribute("title","跳針內容");

          var span = document.createElement("p");
          span.style.color="red";
          span.innerHTML="(反跳針偵測：注意，此篇可能有跳針內容。)";

          var ele_elem = IMPL.getContentDOM(ele);
          ele_elem.appendChild(span,ele_elem);

          var report = ele.querySelector(".comment-report");
          report.parentNode.removeChild(report);
        });
      },
      getProfileContainer:function(post){
        return post.querySelector(".UFICommentActorName").parentNode;
      },
      handledBadUsers:function(bad_users){
        if(!bad_users.length){
          return true;
        }

        var postMap = IMPL.getPostMap();
        bad_users.forEach(function(user){
          IMPL.users[user.user].count = user.count;

          if(user.count < 5){ //小於五筆的略過不顯示
            return true;
          }

          IMPL.users[user.user].posts.forEach(function(post_id){
            var ele = postMap[post_id];
            var titles = IMPL.getProfileContainer(ele);
            // if(titles.classList.contains("postContent")){
            //   var newtitle = document.createElement("span");
            //   newtitle.className = "fsm fwn fcg";
            //   titles.parentNode.insertBefore(newtitle,titles);
            //   titles = newtitle;
            // }

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
            //     reply.push(IMPL.users[user].name+" 的跳針指數("+IMPL.users[user].count+"),看看他的留言清單:",
            //         SERVER + "comment/user/?key="+encodeURIComponent(user)
            //     );
            //   }); 
            //   var text = replyText.querySelector("textarea.textInput");
            //   if(text){
            //     text.classList.add("target-text");
            //     //text.value = reply.join("\n");
            //   } 
       
            // }
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
    log && console.log("antispite test for normal ...");
    if(document.querySelectorAll(".UFIImageBlockContent").length == 0){
      throw "antispite not support (normal version)";
      return true;
    }
    var open_all = false;
    var handleFBComment = function(){
      //open all implement - start      
      if(open_all){
        var pagers = document.querySelectorAll(".fbFeedbackPagerLink");
        for(var i = 0; i < pagers.length ;++i){
          pagers[i].click();
        }
      }

      if(document.querySelector(".open-helper") == null){
        var openBtn = document.createElement("a");
        openBtn.href='javascript:void 0;';
        openBtn.onclick = function(){
          open_all = true;
          var pagers = document.querySelectorAll(".fbFeedbackPagerLink");
          for(var i = 0; i < pagers.length ;++i){
            pagers[i].click();
          }          
        };
        openBtn.innerHTML = "展開全部留言(by小幫手)"
        openBtn.classList.add("open-helper");

        if (document.querySelector(".uiHeaderTitle") != null){
          document.querySelector(".uiHeaderTitle").appendChild(openBtn);
        }else{
          document.querySelector(".UFIImageBlockContent").parentNode.parentNode.parentNode.insertBefore(openBtn,document.querySelector(".fbFeedbackPosts"));
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

              if(result.data.check_ids.length){
                var reports = [];  
                result.data.check_ids.forEach(function(post){
                  var ele = document.getElementById(post);
                  IMPL.analyticsPost(ele,url,true,function(d){
                    reports.push(d);

                    if(reports.length == result.data.check_ids.length){
                      doPost(SERVER+"comment/report_check",
                      {
                        data:reports
                      });
                    }
                    
                  });
                });
              }


            }
            //{"isSuccess":true,"errorCode":0,"data":{"bad_posts":[{"_id":"fbc_1474142749482507_322139_1474379669458815"}],"bad_users":[]},"errorMessage":null} 
            //console.log(response);
          }
        );
      });
      for(var i = 0 ; i < posts.length;++i){
        applyoptions(posts[i],url);
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

