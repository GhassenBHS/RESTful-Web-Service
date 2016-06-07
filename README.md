# RESTful-Web-Service
This project is a restful web service developped using node js. It implements OAUTH 2.0 and uses asychronous calls to a noSQL database via bluebird. I used the basics of a rest web service presented by Valentin Bojinov in his book Restful web API Design with node.js . My contribution was the implementation of OAUTH 2.0  and asynchronous calls to the database

Versionning is one basic feature a restful web service. In this project, there are 2 versions. 
V1 contains the basic routing. V2 is much
more evolved. It contains the implementation of OAUTH 2.0 (third party authentication) and asynchronous calls to a noSQL database.
In the project cert.pem and key.pem are empty. You should get public and private key in order to use HTTPS. 
Facebook always returned anempty response. it was driving me crazy until i used https. 
This work was done in a context of an IOT project to practise the service layer.
