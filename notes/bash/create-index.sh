#!/bin/bash

echo -n "Input host: " 
read host

echo -n "Input current version (example: v1,v2,v3, ... Ignore at the first time): " 
read lastVersion

echo -n "Input new version (v1,v2,v3 ...): " 
read newVersion

curl --request PUT \
  --url http://$host:9200/juniorviec-$newVersion \
  --header 'content-type: application/json' \
  --data ' {
		"mappings": {
			"Job": {
        "properties": {
          "_juniorviec_": {
            "properties": {
              "createdTime": {
                "type": "date",
                "format": "strict_date_optional_time||epoch_millis"
              },
              "updatedTime": {
                "type": "date",
                "format": "strict_date_optional_time||epoch_millis"
              }
            }
          },
          "approvedAt": {
            "type": "long"
          },
          "benefits": {
            "type": "text"
          },
          "category": {
            "type": "nested",
            "properties": {
              "id": {
                "type": "keyword"
              },
              "name": {
                "type": "text"
              }
            }
          },
          "slug": {
            "type": "text"
          },
          "company": {
            "type": "nested",
            "properties": {
              "address": {
                "type": "text"
              },
              "city": {
                "type": "text"
              },
              "slug": {
                "type": "text"
              },
              "contactName": {
                "type": "text"
              },
              "coverURL": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "createdAt": {
                "type": "long"
              },
              "description": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "email": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "emailVerified": {
                "type": "boolean"
              },
              "id": {
                "type": "keyword"
              },
              "logoURL": {
                "type": "keyword"
              },
              "name": {
                "type": "text"
              },
              "phoneNumber": {
                "type": "text"
              },
              "role": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "status": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "updatedAt": {
                "type": "long"
              },
              "videoURL": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "website": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              }
            }
          },
          "createdAt": {
            "type": "date"
          },
          "description": {
            "type": "text"
          },
          "expiredAt": {
            "type": "date"
          },
          "fromSalary": {
            "type": "double"
          },
          "jobType": {
            "type": "keyword"
          },
          "requirements": {
            "type": "text"
          },
          "skills": {
            "type": "nested",
            "properties": {
              "id": {
                "type": "keyword"
              },
              "name": {
                "type": "text"
              }
            }
          },
          "status": {
            "type": "keyword"
          },
          "title": {
            "type": "text"
          },
          "toSalary": {
            "type": "double"
          },
          "updatedAt": {
            "type": "date"
          }
        }
      }
		}
	}
}'

if [ -z "$lastVersion" ]
then
  curl --request POST \
    --url http://$host:9200/_aliases \
    --header 'content-type: application/json' \
    --data '{
    "actions": [{
      "add": {
        "index": "juniorviec-'$newVersion'",
        "alias": "juniorviec"
      }
    }]
  }'
else
  curl --request POST \
    --url http://$host:9200/_aliases \
    --header 'content-type: application/json' \
    --data '{
    "actions": [{
      "remove": {
        "index": "juniorviec-'$lastVersion'",
        "alias": "juniorviec"
      }
    }, {
      "add": {
        "index": "juniorviec-'$newVersion'",
        "alias": "juniorviec"
      }
    }]
  }'
fi

echo DONE