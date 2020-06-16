import { Request, Response } from 'express'
import Knex from '../database/connection'

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItem = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await Knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItem)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.31.206:5000/uploads/multerUploads/${point.image}`
            }
        })


        return response.json(serializedPoints)

    }
    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await Knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found' })
        }
        const items = await Knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.31.206:5000/uploads/multerUploads/${point.image}`
        }

        return response.json({ point: serializedPoint, items })

    }
    async create(request: Request, response: Response) {
            const {
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf,
                items
            } = request.body

            console.log(request.body, request.file)

            //Isso é igual const = name = request.body.name
            //Dito como esquema de desestruturação o js
            const trx = await Knex.transaction()
            const point = {
                image: request.file.filename,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            }
            const insertedIds = await trx('points').insert(point)
            const point_id = insertedIds[0];
            console.log('tratando array')

            const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })

            console.log(pointItems)



            const pointItemsId = await trx('point_items').insert(pointItems);

            trx.commit();
            return response.json({
                id: point_id,
                ...point

            })

       
    }
}

export default PointsController