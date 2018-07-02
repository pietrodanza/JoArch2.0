var JolieClient = JolieClient || (function() {
    var API = {};
    var isError = function( data ) {
        if ( data != null && typeof data.error != "undefined" ) {
            return true;
        }
        return false;
    }

    var jolieCall = function( operation, request, callback, errorHandler ) {
        $.ajax({
            url: '/' + operation,
            dataType: 'json',
            data: JSON.stringify( request ),
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            beforeSend: function(){
              // Show image container
              $("#loader").show();
            },
            success: function( data ){
               if ( isError( data ) ) {
                    errorHandler( data );
               } else {
                    callback( data );
               }
            },
            complete:function(data){
              // Hide image container
              $("#loader").hide();
            },
            error: function(errorType, textStatus, errorThrown) {
                   errorHandler( textStatus );
            }
        });
    }

    API.writeMicroservice = function( request, callback, errorHandler ) {
        jolieCall( "writeMicroservice", request, callback, errorHandler );
    }

    API.getMicroservice = function( request, callback, errorHandler ) {
        jolieCall( "getMicroservice", request, callback, errorHandler );
    }

    API.writeLink = function( request, callback, errorHandler ) {
        jolieCall( "writeLink", request, callback, errorHandler );
    }

    API.writePath = function( request, callback, errorHandler ) {
        jolieCall( "writePath", request, callback, errorHandler );
    }

    API.removeMicroservice = function( request, callback, errorHandler ) {
        jolieCall( "removeMicroservice", request, callback, errorHandler );
    }

    API.removeLink = function( request, callback, errorHandler ) {
        jolieCall( "removeLink", request, callback, errorHandler );
    }

    API.writeContainer = function( request, callback, errorHandler ) {
        jolieCall( "writeContainer", request, callback, errorHandler );
    }

    API.getContainer = function( request, callback, errorHandler ) {
        jolieCall( "getContainer", request, callback, errorHandler );
    }

    API.removeContainer = function( request, callback, errorHandler ) {
        jolieCall( "removeContainer", request, callback, errorHandler );
    }

    API.createLinks = function( request, callback, errorHandler ) {
        jolieCall( "createLinks", request, callback, errorHandler );
    }

    API.orchestratorContainer = function( request, callback, errorHandler ) {
        jolieCall( "orchestratorContainer", request, callback, errorHandler );
    }

    API.getContainerCreated = function( request, callback, errorHandler ) {
        jolieCall( "getContainerCreated", request, callback, errorHandler );
    }

    API.stopContainer = function( request, callback, errorHandler ) {
        jolieCall( "stopContainer", request, callback, errorHandler );
    }

    API.inspectContainer = function( request, callback, errorHandler ) {
        jolieCall( "inspectContainer", request, callback, errorHandler );
    }

    API.restartContainer = function( request, callback, errorHandler ) {
        jolieCall( "restartContainer", request, callback, errorHandler );
    }

    API.resetSystem = function( request, callback, errorHandler ) {
        jolieCall( "resetSystem", request, callback, errorHandler );
    }
    return API;
})();

$(document).ready(function(){
JolieClient.getContainerCreated({},function(data){
  if (data.containers.length == null) {
    InfoContainer = "";
  }else {
    InfoContainer = JSON.parse(JSON.stringify(data));
  }
  console.log(data);
}, function(){
    InfoContainer = "";
  })
});
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}
function openHome(){
    document.getElementById('containerDesign').style.display = "none";
    document.getElementById('containerHome').style.display = "";
    document.getElementById('containerDeploy').style.display = "none";
}
function openDesign(){
  closeNav();
  document.getElementById('containerHome').style.display = "none";
  document.getElementById('containerDesign').style.display = "";
  document.getElementById('containerDeploy').style.display = "none";
  updateTablesDesign();
}

function openDeploy(){
  closeNav();
  document.getElementById('containerHome').style.display = "none";
  document.getElementById('containerDesign').style.display = "none";
  document.getElementById('containerDeploy').style.display = "";
  getMicro("select-0");
  //getLink("selectLink-0");
  updateTableContainer();
}

