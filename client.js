#!/usr/bin/nodejs
/*
 * Benjamin Bianchi
 * 2014
 * Developed on Ubuntu 12.04 Operating System
 * Using Nodejs and Sublime Text
 * /eng/dev/nodejs/client.js
 */

 /****************************************************
 *            GLOBALS                                *
 *****************************************************/
      var options = {
      host: 'localhost',
      path:'/Duplicate',
      port: '8040',
      auth: "Ben:pass"  };
/*****************************************************/
   callback = function(response) {
    var str = '';
    
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
      
    });
    response.on('error', function (chunk){
      str = "Error Connection Unable";
      console.log(str);
      return str;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {

      if (str=="404" || str == "403")
      {
        console.log("Nothing to update here!");
        process.exit(1);
      }
      
      files =JSON.parse(str);
      // $("h1").text("hello");

      for (var i = files.length - 1; i >= 0; i--) {
        // document.getElementById('ContentTable').innerHTML ="<tr><td>"+files[i].Name+"</td><td>"+files[i].buffer+"</td><td>"+files[i].Info.mtime+"</td></tr>"
      };
      ParseStream(files);
      console.log("200 OK [GOT FILES]");
    });
  }


 
     


     var fs = require('fs');
     var http = require('http');
     var files = [];
     var time = Date();

    

  
  

  http.request(options, callback).end();
  


    var ParseStream = function(jsonlist)
    {

      console.log("Yo");
      
      var localfiles  = [];
      
      console.log("Comparing Files\n Count:"+files.length);
      
      for (var i = files.length - 1; i >= 0; i--)
      {
        
        if (fs.existsSync(files[i].Name) == true)
        {
         if (fs.existsSync(files[i].Name));
         {
          var fileStatfs = fs.statSync(files[i].Name);
          if (fileStatfs.mtime <  files[i].Info.mtime)
            fs.writeFileSync(files[i].Buffer)
        }
      }
      
    }
  }


