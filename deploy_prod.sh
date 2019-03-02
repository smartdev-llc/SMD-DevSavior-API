git pull origin master &&
npm i &&
pm2 delete juniorviec-api
pm2 start pm2.json