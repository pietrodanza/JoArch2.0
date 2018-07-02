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
	if ( #rgas == 0 ) {
		 println@Console("Usage: jolie clientLogs container-id")()
	};
	rq.id=args[ 0 ];
	rq.follow = true;
	rq.stderr = true;
	rq.stdout = true;
	rq.since = 1428990821;
	rq.timestamps = true;
	rq.tail = "all";
	println@Console("***** RETURN THE LOGS OF "+ rq.id +" CONTAINER *****")();
	logs@DockerIn(rq)(response);
	valueToPrettyString@StringUtils( response )( s );
	println@Console( s )()
}
