const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const green = '\x1b[32m';
const red = '\x1b[31m';
const resetColor = '\x1b[0m';

// Template for the Express server file
const serverTemplate = (packageName)=>{
    return `const express = require('express');
    const app = express();
    const mongoose = require('mongoose')
    const port = process.env.PORT || 3000;
    const cors = require('cors')
    const corsConfig = require('./config/cors.js');
    const bodyParser = require('./config/body-parser.js');
    
    // Set up your routes and middleware here
    app.use(cors(corsConfig))
    app.use(bodyParser);
    
    // Run MongoDB
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/${packageName}', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const connection = mongoose.connection
    connection.once('open', ()=>{console.log('Database running Successfully')});

    //render th html file
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
    });
    
    // Run Server
    app.listen(port, () => {
      console.log(\`Server running on  http://localhost:\${port}\`);
    });`;
}

// Template for the package.json file;
const packageTemplate = (packageName)=>{
    return `
    {
        "name": "${packageName}",
        "version": "1.0.0",
        "main": "server.js",
        "scripts": {
            "test": "echo 'Error: no test specified' && exit 1",
            "start": "node server.js",
            "run": "nodemon server.js"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
    }
    `
}


// Template for the .env file
const envTemplate = `PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/my-app`;

const gitIgnoreTemplate = `
    ./node_modules
    node_modules

    ./.env
    .env
`

// Create the project directory
// const createProjectDirectory = (projectName) => {
//   let projectPath = path.join(process.cwd(), projectName);
  
//   // Check if the directory already exists
//   if (fs.existsSync(projectPath)) {
//     console.error(red, `Directory '${projectName}' already exists.`);
//     return;
//   }

//   fs.mkdirSync(projectPath);
//   projectPath = path.join(process.cwd(), projectName);
//   console.log(projectPath);
//   console.log(green, 'Project directory created');
// };

const createProjectDirectory = (projectName) => {
  const projectPath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(red, `A directory with the name '${projectName}' already exists.`);
    return;
  }
  fs.mkdirSync(projectPath);
  console.log(green, `Project directory '${projectName}' created successfully.`);
};

// Create Config Folder
const createConfigFolder = (projectName) =>{
  const projectPath = path.resolve(process.cwd(), projectName, 'config');
  fs.mkdirSync(projectPath);
}

// create any folder
const createAnyFolder = (projectName, name)=>{
  const projectPath = path.resolve(process.cwd(), projectName, name);
  if (fs.existsSync(projectPath)) {
    console.error(red, `A directory with the name '${projectName}' already exists.`);
    return;
  }
  fs.mkdirSync(projectPath);
}


// Create the Express server file
const createServerFile = (projectName) => {
  const filePath = path.join(projectName, 'server.js');
  fs.writeFileSync(filePath, serverTemplate(projectName));
  console.log(green, 'Express server file created');
};


// Create the .env file
const createEnvFile = (projectName) => {
  const filePath = path.join(projectName, '.env');
  fs.writeFileSync(filePath, envTemplate);
  console.log(green, '.env file created');
};


// Create the .gitIgnore file
const createGitIgnoreFile = (projectName) => {
    const filePath = path.join(projectName, '.gitIgnore');
    fs.writeFileSync(filePath, gitIgnoreTemplate);
    console.log(green, '.gitIgnore file created');
  };

// Create the package.json file;
const createPackageFile = (projectName) => {
    const filePath = path.join(projectName, 'package.json');
    fs.writeFileSync(filePath, packageTemplate(projectName));
    console.log(green, 'Package.json file created');
}

// cors config template
const corsConfigTemplate = (projectName)=>{
  return `
  const whitelist = 
  [
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
      }
    }
  }

  module.exports = {corsOptions}
  `
}

// create body parser template
const bodyParserTemplate = (projectName) =>{
  return `
    const bodyParser = require('body-parser');

    bodyParser.json({limit:"50mb", extended: true})
    bodyParser.urlencoded({limit:"50mb", extended: false})

    module.exports = bodyParser
  `
}

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

// create cors config;
const createCorsConfigFile = (projectName)=>{
  const filePath = path.join(projectName, 'config', 'cors.js');
  fs.writeFileSync(filePath, corsConfigTemplate(projectName))
  console.log("Cors config setup")
}

//create bodyparser config
const createBodyParserConfigFile = (projectName)=>{
  const filePath = path.join(projectName, 'config', 'body-parser.js');
  fs.writeFileSync(filePath, bodyParserTemplate(projectName))
  console.log("Body Parser config setup")
}

// Create html file;
const createHtmlFile = (projectName)=>{
  const filePath = path.join(projectName, 'public', 'index.html');
  fs.writeFileSync(filePath, page(projectName, "3000"))
  console.log("Public file setup")
}

