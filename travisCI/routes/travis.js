const express = require("express");

const travisCtrl = require("../postgresql/controllers/travis") ;

const api_travis = express.Router();
 
api_travis.get("/", travisCtrl.getTravisToken);
api_travis.get("/getrepos", travisCtrl.getrepos);
api_travis.get("/getrepoBuilds", travisCtrl.getrepoBuilds);
api_travis.get("/activeRepo", travisCtrl.activeRepo); //Tal vez sea mejor haacer la func para activar/desactivar
api_travis.get("/files", travisCtrl.files);

module.exports = api_travis;