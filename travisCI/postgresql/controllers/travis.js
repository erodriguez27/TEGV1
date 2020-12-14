const axios = require("axios"),
    utils = require('../../lib/utils.js'),
    nrc = require('node-run-cmd'),
    fs = require('fs');

exports.getTravisToken = async function (req, res) {

    try {
        let Gtok = req.user.token,
            commands = [`travis login --github-token ${Gtok}`, `travis token`],
            arrTok = [],
            lab = function (data) {
                console.log('lab', data)
                arrTok.push(data);
            };
console.log(commands)
        nrc.run(commands, { shell: true, onData: lab }).then(function (exitCodes) {

            console.log('Ttok', arrTok, arrTok.length);
            res.status(200).json({
                statusCode: 200,
                token: arrTok
            });
        }, function (err) {
            console.log('Command failed to run with error: ', err);
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            pgErrorCode: err
        });
    }
};

exports.getrepos = async function(req, res) {

    try {
        console.log('token:::::', req.user.travisToken)
        let token = req.user.travisToken[0],
            url = 'https://api.travis-ci.org/repos',
            meth = 'GET',
            header = await utils.getHeader('travis', token, meth),
            resp = await utils.fetch(url, meth, header);

            console.log('response en controller:::::', resp.data)


            res.status(200).json({
                statusCode: 200,
                data: resp.data
            });
            

    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            pgErrorCode: err
        });
    }
};

exports.getrepoBuilds = async function(req, res) {

    try {
        console.log('token:::::', req.user.travisToken)
        let token = req.user.travisToken[0],
            repoId = req.body.repoId,
            url = `https://api.travis-ci.org/repo/github/${repoId}/builds`,
            meth = 'GET',
            header = await utils.getHeader('travis', token, meth),
            resp = await utils.fetch(url, meth, header);

            console.log('response en controller:::::', resp.data)


            res.status(200).json({
                statusCode: 200
            });
            

    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            pgErrorCode: err
        });
    }
};

// Se llama sobre un repo para activar/desactivar las pruebas en travis del mismo.
exports.activeRepo = async function(req, res) {

    try {
        console.log('token:::::', req.user.travisToken)
        let token = req.user.travisToken[0],
            url = `https://api.travis-ci.org/repo/github/${repository.id}/activate`,
            meth = 'POST',
            header = await utils.getHeader('travis', token, meth),
            resp = await utils.fetch(url, meth, header);

            console.log('response en controller:::::', resp.data)


            res.status(200).json({
                statusCode: 200
            });
            

    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            pgErrorCode: err
        });
    }
};


exports.TravisToken = function(token) {
console.log('cai')
    try {
        let Gtok = token,
            commands = [`travis login --github-token ${Gtok}` , `travis token`];


        let arrTok = [],
            lab = function (data) {
                console.log('lab', data)
                arrTok.push(data.trim());
            }
        let ret = nrc.run(commands, { shell: true, onData: lab }).then(function (exitCodes) {
            
            console.log('Ttok', arrTok, arrTok.length);
            return arrTok;
        }, function (err) {
            console.log('Command failed to run with error: ', err);
            return ;
        });
        return ret;
    } catch (err) {
        console.log(err);
    }
};

exports.files = async function(req, res) {

    try {
        console.log('files')
        const dir = './Users/flavio/githube/at'

        try {
            let ret = await utils.createDirectory('edraf');
            console.log('retorno::::',ret)
        } catch (err) {
            console.log('errorrrrrr')
            console.error(err)
        }
            res.status(200).json({
                statusCode: 200
            });
            

    } catch (err) {
        console.log(err);
        res.status(500).json({
            statusCode: 500,
            pgErrorCode: err
        });
    }
};