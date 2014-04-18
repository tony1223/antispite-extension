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

    // _log("Loading jQuery");
    // var s=document.createElement('script');s.setAttribute('src', 'https://code.jquery.com/jquery.js');
    // document.getElementsByTagName('body')[0].appendChild(s);
    var users = {};    
    var handleFBComment = function(){
        var url = document.querySelector("[name=url]").value;

        var analyticsPost = function(post){
            var key = post.id;
            var username = post.querySelector(".profileName").innerHTML;
            var userkey = post.querySelector(".profileName").href;
            if(userkey.indexOf("profile.php?id=") != -1 ){
              userkey = "id="+userkey.split("id=")[1];
            }else{
              userkey = userkey.split("www.facebook.com/")[1];
            }

            var content = post.querySelector(".postText").innerText;
            var time = parseInt(post.querySelector("abbr").getAttribute("data-utime"),10)*1000;

            return {
              type:"FBComment",
              name:username,
              userkey:userkey,
              content:content,
              time:time,
              key:key,
              url:url
            };
        };

        var applyoptions = function(post){
          if(post.classList.contains("handled")){
            return false;
          }
          post.classList.add("handled");
          var report = document.createElement("a");
          report.innerHTML = "回報跳針";
          report.style.color='#5b74a8';
          report.setAttribute("data-key",post.id);
          report.classList.add("comment-report");
          report.onclick = function(){

            doPost(SERVER+"comment/report",
              {
                data:analyticsPost(post)
              },function(){
                report.innerHTML = "已回報";
                //alert("success");
              });

            console.log(analyticsPost(post));
            return false;
          };
          post.querySelector(".action_links").appendChild(document.createTextNode("· "));
          post.querySelector(".action_links").appendChild(report);
          return true;
        };

      var posts = $$(".fbFeedbackPost");
      var all_post_ids = [];
      for(var i = 0 ; i < posts.length;++i){
        var nowpost = analyticsPost(posts[i]);
        if(applyoptions(posts[i])){
          all_post_ids.push({key:nowpost.key,type:nowpost.type,user:nowpost.userkey});
          users[nowpost.userkey] = users[nowpost.userkey] || []; //init
          users[nowpost.userkey].push(nowpost.key); //push
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
                  var content = ele.querySelector(".postText");
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
                  users[user.user].forEach(function(post_id){
                    var ele = document.getElementById(post_id);
                    var titles = ele.querySelector(".profileName").nextSibling;

                    if(titles.querySelector(".anti-title") == null){
                      var anti_link = document.createElement("a");
                      anti_link.style.color='red';
                      anti_link.target="_blank";
                      anti_link.classList.add("anti-title");
                      anti_link.innerHTML = " 使用者跳針指數("+user.count+")";
                      anti_link.href = SERVER + "comment/user/?key="+encodeURIComponent(user.user);
                      titles.appendChild(anti_link);
                    }else{
                      anti_link.innerHTML = " 目前跳針指數("+user.count+")";
                    }
                  });
                });
              }

            }
            //{"isSuccess":true,"errorCode":0,"data":{"bad_posts":[{"_id":"fbc_1474142749482507_322139_1474379669458815"}],"bad_users":[]},"errorMessage":null} 
            console.log(response);
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
    handleFBComment();
    setInterval(handleFBComment,2000);


  })();
} // wrapper end
// inject code into site context
// var script = document.createElement('script');
// script.appendChild(document.createTextNode('('+ wrapper +')();'));
// (document.body || document.head || document.documentElement).appendChild(script);


//document.addEventListener('DOMContentLoaded', function () {
  wrapper();
//});