function removeFieldInput(id) {
  var element = $(id).attr('id');
  var elementSplit = element.split("-");
  var elementInterface = parseInt(elementSplit[2]);
  var idButton = elementSplit[0]+ "-"+elementSplit[1]+"-"+(elementInterface+1);
  var name = "in-"+elementSplit[1]+ "-"+(elementInterface+1);
  var newName = "in-"+elementSplit[1]+ "-"+ elementSplit[2];
  $("#"+name).attr("id", newName);
  $("#"+idButton).attr("id", element);
  var $formGroup = $("#"+element).closest(".input-group");
  $formGroup.remove();
}

function removeFieldOutput(id) {
  var element = $(id).attr('id');
  var elementSplit = element.split("-");
  var elementInterface = parseInt(elementSplit[2]);
  var idButton = elementSplit[0]+ "-"+elementSplit[1]+"-"+(elementInterface+1);
  var name = "out-"+elementSplit[1]+ "-"+(elementInterface+1);
  var newName = "out-"+elementSplit[1]+ "-"+ elementSplit[2];
  $("#"+name).attr("id", newName);
  $("#"+idButton).attr("id", element);
  var $formGroup = $("#"+element).closest(".input-group");
  $formGroup.remove();
}

function duplicaInterfaceInput(id){
  var element = $(id).attr('id');
  var elementSplit = element.split("-");
  var elementInterface = parseInt(elementSplit[2]);
  var idButton = elementSplit[0]+ "-"+elementSplit[1]+"-"+(elementInterface+1);
  var nameInput = "in-"+elementSplit[1]+ "-"+(elementInterface+1);
  var $formGroup = $("#"+element).closest(".input-group");
  var $formGroupClone = $formGroup.clone();
  $("#"+ element)
      .toggleClass('btn-default btn-add btn-danger btn-remove')
      .html('–');
  $('#'+element).attr('onclick', 'removeFieldInput(this)');
  $formGroupClone.find('input').val('');
  $formGroupClone.find('input').attr("id", nameInput)
  $formGroupClone.find('.btn').attr("id", idButton);
  $formGroupClone.insertAfter($formGroup);
}

function duplicaInterfaceOutput(id){
  var element = $(id).attr('id');
  var elementSplit = element.split("-");
  var elementInterface = parseInt(elementSplit[2]);
  var idButton = elementSplit[0]+ "-"+elementSplit[1]+"-"+(elementInterface+1);
  var nameOutput = "out-"+elementSplit[1]+ "-"+(elementInterface+1);
  var $formGroup = $("#"+element).closest(".input-group");
  var $formGroupClone = $formGroup.clone();
  $("#"+ element)
      .toggleClass('btn-default btn-add btn-danger btn-remove')
      .html('–');
  $('#'+element).attr('onclick', 'removeFieldOutput(this)');
  $formGroupClone.find('input').val('');
  $formGroupClone.find('input').attr("id", nameOutput)
  $formGroupClone.find('.btn').attr("id", idButton);
  $formGroupClone.insertAfter($formGroup);
}


