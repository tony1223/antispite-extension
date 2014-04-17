/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
  
       var url = request.url;
       var valueObj = request.data;
       var method = request.method;
       var cb_ok = callback;

       if(url&&valueObj&&method&&cb_ok ){
            var request= new XMLHttpRequest();
            if(method=='POST'){

                var requestValue="";
                var length=0;

                for (var i in valueObj)
                {
                    if(requestValue!="") requestValue+="&";

                    if(typeof valueObj[i] == "object"){
                      var content = JSON.stringify(valueObj[i]);
                      requestValue+=i+"="+content;
                      length+= parseInt(content.length);
                    }else{
                      requestValue+=i+"="+escape(valueObj[i]);
                      length+= parseInt(escape(valueObj[i]).length);
                    }

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
                    callBackFunction(request,cb_ok,cb_err);
                };

                request.send(null);

            }
        }else{
                    alert('<url>,<valueObj>,<method>,<cbfunction>');
        }
        return true; // prevents the callback from being called too early on return
    }

});