// Main function
const createExpressApp = (projectName) => {
  createProjectDirectory(projectName); //added
  createServerFile(projectName);// added
  createPackageFile(projectName);// added
  createEnvFile(projectName);
  createGitIgnoreFile(projectName)
  createConfigFolder(projectName)
  createCorsConfigFile(projectName)
  createBodyParserConfigFile(projectName)
  createAnyFolder(projectName, "public")
  createHtmlFile(projectName)
  console.log(green, 'Boilerplate generated successfully!');

  // Change to the project directory
  const projectPath = path.join(process.cwd(), projectName);
    process.chdir(projectPath);
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');
    
    const green = '\x1b[32m';
    const red = '\x1b[31m';
    const resetColor = '\x1b[0m';
    
    // Template for the Express server file
    const serverTemplate = (packageName, useTypeScript) => {
      const imports = 
      useTypeScript ?
       `import express from 'express';
        import mongoose from 'mongoose';
        import cors from 'cors';
        import corsConfig from './config/cors.ts';
        const bodyParser from './config/body-parser.ts';
       `
        : `const express = require('express');
        const mongoose = require('mongoose')
        const cors = require('cors')
        const corsConfig = require('./config/cors.js');
        const bodyParser = require('./config/body-parser.js');`;
      const app = 'express()';
      const port = `process.env.PORT || 3000`;
    
      return `
        ${imports}
        const app = ${app};
        const port = ${port};
    
        // Set up your routes and middleware here
    
        // Run MongoDB
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/${packageName}', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        const connection = mongoose.connection
        connection.once('open', ()=>{console.log('Database running Successfully')});
    
        //render th html file
        app.get('/', (req, res) => {
          res.sendFile(__dirname + '/public/index.html');
        });
    
        // Run Server
        app.listen(port, () => {
          console.log(\`Server running on port \${port}\`);
    
          // Open the browser to a specific route
          import('open').then((open) => {
        open.default(http://localhost:${port}/your-route);
      })
        });
      `;
    };
    
    // Template for the package.json file
    const packageTemplate = (packageName, useTypeScript) => {
      const scripts = useTypeScript
        ? `"start": "ts-node server.ts"`
        : `"start": "node server.js"`;
    
      return `
        {
            "name": "${packageName}",
            "version": "1.0.0",
            "main": "${useTypeScript ? 'server.ts' : 'server.js'}",
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
            ${useTypeScript ? `"devDependencies": {
                "ts-node": "^10.2.1",
                "typescript": "^4.4.4"
            },` : ''}
            "engines": {
                "node": ">=12.0.0"
            }
        }
      `;
    };
    
    // Template for the .env file
    const envTemplate = `PORT=3000
    MONGODB_URI=mongodb://127.0.0.1:27017/my-app`;
    
    const gitIgnoreTemplate = `
        ./node_modules
        node_modules
    
        ./.env
        .env
    `
    
    // Create the project directory
    const createProjectDirectory = (projectName) => {
      const projectPath = path.resolve(process.cwd(), projectName);
      if (fs.existsSync(projectPath)) {
        console.error(red, `A directory with the name '${projectName}' already exists.`);
        return;
      }
      fs.mkdirSync(projectPath);
      console.log(green, `Project directory '${projectName}' created successfully.`);
    };
    
    // Create Config Folder
    const createConfigFolder = (projectName) =>{
      const projectPath = path.resolve(process.cwd(), projectName, 'config');
      fs.mkdirSync(projectPath);
    }
    
    // create any folder
    const createAnyFolder = (projectName, name)=>{
      const projectPath = path.resolve(process.cwd(), projectName, name);
      if (fs.existsSync(projectPath)) {
        console.error(red, `A directory with the name '${projectName}' already exists.`);
        return;
      }
      fs.mkdirSync(projectPath);
    }
    
    // Create the Express server file
    const createServerFile = (projectName, useTypeScript) => {
      const filePath = path.join(projectName, useTypeScript ? 'server.ts' : 'server.js');
      fs.writeFileSync(filePath, serverTemplate(projectName, useTypeScript));
      console.log(green, 'Express server file created');
    };
    
    // Create the .env file
    const createEnvFile = (projectName) => {
      const filePath = path.join(projectName, '.env');
      fs.writeFileSync(filePath, envTemplate);
      console.log(green, '.env file created');
    };
    
    
    // Create the .gitIgnore file
    const createGitIgnoreFile = (projectName) => {
        const filePath = path.join(projectName, '.gitIgnore');
        fs.writeFileSync(filePath, gitIgnoreTemplate);
        console.log(green, '.gitIgnore file created');
      };
    
    // Create the package.json file
    const createPackageFile = (projectName, useTypeScript) => {
      const filePath = path.join(projectName, 'package.json');
      fs.writeFileSync(filePath, packageTemplate(projectName, useTypeScript));
      console.log(green, 'package.json file created');
    };
    
    const corsConfigTemplate = (projectName, useTypeScript)=>{
      return useTypeScript ?
    
      `
      const whitelist: String[] = 
      [
        'http://localhost:3000', 
        'http://127.0.0.0.1:3000', 
        'https://your-site.com'
      ]
    
      export const corsOptions: Object = {
        origin: function (origin: any, callback: any) {
          if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
          } else {
            callback(new Error('Not allowed by CORS'))
          }
        }
      }
      `
    
      :`
      const whitelist = 
      [
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
          }
        }
      }
    
      module.exports = {corsOptions}
      `
    }
    
    // create body parser template
    const bodyParserTemplate = (projectName, useTypeScript) =>{
      return useTypeScript ?
      ` import bodyParser from "body-parser";
    
        bodyParser.json({limit:"50mb", extended: true})
        bodyParser.urlencoded({limit:"50mb", extended: false})
    
        export default bodyParser;
      `
      : 
      `
        const bodyParser = require('body-parser');
    
        bodyParser.json({limit:"50mb", extended: true})
        bodyParser.urlencoded({limit:"50mb", extended: false})
    
        module.exports = bodyParser
      `
    }
    
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
    
    // create cors config;
    const createCorsConfigFile = (projectName, useTypeScript)=>{
      const filePath = path.join(projectName, 'config', useTypeScript? 'cors.ts' : 'cors.js');
      fs.writeFileSync(filePath, corsConfigTemplate(projectName, useTypeScript))
      console.log("Cors config setup")
    }
    
    //create bodyparser config
    const createBodyParserConfigFile = (projectName, useTypeScript)=>{
      const filePath = path.join(projectName, 'config', useTypeScript? 'body-parser.ts' : 'body-parser.js');
      fs.writeFileSync(filePath, bodyParserTemplate(projectName, useTypeScript))
      console.log("Body Parser config setup")
    }
    
    // Create html file;
    const createHtmlFile = (projectName)=>{
      const filePath = path.join(projectName, 'public', 'index.html');
      fs.writeFileSync(filePath, page(projectName, "3000"))
      console.log("Public file setup")
    }
    
    // Create the tsconfig.json file
    const createTsConfigFile = (projectName) => {
      const filePath = `${projectName}/tsconfig.json`;
      const tsConfig = {
        compilerOptions: {
          target: 'es6',
          module: 'commonjs',
          strict: true,
          baseUrl: '.',
          outDir: 'dist',
          rootDir: 'src',
          esModuleInterop: true,
          resolveJsonModule: true,
          declaration: true,
        },
        include: ['src'],
        exclude: ['node_modules', 'dist'],
      };
      fs.writeFileSync(filePath, JSON.stringify(tsConfig, null, 2));
      console.log('tsconfig.json file created');
    };
    
    
    // Main function
    const createExpressApp = (projectName, useTypeScript) => {
      createProjectDirectory(projectName);
      createServerFile(projectName, useTypeScript);
      createPackageFile(projectName, useTypeScript);
      createEnvFile(projectName, useTypeScript);
      createGitIgnoreFile(projectName, useTypeScript)
      createConfigFolder(projectName, useTypeScript)
      createCorsConfigFile(projectName, useTypeScript)
      createBodyParserConfigFile(projectName, useTypeScript)
      createAnyFolder(projectName, "public")
      createHtmlFile(projectName)
      useTypeScript && createTsConfigFile(projectName)
      console.log(green, 'Boilerplate generated successfully!');
    
      // Change to the project directory
      const projectPath = path.join(process.cwd(), projectName);
      process.chdir(projectPath);
    
      // Install dependencies
      console.log('\x1b[34m','Installing dependencies...');
        
        if(useTypeScript){
          execSync('npm i express mongoose dotenv cors body-parser open', { stdio: 'inherit' });
        execSync('npm i -D ts-node typescript', { stdio: 'inherit' });
        }
        else{
          execSync('npm i express mongoose dotenv cors body-parser open', { stdio: 'inherit' });
        }
        
        
        console.log(green, 'Dependencies installed successfully!');
        console.log(resetColor, "")
    
      console.log(green, 'Your Express app is ready for development!');
    };
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const projectName = args[0];
    const useTypeScript = args.includes('-tsc=true');
    
    if (projectName) {
      createExpressApp(projectName, useTypeScript);
    } else {
      console.error(red, 'Please provide a project name.');
    }
    
    module.exports = {createExpressApp}
    // Run npm install
    console.log('\x1b[34m','Installing dependencies...');
    execSync('npm i express mongoose dotenv cors body-parser', { stdio: 'inherit' });
    console.log(green, 'Dependencies installed successfully!');
    console.log(resetColor, "")

    execSync('npm start', { stdio: 'inherit' });
  
};

// Run the script
const projectName = process.argv[2];
if (projectName) {
  createExpressApp(projectName);
} else {
  console.error(red, 'Please provide a project name.');
}

module.exports = {createExpressApp}