function createMicroservice(){

  if ((numInput == null) &&(numOutput==null)) {
      var microservice = {};
  } else if ((numInput != null) &&(numOutput==null)) {
    var microservice = {
      inputPort:[]
    };
  } else if ((numInput == null) &&(numOutput!=null)) {
    var microservice = {
      outputPort:[]
    };
  } else {
    var microservice = {
      inputPort:[],
      outputPort:[]
    };
  }
  var name = document.getElementById('nameMicroservice').value;
  if (name!= "") {
    microservice.name = name;
  }else {
    onError("Microservice name NULL!");
    return;
  }

  if (numInput!= null) {
    for (var k = 0; k < numInput; k++) {
      var numInterface = 0;
      var inputportElement = {};
      var interfaces = [];
      var inputId = "nameInput"+k;
      console.log(inputId);
      var nameInput = document.getElementById(inputId).value;
      if (nameInput!="") {
        inputportElement.name = nameInput;
      }else {
        onError("Inputport NULL!");
        return;
      }
      var interfaceId = "in-"+k+"-"+numInterface;
      var nameInterface = document.getElementById(interfaceId).value;
      if (document.getElementById(interfaceId).value == "") {
        onError("Interface name NULL!");
        return;
      }else {
        interfaces.push({name:nameInterface});
      }

      while (document.getElementById("in-"+k+"-"+(numInterface+1))!=null) {
        var interfaceValue = document.getElementById("in-"+k+"-"+(numInterface+1)).value;
        if (interfaceValue == "") {
          onError("Interface name NULL!");
          return;
        }else{
          interfaces.push({name: interfaceValue});
          numInterface++
        }
      }
      inputportElement.interfaces = interfaces;
      microservice.inputPort.push(inputportElement);
    }
  }

  if (numOutput != null) {
    for (var z = 0; z < numOutput; z++) {
      var numInterface = 0;
      var outputElement = {};
      var interfaces = [];
      var outputId = "nameOutput"+z;
      var nameOutput = document.getElementById("nameOutput"+z).value;

      if (nameOutput!= "") {
        outputElement.name = nameOutput;
      } else{
        onError("Outputport name NULL!");
      }
      var interfaceId = "out-"+z+"-"+numInterface;
      var nameInterface = document.getElementById(interfaceId).value;

      if (document.getElementById(interfaceId).value == "") {
        onError("Output interface NULL!");
        return;
      } else{
        interfaces.push({name:nameInterface});
      }

      while (document.getElementById("out-"+z+"-"+(numInterface+1))!=null) {
        var interfaceValue = document.getElementById("out-"+z+"-"+(numInterface+1)).value;
        if (interfaceValue == "") {
          onError("Output interface NULL");
          return;
        }else {
          interfaces.push({name: interfaceValue});
          numInterface++;
        }
      }
      outputElement.interfaces = interfaces;
      microservice.outputPort.push(outputElement);
    }
  }
  JolieClient.writeMicroservice(microservice, showDialogMicroservice, onError);
}

function createLink(){
  var link = {
    inputMicroservice:{},
    outputMicroservice:{}
  };
  var nameLink = document.getElementById("nameLink").value;
  var inputMicro = document.getElementById("selectInput").value;
  var inputPortName = document.getElementById("portInput").value;
  var outputMicro = document.getElementById("selectOutput").value;
  var outputPortName = document.getElementById("portOutput").value;
  if ((nameLink!= "")&&(inputMicro!="")&&(inputPortName!="")&&(outputMicro!="")&&(outputPortName!="")) {
    link.name = nameLink;
    link.inputMicroservice.name = inputMicro;
    link.inputMicroservice.portName = inputPortName;
    link.outputMicroservice.name = outputMicro;
    link.outputMicroservice.portName = outputPortName;
    JolieClient.writeLink(link, showDialogLink, onError);
  }else {
    onError("ERROR! Fields NULL");
  }

}

function getMicroserviceName(){
  JolieClient.getMicroservice({}, function(data){
    selectIn = document.getElementById("selectInput");
    while (selectIn.firstChild) {
      selectIn.removeChild(selectIn.firstChild);
    };

    selectOut = document.getElementById("selectOutput");
    while (selectOut.firstChild) {
      selectOut.removeChild(selectOut.firstChild);
    };

    if (data.microservices != null) {
      for (var i = 0; i < data.microservices.length; i++) {
        var opt1 = document.createElement('option');
        var opt2 = document.createElement('option');
        opt1.value = data.microservices[i].name;
        opt1.innerHTML = data.microservices[i].name;
        opt2.value = data.microservices[i].name;
        opt2.innerHTML = data.microservices[i].name;
        selectIn.appendChild(opt1);
        selectOut.appendChild(opt2);
      }
    }
  }, console.log(""));
}

function savePath(){
  var path = document.getElementById("path").value;
  if (path!= "") {
    JolieClient.writePath(path,showDialogLink, onError);
    $('#newPathModal').modal('hide');
    console.log(path);
  } else {
    onError();
  }
}

