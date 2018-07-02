/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                                                    *
* Copyright (C) 2017 Matteo Marchesini <matteo.marchesini12@studio.unibo.it>         *
* Copyright (C) 2018 Pietro Danza <pietro.danza@studio.unibo.it>                     *
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

include "json_utils.iol"
include "string_utils.iol"
include "console.iol"
include "file.iol"
include "exec.iol"
include "InterfaceAPI.iol"
include "OrchestratorInterface.iol"
include "metajolie.iol"
include "time.iol"

execution{ concurrent }

outputPort Jocker {
Location: "socket://localhost:8008"
Protocol: sodep
Interfaces: InterfaceAPI
}

inputPort OrchestratorPort {
Location: "local"
Protocol: http {.format->format; .default="default"}
Interfaces: OrchestratorInterface
}

init
{
  global.containers = ""
}

main
{
  [ orchestratorContainer(request)(responseContainer){
    //read jsonFile of container system architecture
    file.filename = "./www/containerArch.json";
    file.format = "json";
    readFile@File(file)(responseC);
    createContainerTrace=false;

    //read jsonFile of microservice system architecture
    fileM.filename = "./www/microservicesArch.json";
    fileM.format = "json";
    readFile@File(fileM)(responseM);

    //freshname of container
    println@Console( "\n**************************** JoArch ****************************\n" )();
    println@Console( "\nNUM CONTAINERS: " + #responseC.containers+"\n" )();

    //Obtain JDEP_LOCATION
    for (z=0, z<#responseM.links, z++) {
      nameIn = responseM.links[z].inputMicroservice[0].name[0];
      portNameIn = responseM.links[z].inputMicroservice[0].portName[0];
        jdepIn = "JDEP_LOCATION_"+nameIn+"_"+ portNameIn;
      port = "1000"+z;
      arrLocation.(jdepIn).location = "socket://localhost:"+port;
      if( arrInput.(nameIn).portName[0] != null ) {
        length = #arrInput.(nameIn).portName;
        arrInput.(nameIn).portName[length] = portNameIn;
        arrInput.(nameIn).numPort[length] = port
      } else {
        length = 0;
        arrInput.(nameIn).portName[length] = portNameIn;
        arrInput.(nameIn).numPort[length] = port
      }
    };
    for (z=0, z<#responseM.links, z++) {
      nameIn = responseM.links[z].inputMicroservice[0].name[0];
      portNameIn = responseM.links[z].inputMicroservice[0].portName[0];
      nameOut = responseM.links[z].outputMicroservice[0].name[0];
      portNameOut = responseM.links[z].outputMicroservice[0].portName[0];
      jdepOut = "JDEP_LOCATION_"+nameOut+"_"+ portNameOut;
      for ( i=0, i<#arrInput.(nameIn).portName, i++ ) {
        if( arrInput.(nameIn).portName[i] == portNameIn ) {
          port = arrInput.(nameIn).numPort[i];
          arrLocation.(jdepOut).location = "socket://localhost:"+port
        }
      }
    };

    network.Name = "SystemNetwork";
    network.IPAM.Config[0].Subnet = "172.18.0.0/16";
    flag = false;
    print@Console( "CREATING NETWORK . . . " )();
    {
      {
      createNetwork@Jocker(network)(response);
      flag = true;
      println@Console( "\n\nNETWORK CREATED - " + network.Name + "\n")()
      }|
      {
        while( flag == false ) {
          print@Console(". ")();
          sleep@Time(1000)()
        }
      }
    };
    networkId = response.Id;
    for ( i=0, i<#responseC.containers, i++ ) {
      global.freshname = new;
      container -> responseC.containers[i];
      println@Console( "\n----------------------------------------------------------------\n" )();
      println@Console( "CONTAINER "+ (i+1) + "\tNUM MICROSERVICE: " +  #container.microservices + "\n")();
      num = 21 +i;
      ipContainer = "172.18.0."+num;
      cntName = global.freshname +"-CNT-"+(i+1);
      //initialize launcherMain.sh
      generalLauncher.filename = "launcherMain.sh";
      launcherJSON.filename = "launcherJSON.sh";
      launcherJSON.content = "jolie /microservices/findJson.ol\n";
      createFindJson=false;
      //initialize dockerFile
      dockerFile.filename = "dockerFile"+i;
      dockerFile.content = "" +
      "FROM jolielang/joliejtracer\n"+
      "RUN apt-get update\n"+
      "RUN apt-get --yes install git\n"+
      "WORKDIR /microservices/\n"+
      "COPY ./Script/get_locations.sh get_locations.sh\n";
      //initialize tar file
      cmdTar = "tar -cf " + cntName + ".tar ./Script/get_locations.sh ";
      exec@Exec(cmdTar)( response );
      cntInput = 0;
      for ( j=0, j< #container.microservices, j++ ) {
        nameMicroservice = container.microservices[j].name[0];
        arrCnt.(cntName).microservices[j].name = nameMicroservice;
        url = container.microservices[j].url[0];
        dockerFile.content += "WORKDIR /microservices/\n"+
        "RUN git clone "+ url + "\n";

        launcherFile.filename = "launcher"+nameMicroservice+".sh";
        launcherFile.content = "sh /microservices/get_locations.sh > /microservices/"+ nameMicroservice+"/locations.iol\n";
        // run microservices with --trace:json
        if( container.microservices[j].trace[0] =="true") {
          createContanerTrace=true;
          createFindJson=true;
          launcherFile.content +="jolie --trace:json microservices/"+nameMicroservice+"/"+nameMicroservice+".ol\n"
        }else if (container.microservices[j].trace[0]=="false"){

          launcherFile.content +="jolie microservices/"+nameMicroservice+"/"+nameMicroservice+".ol\n"
        };


        writeFile@File(launcherFile)( );
        launcherFile.content = "";

        if( j == #container.microservices-1 ) {
          generalLauncher.content += "sh /microservices/"+nameMicroservice+"/"+launcherFile.filename + "& sh /microservices/" + launcherJSON.filename
        }else {
          generalLauncher.content += "sh /microservices/"+nameMicroservice+"/"+launcherFile.filename  + " & "
        };

        dockerFile.content += "COPY " + launcherFile.filename + " /microservices/"+ nameMicroservice+"/\n";
        cmdTarAppend = "tar --append --file="+ cntName+ ".tar "+ launcherFile.filename + " ";
        exec@Exec(cmdTarAppend)( response );

        command = "rm " + launcherFile.filename;
        exec@Exec(command)(response);

        println@Console( "\tMICROSERVICE-"+(j+1) +": " + nameMicroservice )();
        for (z=0, z< #container.links, z++){
          nameLink = container.links[z].name[0];
          for (l=0, l<#responseM.links, l++){
            linkToCompare -> responseM.links[l];
            if( nameLink == linkToCompare.name[0]) {
              if( nameMicroservice == linkToCompare.inputMicroservice[0].name[0] ) {
                for ( d=0, d<#arrInput.(nameMicroservice).portName, d++ ) {
                  if( arrInput.(nameMicroservice).portName[d] == linkToCompare.inputMicroservice[0].portName[0] ) {
                    portInput = arrInput.(nameMicroservice).numPort[d];
                    dockerFile.content += "EXPOSE " + portInput + "\n";
                    arrCnt.(cntName).bindings[cntInput] = portInput;
                    cntInput = cntInput+1;
                    arrInput.(nameMicroservice).ip = ipContainer;
                    println@Console("\t\t INPUT\tLINK: " + linkToCompare.name[0])()
                }
              }
              }else if( nameMicroservice == responseM.links[l].outputMicroservice[0].name[0] ) {
                  println@Console("\t\t OUTPUT\tLINK: " + linkToCompare.name[0])()
                }
              }
            }
          }
        };
        //write launcherMain
        writeFile@File(generalLauncher)();
        generalLauncher.content = "";

        writeFile@File(launcherJSON)();
        launcherJSON.content = "";

        dockerFile.content +="COPY findJson.ol findJson.ol\n" +
        "COPY " + launcherJSON.filename + " /microservices/\n";
        cmdTarAppend2 = "tar --append --file="+ cntName+".tar " + "findJson.ol" + " " + launcherJSON.filename + " ";
        exec@Exec(cmdTarAppend2)( response );

        dockerFile.content += "COPY " + generalLauncher.filename + " /microservices/\n"+
        "CMD sh /microservices/" + generalLauncher.filename +"\n";

        writeFile@File(dockerFile)( );
        dockerFile.content = "";
        cmdTarAppend2 = "tar --append --file="+ cntName+".tar " + generalLauncher.filename + " " + dockerFile.filename + " ";
        exec@Exec(cmdTarAppend2)( response );

        fileTar.filename = cntName+".tar";
        fileTar.format = "binary";
        readFile@File( fileTar)( rqImg.file);

        rqImg.t = global.freshname + ":latest";
        rqImg.dockerfile = dockerFile.filename;

        arrCnt.(cntName).Ip = ipContainer;
        arrCnt.(cntName).Image = global.freshname;

        build@Jocker( rqImg )( responseBuild );
        println@Console("\n\tIMAGE  CREATED: "+ rqImg.t )( );


        command2 = "rm " + dockerFile.filename + " && rm "+fileTar.filename +
        " && rm " + generalLauncher.filename + " && rm " + launcherJSON.filename;
        exec@Exec(command2)( response )
    };
    println@Console( "\n----------------CREATION AND STARTING CONTAINERS----------------\n" )();

    for ( k=0, k<#responseC.containers, k++ ) {
      container -> responseC.containers[k];
      for ( c=0, c<#container.microservices, c++ ) {
        nameMicroservice = container.microservices[c].name[0];
        for (z=0, z< #container.links, z++){
          nameLink = container.links[z].name[0];
          for (l=0, l<#responseM.links, l++){
            linkToCompare -> responseM.links[l];
            if( nameLink == linkToCompare.name[0]) {
              if( nameMicroservice == linkToCompare.outputMicroservice[0].name[0] ) {
                inputMicro = linkToCompare.inputMicroservice[0].name[0];
                portMicro =  linkToCompare.inputMicroservice[0].portName[0];
                for ( d=0, d<#arrInput.(inputMicro).portName, d++ ) {
                  if( arrInput.(inputMicro).portName[d] == portMicro ) {
                    portInput = arrInput.(inputMicro).numPort[d];
                    portOutput = linkToCompare.outputMicroservice[0].portName[0];
                    ipContainer = arrInput.(inputMicro).ip;
                    location = "JDEP_LOCATION_"+ nameMicroservice+"_"+portOutput;
                    arrLocation.(location).location = "socket://" + ipContainer +":"+ portInput
                  }
                }
              }
            }
          }
        }
      }
    };

    //create Container for trace
    if(createContanerTrace){

      launcherTrace.filename = "launcherTrace.sh";
      launcherJson.filename = "launcherJson.sh";
      launcher.filename = "launcher.sh";
      dockerfileTracer.filename="dockerfile";

      dockerfileTracer.content = "" +
      "FROM jolielang/joliejtracer\n"+
      "EXPOSE 8500\n"+
      "EXPOSE 9000\n"+
      "COPY leonardo-master leonardo-master\n" +
      "WORKDIR /leonardo-master/\n"+
      "COPY " + launcherTrace.filename + " " + launcherTrace.filename + "\n" +
      "COPY " + launcherJson.filename + " " + launcherJson.filename + "\n" +
      "COPY " + launcher.filename + " " + launcher.filename + "\n" +
      "WORKDIR /leonardo-master/traceJson/\n"+
      "COPY writeJson.ol writeJson.ol\n"+
      "WORKDIR /leonardo-master/\n";


      launcherTrace.content = "jolie /leonardo-master/main.ol";
      writeFile@File(launcherTrace)();
      launcherTrace.content = "";

      launcherJson.content = "jolie /leonardo-master/traceJson/writeJson.ol";
      writeFile@File(launcherJson)();
      launcherJson.content = "";

      launcher.content = "sh /leonardo-master/"+launcherTrace.filename + " & sh /leonardo-master/" + launcherJson.filename;
      writeFile@File(launcher)();
      launcher.content = "";

      dockerfileTracer.content += "CMD sh "+launcher.filename+"\n";
      writeFile@File(dockerfileTracer)();
      dockerfileTracer.content = "";

      rqImgT.t = "jtracer-img";
      rqImgT.dockerfile = dockerfileTracer.filename;

      cmdTarCreate = "tar -cf leonardo.tar leonardo-master";
      exec@Exec(cmdTarCreate)( response );
      cmdTarAppendT = "tar --append --file=leonardo.tar "+ dockerfileTracer.filename + " writeJson.ol " + launcherTrace.filename +
      " " + launcherJson.filename + " " + launcher.filename + " ";
      exec@Exec(cmdTarAppendT)( response );

      fileTarTrace.filename= "leonardo.tar";
      fileTarTrace.format = "binary";
      readFile@File(fileTarTrace)(rqImgT.file);

      build@Jocker(rqImgT)(resopnseImg);
      println@Console("\n\tIMAGE  CREATED: "+ rqImgT.t )( );

      commandT = "rm " + dockerfileTracer.filename + " && rm "+fileTarTrace.filename + " && rm " + launcher.filename
      + " && rm " + launcherJson.filename+ " && rm " + launcherTrace.filename;
      exec@Exec(commandT)( response );


      rqCntT.name = "jtrace-cnt";
      rqCntT.Image = rqImgT.t;
      rqCntT.NetworkingConfig.EndpointsConfig.SystemNetwork.IPAMConfig.NetworkID = networkId;
      ipT = "172.18.0.20";
      rqCntT.NetworkingConfig.EndpointsConfig.SystemNetwork.IPAMConfig.IPv4Address = ipT;
      rqCntT.HostConfig.PortBindings.("8500/tcp")._.HostPort = "8500";
      rqCntT.HostConfig.PortBindings.("9000/tcp")._.HostPort = "9000";

      createContainer@Jocker(rqCntT)(responseCnt);
      println@Console("\tCONTAINER CREATED: "+ rqCntT.name )( );

      crqT.id = rqCntT.name;
      startContainer@Jocker( crqT )( responseStart );
      println@Console("\tCONTAINER STARTED: "+ crqT.id + "\n" )( )
    };

    //CREATE AND START ALL CONTAINER
    i=0;
    foreach ( x : arrLocation ) {
      rqCnt.Env[i] = x + "=" + arrLocation.(x).location;
      i = i+1
    };

    foreach ( cnt : arrCnt ) {
      for ( i=0, i<#arrCnt.(cnt).bindings, i++ ) {
          rqCnt.HostConfig.PortBindings.(arrCnt.(cnt).bindings[i]+"/tcp")._.HostPort = arrCnt.(cnt).bindings[i]
      };

      rqCnt.name = cnt;
      rqCnt.Image = arrCnt.(cnt).Image;
      rqCnt.NetworkingConfig.EndpointsConfig.SystemNetwork.IPAMConfig.NetworkID = networkId;
      ip = arrCnt.(cnt).Ip;
      rqCnt.NetworkingConfig.EndpointsConfig.SystemNetwork.IPAMConfig.IPv4Address =  ip;

      createContainer@Jocker( rqCnt )( responseCreate );
      println@Console("CONTAINER CREATED: "+ rqCnt.name )( );
      arrCnt.(cnt).Id = responseCreate.Id;
      crq.id = rqCnt.name;
      startContainer@Jocker( crq )( responseStart );
      println@Console("CONTAINER STARTED: "+ crq.id + "\n" )( )
    };

    k=0;
    foreach ( child : arrCnt ) {
      responseContainer.containers[k].state << "Up";
      responseContainer.containers[k].name << child;
      responseContainer.containers[k].ip << arrCnt.(child).Ip;
      responseContainer.containers[k].id << arrCnt.(child).Id;
      for (i=0, i<#arrCnt.(child).microservices, i++ ) {
          responseContainer.containers[k].microservices[i].name << arrCnt.(child).microservices[i].name
      };
      for ( z=0, z<#arrCnt.(child).bindings, z++ ) {
        responseContainer.containers[k].bindings[z] << arrCnt.(child).bindings[z]
      };

      k++
    };
    global.containers << responseContainer

  }]

  [getContainerCreated(request)(response){
      response << global.containers
  }]

  [stopContainer(request)(response){
    containerStop.id = request;
    println@Console( containerStop.id )();
    for ( i=0, i<#global.containers.containers, i++ ) {
      if( global.containers.containers[i].id == containerStop.id  ) {
        println@Console( global.containers.containers[i].id )();
        global.containers.containers[i].state << "Exited"
      }
    };
    stopContainer@Jocker(containerStop)(responseJocker);
    println@Console( responseJocker.message )()
  }]

  [restartContainer(request)(response){
    cntStart.id = request;
    println@Console( cntStart.id )();
    for ( i=0, i<#global.containers.containers, i++ ) {
      if( global.containers.containers[i].id == cntStart.id  ) {
        println@Console( global.containers.containers[i].id )();
        global.containers.containers[i].state << "Up";
        println@Console( global.containers.containers[i].state )()
      }
    };
    startContainer@Jocker(cntStart)(responseJocker);
    println@Console( responseJocker.message )()
  }]

  [resetSystem(request)(response){
      for ( i=0, i<#global.containers.containers, i++ ) {
        cntToRemove.id = global.containers.containers[i].id;
        if( global.containers.containers[i].state == "Up" ) {
          stopContainer@Jocker(cntToRemove)(message)
        }
      };

      for ( i=0, i<#global.containers.containers, i++ ) {
        cntToRemove.id = global.containers.containers[i].id;
        removeContainer@Jocker(cntToRemove)(message)
      };

      network.id = "SystemNetwork";
      removeNetwork@Jocker(network)(response);

      global.containers = ""
  }]


}
