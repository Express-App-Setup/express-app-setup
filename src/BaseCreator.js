const fs = require('fs');
const path = require('path');

const green = '\x1b[32m';
const red = '\x1b[31m';
const resetColor = '\x1b[0m';

const page = (projectName, port)=>{
    return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet">
  </head>
  <style>
    body{
        background-color: #0d1117;
        color: #c9d1d9;
        font-family: 'Righteous', cursive;
    }
  
    header{
        width: 80%;
        margin: 10vh auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
  
    .border{
        padding: 10px 16px;
        border: 2px solid #c9d1d9;
    }
  
    section{
        text-align: center;
    }
  
    section h1{
        font-size: 5em;
        margin-bottom: 10px;
    }
  
    section p{
        font-size: 1.5em;
        margin: 0;
        font-weight: 100;
    }
  
    .lds-dual-ring {
        display: inline-block;
        width: 60px;
        height: 60px;
        margin-top: 20px;
    }
  
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 44px;
        height: 44px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #c9d1d9;
        border-color: #c9d1d9 transparent #c9d1d9 transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
  @keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
  }
  
  a{
    text-decoration: none;
    color: inherit;
  }
  
  </style>
  <body>
    <header>
        <div class="border">
            Get started by editing server.js
        </div>
  
        <a href="https://github.com/DevEmmy" target="_blank">
            <p class="border">
                By DevEmmy
            </p>
        </a>
        
    </header>
    <section>
        <h1>Express App Setup</h1>
        <p>Your App (${projectName}) is now running on port ${port}</p>
        <div class="lds-dual-ring"></div>
    </section>
  </body>
  </html>
    `
}

class BaseCreator{
    constructor(extension, packageName) {
        this.extension = extension
        this.packageName = packageName
    }

    init(){
        this.createProjectDirectory()
        this.createServerFile()
        this.createEvnFile()
        this.createGitIgnoreFile()
        this.createPackageFile()
        this.createFolder("src")
        this.createConfigFolder()
        this.createCorsConfigFile()
        // this.createBodyParserConfigFile()
        this.createFolder("public")
        this.createHtmlFile()
        console.log(green, 'Boilerplate generated successfully!');
        this.installation()
    }

    createConfigFolder(){
        const projectPath = path.resolve(process.cwd(), this.packageName, "src", 'config');
        fs.mkdirSync(projectPath);
    }

    createServerTemplate(){
        throw Error("This Method must be Implemented")
    }

    createPackageFile(){
        throw Error("This Method must be Implemented")
    }

    installation(){
        throw Error("This Method must be Implemented")   
    }

    createEvnFile(){
        const envTemplate = `PORT=3030
        MONGODB_URI=mongodb://127.0.0.1:27017/my-app`;   
        const filePath = path.join(this.packageName, '.env');
        fs.writeFileSync(filePath, envTemplate);
        console.log(green, '.env file created');    
    }

    createCorsConfigFile(){
        throw Error("This Method must be Implemented")
    }

    createBodyParserConfigFile(){
        throw Error("This Method must be Implemented")
    }

    createHtmlFile(){
        const filePath = path.join(this.packageName, 'public', 'index.html');
        fs.writeFileSync(filePath, page(this.packageName, "3030"))
        console.log("Public file setup")
    }

    createGitIgnoreFile(){
        const gitIgnoreTemplate = `
        ./node_modules
        node_modules
    
        ./.env
        .env
    `
        const filePath = path.join(this.packageName, '.gitIgnore');
        fs.writeFileSync(filePath, gitIgnoreTemplate);
        console.log(green, '.gitIgnore file created');
    }

    createProjectDirectory(){
        const projectPath = path.resolve(process.cwd(), this.packageName);
        if (fs.existsSync(this.packageName)) {
          console.error(red, `A directory with the name '${this.packageName}' already exists.`);
          return;
        }
        fs.mkdirSync(this.packageName);
        console.log(green, `Project directory '${this.packageName}' created successfully.`);
    }

    createFolder(name){
        const projectPath = path.resolve(process.cwd(), this.packageName, name);
        if (fs.existsSync(projectPath)) {
          console.error(red, `A directory with the name '${this.packageName}' already exists.`);
          return;
        }
        fs.mkdirSync(projectPath);
    }

    createServerFile(){
        const filePath = path.join(this.packageName, `server.${this.extension}`);
        fs.writeFileSync(filePath, this.createServerTemplate());
        console.log(green, 'Express server file created');
    }
}

module.exports =  BaseCreator;