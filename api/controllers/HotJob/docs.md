API docs

## 1. Create hot job
- URN: /hotjobs
- Method: *POST*
- Request params

| Attribute | Type    | Mandatory |  Enum | Description |
| --------- |:-------:|:---------:|-------|-------------|
| jobId     | string  | Yes       |       | Job id      |

- Sample of request
~~~
{
	"jobId": 16
}
~~~

- Error code:
    - VALIDATION_ERROR
    - HOT_JOB_EXISTS
    - NOT_FOUND
    - INTERNAL_SERVER_ERROR

## 2. Approve hot job

- URN: /hotjobs/:id/approve
- Method: *PUT*
- Request params
- Error code:
    - INTERNAL_SERVER_ERROR

## 3. List hot job on BackOffice

- URN: /bo/hotjobs
- Method: *GET*
- Request params

| Attribute | Type    | Mandatory | Default | Enum | Description |
| --------- |:-------:|:---------:|:-------:|------|-------------|
| size      | integer | No        |10       |  |Limit items on a page|
| page      | integer | No        |0        |  |Page number|


- Sample of request
~~~
http://localhost:1337/bo/hotjobs?size=5&page=0
~~~

- Response data

| Attribute | Type    | Description                     |
| --------- |:-------:|---------------------------------|
| size      | integer |Limit number of items on a page  |
| from      | integer |Number of items which skipped    |
| total     | integer |Number or hot jobs               |
| list      | array   |List hot jobs                    |

- Sample of response
~~~
{
    "total": 1,
    "list": [
        {
            "createdAt": 1547049512896,
            "updatedAt": 1547049993198,
            "id": 1,
            "status": "APPROVED",
            "expiredDay": 1547136393198,
            "expiredAt": 1547136393198,
            "approvedAt": 1547049993198,
            "job": {
                "createdAt": 1542723334767,
                "updatedAt": 1542723334767,
                "id": 16,
                "status": "ACTIVE",
                "title": "tuyendung",
                "fromSalary": 100,
                "toSalary": 200,
                "description": "fpt tuyen dung",
                "requirements": "To add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n  add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. To add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in tTo add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in tTo add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in tTo add more ProGuard rules that are specific to each build variant, add another proguardFiles property in the corresponding productFlavor block. For example, the following Gradle file adds flavor2-rules.pro to the flavor2 product flavor. Now flavor2 uses all three ProGuard rules because those from the release block are also applied. \n add more ProGuard rules that are specific to each build variant, add another proguardFiles property in t",
                "expiredAt": 1543328134765,
                "approvedAt": 0,
                "jobType": "FULL_TIME",
                "benefits": " tang 1 macbook pro, bonus thang 13 ",
                "company": 1,
                "category": 2
            },
            "company": 1
        }
    ],
    "size": 10,
    "from": 0
}
~~~
- Error code:
    - INTERNAL_SERVER_ERROR