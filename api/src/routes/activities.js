const { Router } = require('express');
const { Activity } = require('../db');

const router = Router();


router.post('/', async (req, res) => {
    const { name, difficulty, duration, season, pais } = req.body;
    console.log(req.body);
    let controller = await Activity.findAll({where: {name}});
    //una solicitud POST a esta ruta '/', el cuerpo de la solicitud se espera que contenga información sobre una actividad, como el nombre, la dificultad, la duración, la temporada y los nombres de los países asociados.

    //controller busca las actividades que coincidan con el nombre proporcionado

    if (controller) {
        for(let i = 0; i < controller.length; i++) {
            if (difficulty == controller[i].difficulty && duration == controller[i].duration && season === controller[i].season) {
                return res.send('La actividad ya existe');
                //Si los valores coinciden, se envía una respuesta al cliente con el mensaje "La actividad ya existe" utilizando res.send().
            }
        }
    }
    //verifico si el controlador (objeto) devuelto por una consulta a la base de datos existe y, si es así, busca en el controlador si ya existe una actividad con la misma dificultad, duración y temporada que se ha proporcionado.

    try {
        const activity = await Activity.create({ name, difficulty, duration, season, pais });
        // esto es un controlador de ruta de una solicitud POST que agrega una nueva actividad a la base de datos
         
   
        return res.status(201).send('Actividad creada con éxito')
     } catch (error) {
        res.status(400).send("Error,no se pudo crear la actividad")
    }
});

router.get('/', async (req, res) => {
    //es un controlador de ruta de una solicitud GET que devuelve una lista de todas las actividades almacenadas en la base de datos
   
    try {
        const activities = await Activity.findAll();
        //Se utiliza await Activity.findAll() para buscar todas las actividades almacenadas en la tabla de actividades de la base de datos.

        if (activities.length) return res.json(activities);
        //si la longitud de la matriz activities es mayor que 0. Si es así, significa que hay actividades en la base de datos 
        //sino si es igual a 0 significa que no hay actividades en la base de datos
        return res.send('No hay actividades')
    } catch (error) {
        res.status(400).send(error)
    }
});

module.exports = router;