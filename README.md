# Assignments API

Sonyl Nagale <sonyl@nagale.com>

## Problem Statement

**Context**:

As part of our vision for Platform as a Service (PaaS),  we need to create well designed APIs that follow design best practices around and not restricted to

- RESTful URLs

- Error Handling/ Status Codes

- Versioning

- Documentation


**Assignment**

Create a simple dockerized service for managing and serving assignments

1. Create a simple object model for an assignment (id, name, title, description, type, duration etc.). Assignment can contain 1 or more tags (array of strings).

2. Add endpoints to

   a. Create an assignment

   b. Get an assignment by id

   c. Search assignments by tags

3. Use any standard to generate api documentation (apidoc, swagger etc.)



4. Please also build a simple front-end (any look & feel you like) that can be used to create an assignment and search an assignment by tag using the APIs above.



You can use any technology of your choice (coding language and db).  


**Reference**:


Apidoc: http://apidocjs.com

Swagger: https://swagger.io/

API Best Practices :

https://docs-apis.apigee.io/files/Web-design-the-missing-link-ebook-2016-11.pdf


**Submission**:

You can submit the code in a GithHub repo and send us a link.


## Running the Solution

1. `git clone` this repository.
1. `cd` into the repository directory.
1. Ensure that Docker is started with `docker info`.
1. Create the Docker image from the Dockerfile:  `docker build -t sonylnagale/kaplan-api .`.
1. Run the Docker image: `docker run -p 49160:8081 -p 49161:3000 -d sonylnagale/kaplan-api`.
1. Access the front-end at: `http://localhost:49161`.
1. API documentation is at: `http://localhost:49161/docs/`
