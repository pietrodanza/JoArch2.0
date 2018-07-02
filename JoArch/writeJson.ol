include "file.iol"
include "console.iol"

interface JsonInterface {
RequestResponse: sendJson(string)(string)
OneWay:
}

inputPort JsonIn {
Location: "socket://localhost:8500"
Protocol: sodep
Interfaces: JsonInterface
}
execution{sequential}
init
{
  global.i=0
}
main
{
  [sendJson(request)(response){
      println@Console(request)();
      file.content = request;
      file.filename = global.i + "_trace.json";
      file.format = "json";
      writeFile@File(file)(responseF);
    response = "arrivato";
    global.i++
  }]
}
