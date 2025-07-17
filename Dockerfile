FROM openjdk:17-alpine
EXPOSE 7777
ADD target/Room-Rental-Service-0.0.1-SNAPSHOT.jar Room-Rental-Service-0.0.1-SNAPSHOT.jar
ENTRYPOINT["java","-jar", "/Room-Rental-Service-0.0.1-SNAPSHOT.jar"]
