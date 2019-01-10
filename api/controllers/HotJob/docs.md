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