function updateTablesDesign(){
  getMicroserviceName();

  JolieClient.getMicroservice({}, function(data){
    $("#tableMicro > tbody").html("");
    $("#tableLink > tbody").html("");

    if (data.microservices!=null) {
    for (var i = 0; i < data.microservices.length; i++) {
      var rowMicro = "<tr id=\""+data.microservices[i].name +"\">"+
        "<td class=\"col-md-3\"><h4>"+data.microservices[i].name+"</h4></td>"+
        "<td class=\"col-md-4\">";
        if (data.microservices[i].inputPort !== undefined) {
          for (var j = 0; j < data.microservices[i].inputPort.length; j++) {
            rowMicro += (j+1) + " - "+ data.microservices[i].inputPort[j].name + "<br>";
          }
        }
        rowMicro += "</td>"+
          "<td class=\"col-md-4\">";
        if (data.microservices[i].outputPort !== undefined) {
          for (var z = 0; z < data.microservices[i].outputPort.length; z++) {
            rowMicro += (z+1) + " - "+data.microservices[i].outputPort[z].name + "<br>";
          }
        }
        rowMicro += "</td>"+"<td class=\"col-md-1\"><button class=\"btn btn-default glyphicon glyphicon-trash\" onclick=\"removeMicroservice(this)\"></button></td>"+"</tr>";
        $('#tableMicro > tbody:last-child').append(rowMicro);
        rowMicro = "";
      }
    };

    if (data.links != null) {
      for (var j = 0; j < data.links.length; j++) {
        var rowLink = "<tr id=\""+data.links[j].name +"\">"+
          "<td class=\"col-md-3\"><h4>"+data.links[j].name+"</h4></td>"+
          "<td class=\"col-md-4\">"+ data.links[j].inputMicroservice.name + "</td>"+
          "<td class=\"col-md-4\">"+ data.links[j].outputMicroservice.name + "</td>"+
          "<td class=\"col-md-1\"><button class=\"btn btn-default glyphicon glyphicon-trash\"onclick=\"removeLink(this)\"></button></td>"+
          "</tr>";
          $('#tableLink > tbody:last-child').append(rowLink);
          rowLink = "";
      }
    }
  }, function(){
    $("#tableMicro > tbody").html("");
    $("#tableLink > tbody").html("");
  });
}

function removeMicroservice(button){
  idMicro = $(button).closest('tr').attr("id");
  JolieClient.removeMicroservice(idMicro,function(){
    updateTablesDesign();
    var myHtml = "<div class=\"alert alert-danger alert-dismissable\">"+
      "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>"+
      "<strong>Microservice removed!</strong>"+
    "</div>";
    $(myHtml).insertBefore("#tabContentDesign");
  },onError);
}

function removeLink(button){
  idLink = $(button).closest('tr').attr("id");
  JolieClient.removeLink(idLink,function(){
    updateTablesDesign();
    var myHtml =
    "<div class=\"alert alert-danger alert-dismissable\">"+
      "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>"+
      "<strong>Link removed!</strong>"+
    "</div>";
    $(myHtml).insertBefore("#tabContentDesign");
  },onError);
}

function downloadJsonMicro(){
  var filepath = "microservicesArch.json";
  top.location.href = filepath;
}

function onError( data ) {
  alert(data);
}

function showDialogMicroservice() {
  updateTablesDesign();
  numInput = null;
  numOutput = null;
  $("#formInput").empty();
  $("#formOutput").empty();
  $('#newMicroservice').modal('hide');
  var myHtml =
  "<div class=\"alert alert-success alert-dismissable\">"+
    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>"+
    "<strong>Microservice entered successfully !</strong>"+
  "</div>";
  $(myHtml).insertBefore("#tabContentDesign");
}

function showDialogLink( data ) {
  updateTablesDesign();
  $('#newLink').modal('hide');
  var myHtml =
  "<div class=\"alert alert-success alert-dismissable\">"+
    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>"+
    "<strong>Link entered successfully !</strong>"+
  "</div>";
  $(myHtml).insertBefore("#tabContentDesign");
}

