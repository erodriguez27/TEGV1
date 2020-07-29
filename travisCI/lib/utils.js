const axios = require('axios'),
    fs = require('fs');

exports.cleanObjects = function(array) {
    array.forEach(x => {
        for(let key in x) {
            if (x[key] === "") {
                x[key] = null;
            }
        }
    });
};

exports.wrap = fn => (...args) => fn(...args).catch(args[2]);

exports.formatErrorMessage = e => {
    let message = ''
    if (e.code === 'ENOTFOUND') {
        message = 'Error de comunicación.'
    }
    else {
        message = 'Error interno.'
    }
    
    return message

}

exports.fetch = async function(route, meth, head){
    let response;
    switch (meth){
        case 'GET':
            response = await axios.get(route, head);
            break;
        case 'POST':
            response = await axios.post(route, head);
            break;
    }
    return response;
}
exports.getHeader = async function(domain, token, meth){
    let response = {};

    switch (domain){
        case 'travis':
            response = {
                method: meth,
                headers:{
                    'content-type': 'application / json',
                    'Travis-API-Version': 3,
                    'Authorization': `token ${token}`
                }
            }
            break;
        case 'github':
            response = {
                headers:{
                    'content-type': 'application / json',
                    'Authorization': `token ${token}`
                }
            }
            break;
    }
    return response;
}

exports.createDirectory = async function (user) {

    try {
        const dir = `./Users/github/${user}`
        let dire

        console.log('exist', fs.existsSync(dir))
        if (!fs.existsSync(dir)) {
            dire = fs.mkdirSync(dir, { recursive: true })
        } else {
            dire = fs.realpathSync(dir)
        }
        return dire;
    } catch (err) {
        console.error(err)
        return null;
    }

}