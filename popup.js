$(document).ready(function() { 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://kicker-parser.herokuapp.com/", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // WARNING! Might be evaluating an evil script!
        //var resp = eval("(" + xhr.responseText + ")");
        $("status").text(xhr.responseText);
        console.log(xhr.responseText);
      }
    }
    xhr.send();
});
