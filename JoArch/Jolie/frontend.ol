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


define writeCntJson
{
  for ( i=0, i<#cntArr.containers, i++) {
    for ( j=0, j<#cntArr.containers[i].microservices, j++ ) {
      cntArrJson.containers._[i].microservices._[j].name = cntArr.containers[i].microservices[j].name;
      cntArrJson.containers._[i].microservices._[j].trace = cntArr.containers[i].microservices[j].trace;
      cntArrJson.containers._[i].microservices._[j].url = cntArr.containers[i].microservices[j].url
    };
    for ( z=0, z<#cntArr.containers[i].links, z++ ) {
      cntArrJson.containers._[i].links._[z].name = cntArr.containers[i].links[z].name
    }
  }
}

define writeJson
{
  for (l=0, l <#microArr.microservices, l++ ) {
      microArrJson.microservices._[l].name = microArr.microservices[l].name;

    if( #microArr.microservices[l].inputPort >0 ) {
      for ( i=0, i<#microArr.microservices[l].inputPort, i++) {
        microArrJson.microservices._[l].inputPort._[i].name[0] = microArr.microservices[l].inputPort[i].name[0];
        for ( j=0, j<#microArr.microservices[l].inputPort[i].interfaces, j++ ) {
          microArrJson.microservices._[l].inputPort._[i].interfaces._[j].name[0] = microArr.microservices[l].inputPort[i].interfaces[j].name[0]
        }
      }
    };


  if( #microArr.microservices[l].outputPort >0 ) {
    for ( z=0, z<#microArr.microservices[l].outputPort, z++) {
      microArrJson.microservices._[l].outputPort._[z].name[0] = microArr.microservices[l].outputPort[z].name[0];
      for ( k=0, k<#microArr.microservices[l].outputPort[z].interfaces, k++ ) {
          microArrJson.microservices._[l].outputPort._[z].interfaces._[k].name[0] = microArr.microservices[l].outputPort[z].interfaces[k].name[0]
      }
    }
  }

  };

  for ( i=0, i<#microArr.links, i++ ) {
    microArrJson.links._[i].name = microArr.links[i].name;
    microArrJson.links._[i].inputMicroservice.name = microArr.links[i].inputMicroservice.name;
    microArrJson.links._[i].inputMicroservice.portName = microArr.links[i].inputMicroservice.portName;
    microArrJson.links._[i].outputMicroservice.name = microArr.links[i].outputMicroservice.name;
    microArrJson.links._[i].outputMicroservice.portName = microArr.links[i].outputMicroservice.portName
  }
}

