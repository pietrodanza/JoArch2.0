type WriteMicroserviceRequest:void{
  .name: string
  .inputPort[0,*]: void
  {
    .name: string
    .interfaces[0,*]:void
    {
      .name: string
    }
  }
  .outputPort[0,*]: void
  {
    .name: string
    .interfaces[0,*]:void
    {
      .name: string
    }
  }
}

type GetMicroserviceRespost: void{
  .microservices[0,*]:void
  {
    .name: string
    .inputPort[0,*]: void
    {
      .name: string
      .interfaces[0,*]:void
      {
        .name: string
      }
    }
    .outputPort[0,*]: void
    {
      .name: string
      .interfaces[0,*]:void
      {
        .name: string
      }
    }
  }
  .links[0,*]:void
  {
    .name: string
    .inputMicroservice: void {
      .name: string
      .portName: string
    }
    .outputMicroservice: void {
      .name: string
      .portName: string
    }
  }
}

type WriteLinkRequest: void {
  .name: string
  .inputMicroservice: void {
    .name: string
    .portName: string
  }
  .outputMicroservice: void {
    .name: string
    .portName: string
  }
}

type WriteContainerRequest: void {
  .microservices[0,*]: void
  {
    .name: string
    .trace: bool
    .url: string
  }
  /*
  .links[0,*]: void
  {
    .name:string
  }*/
}

type GetContainerRespost: void{
  .containers[0,*]: void
  {
    .microservices[0,*]: void
    {
      .name: string
      .trace: bool
      .url: string
    }
    .links[0,*]:void
    {
      .name:string
    }
  }
}

interface FrontendInterface {
  RequestResponse:
    writeMicroservice(WriteMicroserviceRequest)(void),
    getMicroservice(void)(GetMicroserviceRespost),
    writeLink(WriteLinkRequest)(void),
    writePath(string)(void),
    removeMicroservice(string)(void),
    removeLink(string)(void),
    writeContainer(WriteContainerRequest)(void),
    getContainer(void)(GetContainerRespost),
    removeContainer(string)(void),
    createLinks(void)(void),
}
