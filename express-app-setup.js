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
    
    // Set up your routes and middleware here
    
    // Run MongoDB
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/${packageName}', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const connection = mongoose.connection
    connection.once('open', ()=>{console.log('Database running Successfully')});
    
    // Run Server
    app.listen(port, () => {
      console.log(\`Server running on port \${port}\`);
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
        "license": "ISC",
        "dependencies": {
            "dotenv": "^16.3.1",
            "express": "^4.18.2",
            "mongoose": "^7.3.0"
          },
        "devDependencies": {
            "nodemon": "^2.0.20"
          }
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

// Main function
const createExpressApp = (projectName) => {
  createProjectDirectory(projectName);
  createServerFile(projectName);
  createPackageFile(projectName);
  createEnvFile(projectName);
  createGitIgnoreFile(projectName)
  console.log(green, 'Boilerplate generated successfully!');

  // Change to the project directory
  const projectPath = path.join(process.cwd(), projectName);
    process.chdir(projectPath);

    // Run npm install
    console.log('\x1b[34m','Installing dependencies...');
    execSync('npm i', { stdio: 'inherit' });
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