var numInput = null;
function duplicateInput() {
  if (numInput==null) {
    numInput = 0;
  }
    var myHtml =
      "<div class=panel-body id=inputBody"+numInput+ ">"+
        "<div class=\"name form-group\" style=\"margin-bottom: 12px;\">"+
            "<input type=text class=form-control id=\"nameInput"+ numInput + "\" placeholder=\"Insert name of inputport\">"+
        "</div>"+
        "<div class=input-group style='margin-bottom: 5px;'>"+
           "<input type=text class=form-control  id=\"in-"+numInput+"-0\""+ " value =\"\" placeholder=\"Insert interface name\">"+
           "<span class='input-group-btn'>"+
             "<button type='button' class='btn btn-default btn-add' id=\"btnIn-"+numInput+"-0\" onclick='duplicaInterfaceInput(this)'>+</button>" +
          "</span>"+
        "</div>"+
      "</div>"+
      "<hr>";
    $("#formInput").append(myHtml);
    numInput++;
}

var numOutput = null;
function duplicateOutput() {
  if (numOutput==null) {
    numOutput=0;
  }
  var myHtml =
    "<div class=panel-body id=outputBody"+numOutput+ ">"+
      "<div class=\"name form-group\" style=\"margin-bottom: 12px;\">"+
          "<input type=text class=form-control id=\"nameOutput"+ numOutput + "\" placeholder=\"Insert name of inputport\">"+
      "</div>"+
      "<div class=input-group style='margin-bottom: 5px;'>"+
         "<input type=text class=form-control  id=\"out-"+numOutput+"-0\""+ " value =\"\" placeholder=\"Insert interface name\">"+
         "<span class='input-group-btn'>"+
           "<button type='button' class='btn btn-default btn-add' id=\"intOut-"+numOutput+"-0\" onclick='duplicaInterfaceOutput(this)'>+</button>" +
        "</span>"+
      "</div>"+
    "</div>"+
    "<hr>";

  $("#formOutput").append(myHtml);
  numOutput++;
}

var nMicro=1;
function duplicateMicro(){
  var myHtml =
        "<div class=\"form-inline\" id=\"micro-"+nMicro+"\">"+
        "<hr>"+
          "<select class=\"form-control\" id=\"select-"+nMicro+"\" style=\"width:70%;\"></select>"+
          "<input type=\"checkbox\" value=\"\" style=\"margin-left: 15px;\" id=\"trace-"+nMicro+"\">"+
          "<label style=\" font-size: 15px;\">Trace</label>"+
          "<button class=\"btn btn-default glyphicon glyphicon-trash\" style=\"float: right; margin-right: 15px;\" onclick=\"removeMicroCnt(this)\"></button>"+
          "<input style=\"width:70%; margin-top: 10px;\" type=\"text\" class=\"form-control\" id=\"urlMicro-"+nMicro+"\" placeholder=\"GitHub URL of your microservice \">"+
        "</div>";
  $("#microContainer").append(myHtml);
  nameMicro = "select-"+nMicro;
  getMicro(nameMicro);
  nMicro++;
}

function getMicro(selectName){
  JolieClient.getMicroservice({}, function(data){
    if (data.microservices != null) {
      var select = document.getElementById(selectName);
      for (var i = 0; i < data.microservices.length; i++) {
        var opt1 = document.createElement('option');
        opt1.value = data.microservices[i].name;
        opt1.innerHTML = data.microservices[i].name;
        select.appendChild(opt1);
      };
    }
  }, console.log(""));
}

var nLink=1;
function duplicateLink(){
  var myHtml =
        "<div class=\"form-inline\" id=\"link-"+nLink+"\">"+
        "<hr>"+
          "<select class=\"form-control\" id=\"selectLink-"+nLink+"\" style=\"width:70%;\"></select>"+
          "<button class=\"btn btn-default glyphicon glyphicon-trash\" style=\"float: right; margin-right: 15px;\" onclick=\"removeLinkCnt(this)\"></button>"+
        "</div>";
  $("#linkContainer").append(myHtml);
  nameLink = "selectLink-"+nLink;
  getLink(nameLink);
  nLink++;
}


