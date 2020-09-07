# API Docs

### Creating a user

There can be two types of users - A regular user or an admin user

#### How to create a user.

endpoint: users/create <br>
http verb: POST <br>
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
http verb: POST <br>
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

#### Get all available books

endpoint: books <br>
http verb: GET <br>
parameters: None

##### Request with httpie
&nbsp; http http://localhost:8080/books

##### Response:
> &nbsp; HTTP/1.1 404 Not Found <br>
> &nbsp; Connection: keep-alive <br>
> &nbsp; Content-type: application/json <br>
> &nbsp; Date: Fri, 04 Sep 2020 13:17:25 GMT <br>
> &nbsp; Transfer-Encoding: chunked <br>

> { <br>
> &nbsp;    "books": [ <br>
> &nbsp; &nbsp;        "3xir3fln9lix2yns0gljjt66v0i0he", <br>
> &nbsp; &nbsp;        "7073y8ru72tvpkbxzkt74c1bjmza0s", <br>
> &nbsp; &nbsp;        "7zd3xwvabw7p5rpadlfbjc6yxbzj3e", <br>
> &nbsp; &nbsp;        "cwm4s3pgj2k05q6djc1mifjvu2oo8m", <br>
> &nbsp; &nbsp;        "f63j9k7tlntcoqo5zvoauoxqv2sgfr", <br>
> &nbsp; &nbsp;        "p4bi4c2hbg6fe6mlrg0sen73bfaolk", <br>
> &nbsp; &nbsp;        "u83wkrujk09zq01rzny7qvxuoqr5ky" <br>
> &nbsp;    ], <br>
> &nbsp;    "data": null, <br>
> &nbsp;    "message": "book not found" <br>
> } <br>

#### Borrow Book





