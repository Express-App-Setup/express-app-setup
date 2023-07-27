const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const green = '\x1b[32m';
const red = '\x1b[31m';
const resetColor = '\x1b[0m';

const BaseCreator = require("express-app-setup/src/BaseCreator")

class TypescriptCreator extends BaseCreator{
    constructor(extension, packageName){
        super(extension, packageName)
    }

    createServerTemplate(){
        const imports = 
        `import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import corsOptions from './src/config/cors';
require("dotenv").config()
`;

const app = "express()";
const port = `String(process.env.PORT) || 3030`;
      
        return `${imports}
const app = ${app};
const port = ${port};
      
// Set up your routes and middleware here
app.use(cors(corsOptions));
express.urlencoded({limit:"50mb", extended: false})
express.json({limit:"50mb"})
     
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
      
  });
        `;
    }

    createPackageFile(){

        const packageTemplate = ()=>{
               const scripts = `"start": "ts-node server.ts"`;
    
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
    "dependencies": {
        "express": "^4.18.2"
    },
    "devDependencies": {
        "ts-node": "^10.2.1",
        "typescript": "^4.4.4"
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

        createCorsConfigFile(){
            const corsConfigTemplate = ()=>{
                return `const whitelist: String[] = [
    'http://localhost:3000', 
    'http://127.0.0.0.1:3000', 
    'https://your-site.com'
        ]
                
    const corsOptions = {
    origin: function (origin: any, callback: Function) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
    callback(null, true)
    } else {
    callback(new Error('Not allowed by CORS'))
    }}
        }
    export default corsOptions`
            }
    
            const filePath = path.join(this.packageName, "src", 'config', 'cors.ts');
            fs.writeFileSync(filePath, corsConfigTemplate())
            console.log("Cors config setup")
        }

    installation(){
          // Change to the project directory
        const projectPath = path.join(process.cwd(), this.packageName);
        process.chdir(projectPath);

        execSync('tsc --init', { stdio: 'inherit' });

        // Install dependencies
        console.log('\x1b[34m','Installing dependencies...');
        
        execSync('npm i mongoose dotenv express cors open', { stdio: 'inherit' });
        execSync('npm i -D ts-node typescript @types/express @types/cors', { stdio: 'inherit' });
        
    
        console.log(green, 'Dependencies installed successfully!');
        console.log(resetColor, "")

        console.log(green, 'Your Express app is ready for development!');
        console.log(resetColor, "")
    }
}

module.exports = TypescriptCreator