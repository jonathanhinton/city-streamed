#City Streamed
Capstone project for front end development portion of Nashville Software School.

#Running The App
After cloning the repo, in the main folder enter the folling commands:
```
cd lib
bower install
npm install
```
Because this app uses `getUserMedia()`, you will need to be able to run serve local files using https. This will only work if you have a valid self-signed certificate.  In the main directory for the application copy and paste this code in the command line `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -nodes`.  After that run `http-server --ssl`. Now prefix the I.P. your serving files on with `https://`.  You should be able to run the app now!