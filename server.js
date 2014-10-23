#!/usr/bin/nodejs
/*
 * Benjamin Bianchi
 * 2014
 * Developed on Ubuntu 12.04 Operating System
 * Using Nodejs and Sublime Text
 * /eng/dev/nodejs/server.js
 * 
 ****************************************************
 *					DEPENDENCIES					*
 *	"node-watch"
 * 	"url"											*
 /****************************************************
 *						GLOBALS						 *
 ****************************************************/
 var About = "\nBuilt by Benjamin Bianchi\nUsing Sublime Text 2\nNodejs\nGoogle Chrome\nIternary:\n\t";
 var Lib = "Library";
 var path = "./"; 
/****************************************************/


 var http = require("http");
 var fs = require('fs');
 var url = require('url');
 var watch = require('node-watch');
 var files = [];
 var itinerary;


 var Logger = {
    FileName: "Server.log",
    format	: "Server.log"+"\t-\t[ARGTYPE]:\t-\t[ARG1]\n",
    buffer	: "",
    Error : function(text) {
    	Logger.buffer += fs.readFileSync(Logger.FileName,"utf8");
    	var s = Logger.format.replace('[ARG1]',text);
			s = s.replace('[ARGTYPE]',"ERROR");
       Logger.buffer += s;
       fs.writeFileSync(Logger.FileName,s);
       console.log(s);
    },
    Info : function(text) {
    	Logger.buffer += fs.readFileSync(Logger.FileName,"utf8");
    	var s = Logger.format.replace('[ARG1]',text);
    		s = s.replace('[ARGTYPE]',"INFO");
       Logger.buffer += s;
       fs.writeFileSync(Logger.FileName,s);
       console.log(s);
    },   
    Warn : function(text) {
    	Logger.buffer += fs.readFileSync(Logger.FileName,"utf8");
    	var s = Logger.format.replace('[ARG1]',text);
    		s = s.replace('[ARGTYPE]',"WARNING");
       Logger.buffer += s;
		fs.writeFileSync(Logger.FileName,s);
       console.log(s);
    },

};



 http.createServer(function(request, response) {
 		
 		var rurl = url.parse(request.url);


 		if (fs.existsSync(Logger.FileName))
			return;
		fs.writeFileSync(Logger.FileName, "");



	if (request.url.indexOf('favicon') > -1)	//Remove Favicon
		return;

	response.writeHead(200, {"Content-Type": "text/plain"});
	Logger.Info("Understood request from client.");

	for (var i = files.length - 1; i >= 0; i--) {
		Logger.Info("Wrote file "+files[i].Name)


	};



	if (files.length == 0 || files[0] == undefined)
	{
		Logger.Info("Writing Empty Response");
		response.write("404");
	}
	else
	{	
		Logger.Info("Writing Response...");
		response.write(JSON.stringify(files));

		
	}
	response.end();
	buildItinerary(request,files);

}).listen(8040);


 var getFile = function(fpath)
 {
 	var content = "";


 	content = fs.readFileSync(fpath,'utf8', function (err, data) 
 	{
 		if (err) throw err;
 		Logger.Info(data);
 	});

 	return content;
 }

 watch(path, function(filename) {
 	if (filename.indexOf('Library') > -1 || filename=="Server.log")
 		return;
 	
 	var repeat = false;
 	var info;	
 	for (var i = files.length - 1; i >= 0; i--) {
 		if (files[i].Name == filename)
 			repeat = true;
 	};
 	if (repeat==false || filename.indexOf('Library') == -1)
 	{
 		info = fs.statSync(filename);

 		files.push(JSON.parse('{	"Name":'+JSON.stringify(filename)+',"Info":'+JSON.stringify(info)+',"Buffer":'+JSON.stringify(getFile(filename))+'}'));
 		Logger.Info("Added file to stack.");
 	}
 });


 var buildItinerary = function(request)
 {
	// Loop through files, create neat txt file of information. DO NOT SEND.
	// Name File date and time.

	var filename = "";
	var buffer = "";
	filename = Date()+"";
	buffer+=(filename);
	buffer+=(About);
	buffer+=(request.url+"\n");
	

	for (var i = 0; i < files.length-1 ; i++) {
		Logger.Info("ITINERARY\t"+files[i].Name);
		buffer+=(buffer,files[i].Name+'\n');
		files.pop();
	};

	if (fs.existsSync(Lib) == false)
		fs.mkdir(Lib,777);

	Logger.Info("Writing to file: "+Lib+"/"+filename);
	fs.writeFile(Lib+'/'+filename,buffer);
	buffer = "";
	files = [];

}

 function Add_NoRepeats (list,item) {						//	Add to list, no repeats.
 	for (var i = list.length - 1; i >= 0; i--) {
 		if (list[i]==item)
 			return list;
 	}
 	list.push(item);
 }
