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
    

    var $$ = function(){
        return document.querySelectorAll.apply(document,arguments);
    };
    var ajax = function(url,valueObj,method,cb_ok,cb_err) {
      console.log(chrome);
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
    var handleFBComment = function(){
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
              name:username,
              userkey:userkey,
              content:content,
              time:time,
              key:key
            };
        };

        var applyoptions = function(post){
          var report = document.createElement("a");
          report.innerHTML = "回報蓄意挑釁";
          report.style.color='#5b74a8';
          report.setAttribute("data-key",post.id);
          report.onclick = function(){
            doPost("http://localhost/antispike/index.php/comment/report",
              {
                data:analyticsPost(post)
              },function(){
                alert("success");
              });

            console.log(analyticsPost(post));
            return false;
          };
          post.querySelector(".action_links").appendChild(document.createTextNode("· "));
          post.querySelector(".action_links").appendChild(report);
        };

      var posts = $$(".fbFeedbackPost");
      var results = [];
      for(var i = 0 ; i < posts.length;++i){
        applyoptions(posts[i]);
        results.push(analyticsPost(posts[i]));
      }
      console.log(JSON.stringify(results));

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


  })();
} // wrapper end
// inject code into site context
// var script = document.createElement('script');
// script.appendChild(document.createTextNode('('+ wrapper +')();'));
// (document.body || document.head || document.documentElement).appendChild(script);


//document.addEventListener('DOMContentLoaded', function () {
  wrapper();
//});
