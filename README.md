# juniorviec-backend

a [Sails v1](https://sailsjs.com) application
API for [Juniorviec](https://juniorviec.com) website

### Links

+ [Get started](https://sailsjs.com/get-started)
+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Thu Jun 28 2018 20:31:29 GMT+0700 (+07) using Sails v1.0.2.
Release Ver 1.0.0: 21/1/2019
<!-- Internally, Sails used [`sails-generate@1.15.28`](https://github.com/balderdashy/sails-generate/tree/v1.15.28/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->
### Requirements
NodeJS version 8 LTS  (v8.11.3)
Sails v1.0.2
MySQL 5.7
Elasticsearch 5.6
### How to run
- Install node packages
```sh
npm i
```
- Create .env file and Copy environment variables from .env.example to .env, then make it suitable to the current environment
## Local
- Run the app with this command:
```sh
node app.js
```  
Or  
```sh
sails lift
```
## Production
- Modify .env to set prod environment variables
- Use pm2 to start it:
```sh
pm2 start pm2.json
```


