type OrchestratorContainerResponse: void{
  .containers[0,*]:void{
    .name: string
    .state: string
    .id: string
    .ip: string
    .microservices[0,*]:void{
      .name:string
    }
    .bindings[0,*]:string
  }
}


interface OrchestratorInterface {
  RequestResponse:
    orchestratorContainer(void)(OrchestratorContainerResponse),
    getContainerCreated(void)(OrchestratorContainerResponse),
    stopContainer(string)(void),
    restartContainer(string)(void),
    resetSystem(void)(void)
}
