const {PrismaClient} = require('@prisma/client');
const classController = require('./ClassController');
const prisma = new PrismaClient()
const convertToHour = require('../util/period_to_hour')
const convertWeekDay = require('../util/day_of_week');
const convertToClass = require('../util/code_to_class')
const send_mess = require('../util/send_message');
const day_of_week = require('../util/day_of_week');
const runService = require('../util/run_service')
const axios = require('axios').default;
const { Worker, workerData } = require("worker_threads");

class ServiceController{

    async startService(req, res){

        try {

            const startService = await prisma.service.create({
                data: {
                    student_id: Number(req.query.stu_id),
                    class:{
                        create:{
                            class_code: req.query.code,
                            name: convertToClass(req.query.code),
                            day_of_week: Number(req.query.day),
                            from: Number(req.query.from),
                            to: Number(req.query.to)
                        }
                    }
                }
            })

            if(Object.keys(startService).length === 0) return res.json({ok:false, messaage: 'Fail'});
            else {

                runService(startService.id)

                res.json({ok:true, messaage: startService});
            }
            
        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error
              });
        }
        finally{
            async () => await prisma.$disconnect()
        }

    }

    async stopService(req, res){

        try {
            
            const stop = await prisma.service.update({
                where :{id: Number(req.params.id)},
                data:{is_starting: 0}
            })

            if(Object.keys(stop).length === 0) return res.json({ok:false, messaage: 'Fail'});
            else return res.json({ok:true, messaage: stop});

        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error
              });
        }

        finally{
            async () => await prisma.$disconnect()
        }

    }

    async getService(req,res){

        try {
            
            const getService = await prisma.service.findMany({
                where: {
                    id: Number(req.params.id),
                },
                include: {
                    class: true
                }
            })
            
            if(getService.length === 0) {

                return res.json({ok:true, messaage: "Fail"});
                
            }
            else return res.json({ok:true, message: getService});

        } catch (error) {

            res.status(500).json({
                ok: false,
                error: error
              });

        }

        finally{
            async () => await prisma.$disconnect()
        }

    }

}

module.exports = new ServiceController;