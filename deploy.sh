git pull origin dev &&
npm i &&
pm2 delete juniorviec-api
pm2 start pm2.json
