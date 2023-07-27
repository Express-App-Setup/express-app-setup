const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const green = '\x1b[32m';
const red = '\x1b[31m';
const resetColor = '\x1b[0m';

const BaseCreator = require("express-app-setup/src/BaseCreator")

class JavascriptCreator extends BaseCreator{
    constructor(extension, packageName){    
        super(extension, packageName)
    }

    createServerTemplate(){
        const imports = 
        `const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./src/config/cors');`;
const app = "express()";
const port = `process.env.PORT || 3030`;
      
        return `${imports}
const app = ${app};
const port = ${port};
      
// Set up your routes and middleware here
app.use(cors(corsOptions));
express.urlencoded({limit:"50mb", extended: false})
express.json({limit:"50mb", extended: true})
     
// Run MongoDB
mongoose.connect(process.env.MONGODB_URI || \`mongodb://127.0.0.1:27017/${this.packageName}\`)
const connection = mongoose.connection
connection.once('open', ()=>{console.log('Database running Successfully')});
      
//render the html file
app.get('/', (req, res) => {
res.sendFile(__dirname + '/public/index.html');
});
      
// Run Server
app.listen(port, () => {
console.log(\`Server running on port \${port}\`);
      
// Open the browser to a specific route
import('open').then((open) => {
open.default(\`http://localhost:\${port}\`);
    })
  });
        `;
    }

    createPackageFile(){

    const packageTemplate = ()=>{
           const scripts = `"start": "node server.js"`;

           return `{
"name": "${this.packageName}",
"version": "1.0.0",
"main": "server.js",
"scripts": {
"test": "echo 'Error: no test specified' && exit 1",
${scripts}
},
"keywords": [],
"author": "",
"license": "ISC",
"dependencies": {
"express": "^4.18.2"
},
"engines": {
"node": ">=12.0.0"
}
}
`;
    }
     

   const filePath = path.join(this.packageName, 'package.json');
   fs.writeFileSync(filePath, packageTemplate());
   console.log(green, 'package.json file created');
    }

    createCorsConfigFile(){
        const corsConfigTemplate = ()=>{
            return `const whitelist = [
'http://localhost:3000', 
'http://127.0.0.0.1:3000', 
'https://your-site.com'
    ]
            
const corsOptions = {
origin: function (origin, callback) {
if (whitelist.indexOf(origin) !== -1 || !origin) {
callback(null, true)
} else {
callback(new Error('Not allowed by CORS'))
}}
    }
            
module.exports = corsOptions`
        }

        const filePath = path.join(this.packageName, "src", 'config', 'cors.js');
        fs.writeFileSync(filePath, corsConfigTemplate())
        console.log("Cors config setup")
    }

    createBodyParserConfigFile(){
        const bodyParserTemplate = () =>{
            return `const bodyParser = require('body-parser');
    
bodyParser.json({limit:"50mb", extended: true})
bodyParser.urlencoded({limit:"50mb", extended: false})
          
module.exports = bodyParser
`
        }

        const filePath = path.join(this.packageName, "src", 'config', 'body-parser.js');
        fs.writeFileSync(filePath, bodyParserTemplate())
        console.log("Body Parser config setup")

    }

    installation(){
        
        // Change to the project directory
        const projectPath = path.join(process.cwd(), this.packageName);
        process.chdir(projectPath);

        // Install dependencies
        console.log('\x1b[34m','Installing dependencies...');
        execSync('npm i express mongoose dotenv cors open', { stdio: 'inherit' });
            
        console.log(green, 'Dependencies installed successfully!');
        console.log(resetColor, "")

        console.log(green, 'Your Express app is ready for development!');
        console.log(resetColor, "")
    }
}

// const js = new JavascriptCreator(extension = "js", package="neewpp")
// js.init()
module.exports = JavascriptCreator

