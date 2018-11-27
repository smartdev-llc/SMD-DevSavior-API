API docs

## 1. Get list candicates of a job
- URN: /jobs/list-by-time
- Method: *GET*
- Request params

| Attribute | Type    | Mandatory | Default | Enum | Description |
| --------- |:-------:|:---------:|:-------:|------|-------------|
| size      | integer | No        |10       |  |Limit items on a page|
| page      | integer | No        |0        |  |Page number|
| type      | string | No        |"all"     |["all","active","expired","expiresSoon"] | Page number|


- Sample of request
~~~
http://localhost:1337/jobs/list-by-time?size=5&page=0&type=active
~~~

- Response data

| Attribute | Type    | Description                     |
| --------- |:-------:|---------------------------------|
| size      | integer |Limit number of items on a page  |
| from      | integer |Number of items which skipped    |
| total     | integer |Number or jobs                   |
| list      | array   |List jobs                        |

- Sample of response
~~~
{
    "from": 0,
    "size": 10,
    "total": 1,
    "list": [
        {
            "company": {
                "createdAt": 1542723546018,
                "updatedAt": 1542723546018,
                "id": 2,
                "email": "chuong.2v@gmail.com",
                "name": "Smartdev Co.",
                "address": "K856/27 Ton Duc Thang, Da Nang",
                "city": "DN",
                "contactName": "Chuong Vo",
                "phoneNumber": "0382595382",
                "website": "",
                "description": null,
                "logoURL": "",
                "coverURL": "",
                "photoURLs": null,
                "videoURL": "",
                "status": "ACTIVE",
                "emailVerified": true,
                "role": "company"
            },
            "title": "tuyendung",
            "description": "fpt tuyen dung",
            "skills": [
                {
                    "name": "Java",
                    "id": 1
                },
                {
                    "name": "Android",
                    "id": 2
                },
                {
                    "name": "IOS",
                    "id": 3
                }
            ],
            "category": {
                "id": 2,
                "name": "Frontend Developer"
            },
            "status": "ACTIVE",
            "requirements": "To add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n  add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. To add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in tTo add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in tTo add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in tTo add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in t",
            "fromSalary": 100,
            "toSalary": 200,
            "jobType": "FULL_TIME",
            "benefits": " tang 1 macbook pro, bonus thang 13 ",
            "expiredAt": 1543928110911,
            "_id": "31"
        }
    ]
}
~~~