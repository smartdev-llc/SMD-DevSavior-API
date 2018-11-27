API docs

## 1. Get list candicates of a job
- URN: /jobs/:id/applications
- Method: *GET*
- Request params

| Attribute | Type    | Mandatory | Default | Description |
| --------- |:-------:|:---------:|:-------:|-------------|
| size      | integer | No        |10|Limit items on a page|
| page      | integer | No        |0|Page number|


- Sample of request
~~~
http://localhost:1337/jobs/13/applications?size=5&page=0
~~~

- Response data

| Attribute | Type    | Description                     |
| --------- |:-------:|---------------------------------|
| size      | integer |Limit number of items on a page  |
| from      | integer |Number of items which skipped    |
| total     | integer |Number or candicates for this job|
| list      | array   |List details candicates          |

- Sample of response
~~~
{
    "size": 5,
    "from": 0,
    "total": 1,
    "list": [
        {
            "createdAt": 1542336226407,
            "updatedAt": 1542336226407,
            "id": 30,
            "email": "chuong2v@gmail.com",
            "firstName": "chuong",
            "lastName": "Vo",
            "profileImageURL": "",
            "status": "ACTIVE",
            "providers": [
                "local"
            ],
            "providerData": {},
            "emailVerified": true,
            "phoneNumber": "",
            "gender": "",
            "dateOfBirth": "",
            "maritalStatus": "",
            "country": "",
            "city": "",
            "currentAddress": "",
            "jobTitle": "",
            "yearsOfExperience": 0,
            "educationalStatus": "",
            "isPrivate": true,
            "skills": [],
            "languages": [],
            "displayName": "chuong Vo"
        }
    ]
}
~~~