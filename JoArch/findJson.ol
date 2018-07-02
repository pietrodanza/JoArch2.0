include "console.iol"
include "file.iol"
include "string_utils.iol"

interface JsonInterface {
RequestResponse: sendJson(string)(string)
OneWay:
}

outputPort JsonOut {
Location: "socket://172.18.0.20:8500"
Protocol: sodep
Interfaces: JsonInterface
}

main
{
        workdir = "/microservices/";
        json.directory = workdir;
        json.regex = ".*\\_trace.json";
        list@File(json)(response);
        for ( i=0, i<#response.result, i++ ) {
          file.filename = response.result[i];
          readFile@File(file)(responseR);
          sendJson@JsonOut(responseR)(risposta);
          println@Console( risposta )()
        }
}