main
{
    [ writeMicroservice(request)(response){
        scope( FileNotFoundHandler )
        {
          install( FileNotFound =>
            length = 0
          );
          readfile.filename = "./www/microservicesArch.json";
          readfile.format = "json";
          readFile@File(readfile)(microArr);
          length = #microArr.microservices
        };

        microArr.microservices[length] << request;
        writeJson;
        getJsonString@JsonUtils(microArrJson)(responseJson);
        file.filename = "./www/microservicesArch.json";
        file.content =  responseJson;
        writeFile@File(file)(response)
    }]

  [ getMicroservice(request)(microserviceRespost){
      readfile.filename = "./www/microservicesArch.json";
      readfile.format = "json";
      readFile@File(readfile)(microserviceRespost)
  }]

  [ writeLink(request)(response){
      readfile.filename = "./www/microservicesArch.json";
      readfile.format = "json";
      readFile@File(readfile)(microArr);
      length = #microArr.links;
      microArr.links[length] << request;
      writeJson;
      getJsonString@JsonUtils(microArrJson)(responseJson);
      file.filename = "./www/microservicesArch.json";
      file.content =  responseJson;
      writeFile@File(file)(response)
  }]

  [ writePath(request)(response){
      path = request
  }]

  [removeMicroservice(request)(response){
      microToRemove = request;
      readfile.filename = "./www/microservicesArch.json";
      readfile.format = "json";
      readFile@File(readfile)(arrToDelete);
      //search microservice
      i=0;
      for ( j=0, j<#arrToDelete.microservices, j++ ) {
          if( arrToDelete.microservices[j].name != microToRemove ) {
            microArr.microservices[i] << arrToDelete.microservices[j];
            i++
          }
      };

      for ( z=0, z<#arrToDelete.links, z++ ) {
        microArr.links[z] << arrToDelete.links[z]
      };

      writeJson;
      getJsonString@JsonUtils(microArrJson)(responseJson);
      file.filename = "./www/microservicesArch.json";
      file.content =  responseJson;
      writeFile@File(file)(response)
  }]

  [ removeLink(request)(response){
      linkToRemove = request;
      readfile.filename = "./www/microservicesArch.json";
      readfile.format = "json";
      readFile@File(readfile)(arrToDelete);
      //search microservice
      i=0;
      for ( j=0, j<#arrToDelete.links, j++ ) {
        if( arrToDelete.links[j].name != linkToRemove ) {
          microArr.links[i] << arrToDelete.links[j];
          i++
        }
      };

      for ( z=0, z<#arrToDelete.microservices, z++ ) {
        microArr.microservices[z] << arrToDelete.microservices[z]
      };

      writeJson;
      getJsonString@JsonUtils(microArrJson)(responseJson);
      file.filename = "./www/microservicesArch.json";
      file.content =  responseJson;
      writeFile@File(file)(response)
  }]

  [ writeContainer(request)(response){
      scope( FileNotFoundHandler )
      {
        install( FileNotFound =>
          length = 0
        );
        readfile.filename = "./www/containerTmp.json";
        readfile.format = "json";
        readFile@File(readfile)(cntArr);
        length = #cntArr.containers
      };
      cntArr.containers[length] << request;
      writeCntJson;
      getJsonString@JsonUtils(cntArrJson)(responseJson);
      file.filename = "./www/containerTmp.json";
      file.content =  responseJson;
      writeFile@File(file)(response)
  }]

  [ getContainer(request)(containerRespost){
      readfile.filename = "./www/containerTmp.json";
      readfile.format = "json";
      readFile@File(readfile)(containerRespost)
  }]

  [ removeContainer(request)(response){
    cntToRemove = request;
    readfile.filename = "./www/containerTmp.json";
    readfile.format = "json";
    readFile@File(readfile)(arrToDelete);

    i=0;
    for ( j=0, j<#arrToDelete.containers, j++ ) {
      if( j != request ) {
        cntArr.containers[i] << arrToDelete.containers[j];
        i++
      }
    };
    writeCntJson;
    getJsonString@JsonUtils(cntArrJson)(responseJson);
    file.filename = "./www/containerTmp.json";
    file.content =  responseJson;
    writeFile@File(file)(response)
  }]

  [createLinks(request)(response){
    readfile.filename = "./www/containerTmp.json";
    readfile.format = "json";
    readFile@File(readfile)(cntArr);

    readfile.filename = "./www/microservicesArch.json";
    readfile.format = "json";
    readFile@File(readfile)(arrMicro);


    for ( i=0, i<#cntArr.containers, i++ ) {
      numLink = 0;
      container -> cntArr.containers[i];
      for ( z=0, z<#arrMicro.links, z++ ) {
        linkName = arrMicro.links[z].name[0];
        inputMicroservice = arrMicro.links[z].inputMicroservice[0].name[0];
        outputMicroservice = arrMicro.links[z].outputMicroservice[0].name[0];
        for ( j=0, j< #container.microservices, j++ ) {
          nameMicroservice = container.microservices[j].name[0];
          if( (nameMicroservice == inputMicroservice) &&(nameMicroservice!=outputMicroservice) ) {
            if( #container.microservices==1 ) {
              cntArr.containers[i].links[numLink].name[0] = linkName;
              numLink++
            }else{
              for ( k=0, k<#container.microservices, k++  ) {
                nameMicroOutput = container.microservices[k].name[0];
                if( (nameMicroOutput != outputMicroservice) &&(nameMicroOutput != nameMicroservice)) {
                  cntArr.containers[i].links[numLink].name[0] = linkName;
                  numLink++
                }
              }
            }
          } else if( (nameMicroservice == outputMicroservice) && (nameMicroservice!=inputMicroservice) ) {
            if( #container.microservices ==1 ) {
              cntArr.containers[i].links[numLink].name[0] = linkName;
              numLink++
            }else {
              for ( l=0, l< #container.microservices, l++  ) {
                nameMicroInput = container.microservices[l].name[0];
                if( (nameMicroInput != inputMicroservice)&&(nameMicroInput != nameMicroservice)) {
                  cntArr.containers[i].links[numLink].name[0] = linkName;
                  numLink++
                }
              }
            }
          }
        }
      }
    };
    writeCntJson;
    getJsonString@JsonUtils(cntArrJson)(responseJson);
    file.filename = "./www/containerArch.json";
    file.content =  responseJson;
    writeFile@File(file)(response)
    }]

}
