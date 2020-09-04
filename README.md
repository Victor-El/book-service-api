# API Docs

### Creating a user

There can be two types of users - A regular user or an admin user

#### How to create a user.

endpoint: users/create <br>
http verb: post <br>
parameters: <br>
&nbsp; username: &lt;string> <br>
&nbsp; password: &lt;string> <br>
&nbsp; isAdmin: &lt;boolean> <br>

##### Request with httpie
&nbsp; http -f POST http://localhost:8080/users/create username=victor \ <br>
&nbsp; password=securepassword isAdmin=false

##### Response:
> HTTP/1.1 200 OK <br>
> Connection: keep-alive <br>
> Content-type: application/json <br>
> Date: Fri, 04 Sep 2020 12:02:44 GMT <br>
> Transfer-Encoding: chunked <br>
> 
> { <br>
> &nbsp;    "message": "user created successfully" <br>
> } <br>

#### How to login a user.

endpoint: user <br>
http verb: post <br>
parameters: <br>
&nbsp; username: &lt;string>
&nbsp; password: &lt;string>

##### Request with httpie
&nbsp; http http://localhost:8080/user username=vic password=pass

##### Response:
> HTTP/1.1 200 OK <br>
> Connection: keep-alive <br>
> Content-type: application/json <br>
> Date: Fri, 04 Sep 2020 12:10:52 GMT <br>
> Transfer-Encoding: chunked <br>

> { <br>
> &nbsp;    "message": "logged in successfully", <br>
> &nbsp;    "secureId": <br> "quy8a6e6nk67w0ereiz9pdpbq8fznawgwn6zff3js5e8ryukxoblrurulx9vdyt6na9pjx6z8zlwrulqxeukhazxdo9j8x7plbcm0bl65q4r9n2lem0qed7yz79ym1tado6sur1m7w6wzq33xudpa97r06n0qmwpsgw4dyg6ptg9t4gxzhnql44in2mviul5s9tt5vlr8z1rxzsepi6xti7b04kknk8yjq4zzjjjhvap1vq1nihlqs4mb25v74d7"
> <br>}




