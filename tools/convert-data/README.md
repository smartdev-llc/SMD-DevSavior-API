# Script convert time format in metadata _juniorviec_ after updated mappings

## Config 

Edit config/env_name.json

~~~javascript
{
    "elasticsearch": {
        "connection": {
            "host": "localhost:9200",
            "requestTimeout": 90000
        },
        "indexName": "juniorviec"
    },
    "batchSize": 100
}
~~~

## Run 

~~~bash
NODE_ENV=env_name node index.js
~~~

Script is done when it shows *DONE*.