function getLink(selectName){
  JolieClient.getMicroservice({}, function(data){
    if (data.links != null) {
      var select = document.getElementById(selectName);
      for (var i = 0; i < data.links.length; i++) {
        var opt1 = document.createElement('option');
        opt1.value = data.links[i].name;
        opt1.innerHTML = data.links[i].name;
        select.appendChild(opt1);
      };
    }
  }, console.log("no microservices"));
}

function removeMicroCnt(button){
  micro = $(button).closest(".form-inline").attr("id");
  var elementSplit = micro.split("-");
  var numMicroToDelete = parseInt(elementSplit[1]);

  while (document.getElementById("micro-"+(numMicroToDelete+1))!= null) {
    $("#micro-"+(numMicroToDelete+1)).attr("id","micro-"+numMicroToDelete);
    $("#select-"+(numMicroToDelete+1)).attr("id","select-"+numMicroToDelete);
    $("#trace-"+(numMicroToDelete+1)).attr("id","trace-"+numMicroToDelete);
    $("#url-"+(numMicroToDelete+1)).attr("id","url-"+numMicroToDelete);
    numMicroToDelete++
  };
  var elementToRemove = $(button).closest(".form-inline");
  elementToRemove.remove();
  nMicro--
}

function createContainer(){
  var container = {
    microservices:[],
  };
  var microservice = {};
  var link = {};
  if (nMicro>=1) {
    for (var i = 0; i < nMicro; i++) {
      var microservice = document.getElementById("select-"+i).value;
      var trace = document.getElementById("trace-"+i).checked;
      var url = document.getElementById("urlMicro-"+i).value
      container.microservices.push({name:microservice, trace: trace, url: url});
    }
  };
  JolieClient.writeContainer(container, showDialogContainer, onError);
}

function showDialogContainer(){
  $('#newContainer').modal('hide');
  updateTableContainer();
  var myHtml =
  "<div class=\"alert alert-success alert-dismissable\">"+
    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>"+
    "<strong>Container entered successfully !</strong>"+
  "</div>";
  $(myHtml).insertBefore("#tabContentCnt");
}

function updateTableContainer(){
  if (InfoContainer != "") {
    TableInfoContainer(InfoContainer);
  }else {
    $("#tableContainer > thead").html("");
    var headTable =   "<tr>"+
        "<th class=\"col-md-2\">Num</th>"+
        "<th class=\"col-md-4\">Microservices name</th>"+
        "<th class=\"col-md-1\"></th>"+
      "</tr>";
      $('#tableContainer > thead').append(headTable);

    JolieClient.getContainer({}, function(data){

        $("#tableContainer > tbody").html("");
        if (data.containers!=null) {
        for (var i = 0; i < data.containers.length; i++) {
          var rowCnt = "<tr id=\"cnt-"+i+"\">"+
            "<td class=\"col-md-2\"><h4>"+(i+1)+"</h4></td>"+
            "<td class=\"col-md-4\">";
            for (var j = 0; j < data.containers[i].microservices.length; j++) {
              if (data.containers[i].microservices[j].trace == true) {
                rowCnt += (j+1) + " - "+ data.containers[i].microservices[j].name + "&nbsp&nbsp&nbsp<i>(trace)</i><br>";
              } else {
                rowCnt += (j+1) + " - "+ data.containers[i].microservices[j].name + "<br>";
              };
            }
            rowCnt += "</td>"+"<td class=\"col-md-1\"><button class=\"btn btn-default glyphicon glyphicon-trash\" onclick=\"removeContainer(this)\"></button></td>"+"</tr>";
            $('#tableContainer > tbody:last-child').append(rowCnt);
            rowCnt = "";
          }
        }
      }, function(){
        $("#tableContainer > tbody").html("");
      });
      }
}

function downloadJsonCnt(){
  var filepath = "containerArch.json";
  top.location.href = filepath;
}

function removeContainer(button){
  var idCnt = $(button).closest('tr').attr("id");
  var elementSplit = idCnt.split("-");
  var numCnt = parseInt(elementSplit[1]);

  JolieClient.removeContainer(numCnt,function(){
    updateTableContainer();
    var myHtml = "<div class=\"alert alert-danger alert-dismissable\">"+
      "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">×</a>"+
      "<strong>Container removed!</strong>"+
    "</div>";
    $(myHtml).insertBefore("#tabContentCnt");
  },onError);
}

