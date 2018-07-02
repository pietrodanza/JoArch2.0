include "console.iol"
include "string_utils.iol"
include "json_utils.iol"

include "../InterfaceAPI.iol"

outputPort DockerIn {
	Location: "socket://localhost:8008"
	Protocol: sodep
	Interfaces: InterfaceAPI
}

main {
	rq.name = "0c23d08df18b";
	rq.force = true;
	println@Console("***** REMOVE "+ rq.name +" IMAGE *****")();
	removeImage@DockerIn(rq)(response);
	valueToPrettyString@StringUtils( response )( s );
	println@Console( s )()
}
