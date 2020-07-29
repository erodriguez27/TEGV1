const { exec } = require("child_process");

exports.run = async function(commands){
    for (let i = 0; i < commands.length; i++) {
        await exec(commands[i], (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
}

