const { parentPort, workerData } = require('worker_threads');
const {PrismaClient} = require('@prisma/client');
const axios = require('axios').default;
const prisma = new PrismaClient();
const convertToHour = require('../util/period_to_hour')
const convertWeekDay = require('../util/day_of_week')
const send_mess = require('../util/send_message')

parentPort.on('message', async (id)=>{
})

const runService = async (id) => {
    try {

        const arrayservice = await prisma.service.findMany({
            where: {
                id: Number(id),
            },
            include: {
                class: true
            }
        })

        const service = arrayservice[0]

        const student = await prisma.student.findUnique({
            where: {
                id: service.student_id
            }
        })
        
        const response = await axios.get('http://duc29.pythonanywhere.com/api/listclass/' + service.class.class_code)
        const data = await response.data
        const result = data.result

        parentPort.postMessage('service running, id: ' + id)
        let stt = false;
    
        while(true){            
    
            const getService = await prisma.service.findMany({
                where:{id: service.id}
            })
    
            if(getService.length > 0 && getService[0].is_starting) {
                const from = service.class.from
                const to = service.class.to
                const day = service.class.day_of_week

                let list = []
                result.map((item) => {
                    const hour = convertToHour(item.period)
                    if(item.day_of_week === day && hour.start >= from && hour.end <= to && item.total_slot > 0) {
                        list = [...list, item]
                    }
                })

                if(list.length > 0){
                    if(stt === false){

                        //stt = true;
                        const text = 'Mon hoc ' + service.class.name + ' ngay ' + convertWeekDay(day) + ' Tu ' + String(from) 
                        + 'h den ' + String(to) + 'h co the dang ki';
                        send_mess(5050440769, text)
                    }

                }
                else stt = false;

            }
            else return console.log('service stopped')

            //do every 30s
            await new Promise(r => setTimeout(r, 60000));
        }

    } catch (error) {
        console.log(error)
    }

    finally{
        async () => await prisma.$disconnect()
    }
}

runService(workerData)