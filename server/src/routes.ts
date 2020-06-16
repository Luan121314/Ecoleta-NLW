import express, { request } from 'express'
// import Knex from './database/connection'
import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsControllers'
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';
// import { string, number } from '@hapi/joi';

const routes = express.Router()
const pointsController = new PointsController();
const itemsContollers = new ItemsController();

const upload = multer(multerConfig);

routes.get('/items', itemsContollers.index);

routes.get('/points', pointsController.index);

routes.get('/points/:id', pointsController.show);
routes.post('/points',
    upload.single('image'),
    celebrate({
        body:Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    },{
        abortEarly: false

    }),
    pointsController.create);


    routes.get('/teste', (request, response)=>{
        response.json({message: 'ok'})
    });


export default routes