var InfoContainer;
function startContainer(){
  JolieClient.createLinks({}, function(){
  $('#downloadBtn').attr('disabled', false);
  $('#createCnt').attr('disabled', true);
  $('#startContainer').attr('disabled', true);
  $('#resetContainer').attr('disabled', false);
  alert("CLOSE this and open your terminal");
  JolieClient.orchestratorContainer({},function(data){
    TableInfoContainer(data);
    InfoContainer = JSON.parse(JSON.stringify(data));
    console.log(InfoContainer);
  }, onError);
  }, onError);
}

function TableInfoContainer(data){
  $("#tableContainer > tbody").html("");
  $("#tableContainer > thead").html("");
    $('#downloadBtn').attr('disabled', false);
    $('#createCnt').attr('disabled', true);
    $('#startContainer').attr('disabled', true);
    $('#resetContainer').attr('disabled', false);
    var headTable =   "<tr>"+
        "<th class=\"col-md-4\">Container name</th>"+
        "<th class=\"col-md-3\">Microservices name</th>"+
        "<th class=\"col-md-2\">Port exposed</th>"+
        "<th class=\"col-md-2\">Ip</th>"+
        "<th class=\"col-md-2\">State</th>"+
        "<th class=\"col-md-1\"></th>"+
      "</tr>";
      $('#tableContainer > thead').append(headTable);

    if (data.containers!=null) {
    for (var i = 0; i < data.containers.length; i++) {
      var rowCnt = "<tr id=\""+data.containers[i].id+"\">"+
        "<td class=\"col-md-4\">"+data.containers[i].name+"</td>"+
        "<td class=\"col-md-3\">";
        for (var j = 0; j < data.containers[i].microservices.length; j++) {
            rowCnt += (j+1) + " - "+ data.containers[i].microservices[j].name + "<br>";
        }
        rowCnt += "</td><td class=\"col-md-2\">";
        if (data.containers[i].bindings != null) {
        for (var k = 0; k < data.containers[i].bindings.length; k++) {
            rowCnt +=  data.containers[i].bindings[k] + "<br>";
          }
        }
        rowCnt += "</td>"+"<td class=\"col-md-2\">"+data.containers[i].ip+"</td>";
        rowCnt += "</td>"+"<td class=\"col-md-2\">"+data.containers[i].state+"</td>"+
        "<td class=\"col-md-1\">";
        if (data.containers[i].state == "Up") {
          rowCnt+= "<button style= \"margin:3px; \"class=\"btn btn-danger glyphicon glyphicon-stop\"onclick=\"stopContainer(this)\"></button></tr>";
        } else {
          rowCnt+="<button style= \"margin:3px; \"class=\"btn btn-success glyphicon glyphicon-play\"onclick=\"restartContainer(this)\"></button></td></tr>";
        }
        $('#tableContainer > tbody:last-child').append(rowCnt);
        rowCnt = "";
      }
    }
}

function stopContainer(button){
  idCnt = $(button).closest('tr').attr("id");
  JolieClient.stopContainer(idCnt,function(){
    JolieClient.getContainerCreated({},function(data){
      InfoContainer = data;
      TableInfoContainer(InfoContainer);
    },onError)
  },onError)
}

function restartContainer(button){
  idCnt = $(button).closest('tr').attr("id");
  JolieClient.restartContainer(idCnt,function(){
    JolieClient.getContainerCreated({},function(data){
      InfoContainer = data;
      TableInfoContainer(InfoContainer);
    },onError)
  },onError)
}

function resetContainer(){
  JolieClient.resetSystem({},function(){
    InfoContainer = "";
    updateTableContainer();
    $('#downloadBtn').attr('disabled', true);
    $('#createCnt').attr('disabled', false);
    $('#startContainer').attr('disabled', false);
    $('#resetContainer').attr('disabled', true);
  },onError)
}
