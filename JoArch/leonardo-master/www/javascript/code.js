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

var Jolie = {
  askForJSONList: function(operation, request, callback){
  	$.ajax({
  		url: "/"+operation,
  		dataType: "json",
  		data:JSON.stringify(request),
  		type: "GET",
  		contentType: "application/json",
  		success: function(data){
  			callback(data)
  		}
  	})
  }, 
  askForJSON: function(operation, request, callback){
    $.ajax({
      url: "/"+operation,
      dataType: "json",
      data: JSON.stringify(request),
      type: "GET",
      async:false,
      contentType: "application/json",
      success: function(data){
        callback(data);
      //  console.log(data)
      }
    })
  },
  askForFileList: function(operation,callback){
    $.ajax({
      url: "/"+operation,
      dataType: "json",
      type: "GET",
      contentType: "application/json",
      success: function(data){
        callback(data);
      //  console.log(data)
      }
    })
  },
  delete: function(operation,request,callback){
    $.ajax({
      url:"/"+operation,
      dataType: "json",
      data: JSON.stringify(request),
      type: "GET",
      contentType: "application/json",
      success: function(data){
        callback(data);
      }
    })
  },
  addPath: function(operation,request,callback){
    $.ajax({
      url: "/"+operation,
      dataType: "json",
      data: JSON.stringify(request),
      type: "GET",
      contentType: "application/json",
      success: function(data){
        callback(data);
      }
    })
  }

  /*,

	// Calls an operation at the specified
	// service published by the originating server using JSON
	callService: function( service, operation, data, callback ) {
		$.ajax({
			url: '/!/' + service + '!/' + operation,
			dataType: 'json',
			type: 'POST',
			contentType: 'application/json',
			success: callback,
			data: JSON.stringify( data )
		});
	},
	widgets: {}
*/
};


