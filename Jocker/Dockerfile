FROM ubuntu:16.04
FROM openjdk:8
MAINTAINER Claudio Guidi <guidiclaudio@gmail.com>
FROM jolielang/jolie
WORKDIR /jocker
COPY dockerAPI.ol dockerAPI.ol
COPY InterfaceAPI.iol InterfaceAPI.iol
COPY config.ini config.ini
RUN apt-get update
RUN apt-get --yes install libunixsocket-java
RUN mkdir /usr/lib64
RUN mkdir /usr/lib64/libmatthew-java
RUN cp /usr/lib/jni/libunix-java.so /usr/lib64/libmatthew-java
CMD jolie dockerAPI.ol
