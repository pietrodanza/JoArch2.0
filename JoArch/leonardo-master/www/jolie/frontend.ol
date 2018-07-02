/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                                                    *
* Copyright (C) 2017 Vincenzo Mattarella <vinsmattarella@gmail.com>                  *
*                                                                                    *
* Permission is hereby granted, free of charge, to any person obtaining a copy of    *
* this software and associated documentation files (the "Software"), to deal in the  *
* Software without restriction, including without limitation the rights to use,      *
* copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the    *
* Software, and to permit persons to whom the Software is furnished to do so, subject*
* to the following conditions:                                                       *
*                                                                                    *
* The above copyright notice and this permission notice shall be included in all     *
* copies or substantial portions of the Software.                                    *
*                                                                                    *
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,*
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A      *
* PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT *
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  *
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE     *
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                             *
*                                                                                    *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

include "FrontendInterface.iol"
include "file.iol"
include "console.iol"
include "json_utils.iol"
include "string_utils.iol"

execution{ concurrent }

inputPort FrontendPort {
Location: "local"
Protocol: http {.format->format; .default="default"}
Interfaces: FrontendInterface
}

main
{
  [
    inspectConfig()(response){
      format = "json";
      file.filename = "./www/config/pathlist.json";
      readFile@File(file)(text);
      response.jsonData = text
    }
  ]
  [
  	sendJSONList(request)(response){
  		counter = 0;
  		for ( element in request.pathValue ) {
  			path.directory = element;
  			path.regex = ".*\\_trace.json";
  			list@File(path)(results);
  			for ( i=0, i<#results.result,i++ ) {
  				response.filesList[counter].filePath = element;
  				response.filesList[counter].fileName = results.result[i];
  				counter++
  			}
  		}
  	}
  ]
  [
    sendSingleJSON(request)(response){
      format = "json";
      file.filename = request.path;
	    readFile@File(file)(text);
	    response.jsonData = text
    }
  ]
  [
    saveNewPath(request)(response){
      format = "json";
      file.filename = "./www/config/pathlist.json";
      readFile@File(file)(text);
      getJsonValue@JsonUtils(text)(res);
      length = #res.("_");
      avalaibility = true;
      for ( element in res.("_") ) {
        if(element.path == request.path){
          avalaibility = false
        }
      };
      if(avalaibility==true){
        res.("_")[length].path = request.path;
        getJsonString@JsonUtils(res)(testo);
        writingVar.content = testo;
        writingVar.filename = "./www/config/pathlist.json";
        writeFile@File(writingVar)();
        response = true
      } else{
        response = false
      }
    }
  ]
  [
    deletePath(request)(response){
      format = "json";
      file.filename = "./www/config/pathlist.json";
      readFile@File(file)(text);
      getJsonValue@JsonUtils(text)(res);
      for (element in request.pathValue){
        for ( i = 0, i < #res.("_"), i++ ) {
          if(res.("_")[i].path==element){
            undef( res.("_")[i])
          }
        }
      };
      getJsonString@JsonUtils(res)(testo);
      writingVar.content = testo;
      writingVar.filename = "./www/config/pathlist.json";
      writeFile@File(writingVar)();
      response = true
    }
  ]
}
