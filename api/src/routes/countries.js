const { Router } = require('express');
const { Country, Activity } = require('../db');
const axios = require('axios');

const countriesRouter = Router()

//  CREAR MIDDLEWARE PARA PEDIDO A API
//  CREAR MIDDLEWARE PARA CREACION DE PAISES

countriesRouter.get('/', async (req, res) => {
    //hace una peticion de tipo get a la ruta de la raiz '/'
    //hace un destructurin a name para obtener el parametro name de la consulta URL
    const { name } = req.query;

    const controller = await Country.findByPk('BGR')
    //Busca el país con el ID 'BGR' en la tabla de países de la base de datos y almacenarlo en la variable controller.


    if (!controller) {
        //si no se cumple lo de controller 'BGR' significa que el pais no existe en la base de datos
        //si controller no tiene un valor valido , hace una peticion a la api
        try {
            let response = await axios.get('https://restcountries.com/v3/all')
            

            for (let i = 0; i < response.data.length; i++) {
                let country = {
                    id: response.data[i].cca3,
                    name: response.data[i].name.common,
                    flag: response.data[i].flags[1],
                    region: response.data[i].region,
                    capital: response.data[i].capital ? response.data[i].capital[0] : 'None',
                    subregion: response.data[i].subregion,
                    area: response.data[i].area,
                    population: response.data[i].population,
                }
                //rcorro todos los elementos en la matriz response.data y creo un objeto country con los datos relevantes de cada país, como su ID, nombre, bandera, región, capital, subregión, área y población.
                await Country.create(country)
                // await para esperar  y luego crear un nuevo registro en la tabla de paises de la base de datos;
                //Este nuevo registro contendrá información de un país específico, que se almacena en un objeto JavaScript llamado country
            }
        } catch (error) {
            return res.status(400).send('Algo salió mal')
        }
        
    }
    
    try {
    const countries = await Country.findAll({include: Activity});
    //busca todos los paises en la base de datos incluyendo la actividad asociada a cada pais
        
        if (name) {
            //si existe el parametro name  a traves de la solicitud sera verdadera
            let countryName = countries.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
            //filtra la matriz de países para encontrar aquellos cuyo nombre incluye la cadena name

            if (countryName) {
                // verifico si se encontro algun pais que coincida con el nombre proporcionado , si se encontro al menos 1 la variable countryName sera verdadera
                return res.json(countryName)
            }
            //Si no se encontró ningún país que coincida con el nombre proporcionado, esta línea devuelve una respuesta 
            return res.status(404).send('País no encontrado,perdon')
        }

        return res.json(countries);
        //si no se proporcionó un parámetro name a través de la solicitud HTTP, esta línea devuelve una respuesta error
    } catch (error) {
        return res.status(400).send(error)
    }
})

countriesRouter.get('/:idPais', async (req, res) => {
    //hace una peticion de tipo get a la ruta de la raiz '/:idPais'
    const { idPais } = req.params;
    

    try {
        const country = await Country.findAll({where:{name:idPais}});
       

        if (country) {
           
            return res.json(country)
          
        }
        return res.status(404).send('Country not found')
       
    } catch (error) {
        console.log(error)
        return res.status(400).send(error);
       
    }
    
});
countriesRouter.get('/:idPais/activities', async (req, res) => {
    //hace una peticion de tipo get a la ruta de la raiz '/:idPais'
    const activitiesreq = await Activity.findAll({where:{pais:req.params.idPais}});
    console.log(activitiesreq)
  
   
    return  res.json(
		activitiesreq
	)

          
    
    
});
module.exports = countriesRouter;
