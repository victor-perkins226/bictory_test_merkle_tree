#!/usr/bin/env node

const { execSync } = require('child_process');
const { colors } = require('colors');

console.log('Running solana-base-app');

const args = process.argv.slice(2);

const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
};

const template = args[0];
const folderName = args[1];
const ifAnchor = args[2];



const forReact = () => {
    const gitCheckoutCommand = `git clone https://github.com/UjjwalGupta49/solana-base-app ${folderName}`;
    const installDependencies = `cd ${folderName} && npm install`;
    const fixAnyErrors = `cd ${folderName} && npm audit fix`;
    console.log("React JS")
    console.log(`cloning the repository to name ${folderName}`.cyan);
    const checkedOut = runCommand(gitCheckoutCommand);
    if (!checkedOut) {
        process.exit(-1);
    }

    console.log(`installing dependencies`.cyan);
    const dependenciesInstalled = runCommand(installDependencies);
    if (!dependenciesInstalled) {
        process.exit(-1);
    }

    console.log('Scanning for errors...'.cyan);
    const fixErrors = runCommand(fixAnyErrors);
    console.log(
        'Congratulations! You are ready to develop on Solana! \nCheckout the README.md for more info at https://github.com/UjjwalGupta49/solana-base-app\n'
            .green
    );
    console.log(
        `run  cd ${folderName} && yarn start to get up and running, your development server will start at localhost:1234\n`
    );
    console.log('Happy Glass chewing!\n'.rainbow);
};

const forNext = () => {
    const gitCheckoutCommand = `git clone https://github.com/UjjwalGupta49/solana-base-app-next ${folderName}`;
    const installDependencies = `cd ${folderName} && npm install`;
    const fixAnyErrors = `cd ${folderName} && npm audit fix`;
    console.log("Next JS")
    console.log(`cloning the repository to name ${folderName}`.cyan);
    const checkedOut = runCommand(gitCheckoutCommand);
    if (!checkedOut) {
        process.exit(-1);
    }

    console.log(`installing dependencies`.cyan);
    const dependenciesInstalled = runCommand(installDependencies);
    if (!dependenciesInstalled) {
        process.exit(-1);
    }

    console.log('Scanning for errors...'.cyan);
    const fixErrors = runCommand(fixAnyErrors);
    console.log(
        'Congratulations! You are ready to develop on Solana! \nCheckout the README.md for more info at https://github.com/UjjwalGupta49/solana-base-app\n'
            .green
    );
    console.log(
        `run  cd ${folderName} && yarn start to get up and running, your development server will start at localhost:3000\n`
    );
    console.log('Happy Glass chewing!\n'.rainbow);
};


if (template === 'react') {
    forReact();
}
else if (template === 'next') {
    forNext();    
}
else {
    console.log('Invalid template'.red);
    process.exit(-1);
}
