const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");
const { validationResult } = require('express-validator');

const usuariosGet = async(req = request, res = response) => {
   
    //const {q, nombre = 'no name', apikey, page = 1, limit} = req.query;
   const { limite = 5, desde = 0  } = req.query;
   const query = {estado:true};

   // const usuarios = await Usuario.find(query)
   // .skip(desde)
   //.limit(limite);
//
   //const total = await Usuario.count(query);
//
   const [total, usuarios] = await Promise.all([
       Usuario.count(query),
       Usuario.find(query)
       .skip(desde)
       .limit(limite)
   ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {
    

    const {id} = req.params;
    const { _id, password, google, correo, ...resto} = req.body;

    //todo validar contra base de datos 
    if(password){

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);

    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);

}

const usuariosPost = async (req, res = response) => {
    
    const errors = validationResult(req);
    if( !errors.isEmpty()  ){
        return res.status(400).json(errors);
    }

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    
    //verificar si el correo existe
    

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //guardar en DB
    await usuario.save();

    res.json({
        
        msg: 'post API - controlador',
        usuario
    });

}

const usuariosDelete = async(req, res = response) => {
    
    const{id} = req.params;
    
    //borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});


    res.json(usuario);

  }

  const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });

  }

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}