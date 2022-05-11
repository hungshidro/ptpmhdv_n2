const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const axios = require('axios').default;
//import fetch from 'node-fetch';

class StudentController {

    async addNewStudent(req,res) {
        try {
            
            const stu = await prisma.student.findMany({
                where: {
                    student_code: Number(req.body.student_code)
                }
            })

            if(stu.length > 0) return res.json({ok: false, message: "Student was exist"});

            else {
                const newStu = await prisma.student.create({
                    data:{
                        student_code: req.body.student_code,
                        telegram: req.body.telegram,
                        password: req.body.password
                    },
                })

                if(newStu) return res.json({ok: true, message: "200"});
                else return res.json({ok: false,message:"Fail"})
               
            }

        } catch (error) {
            res.status(500).json({
                ok: false,
                error: "Something went wrong!"
              });
        }
        finally{
            async () => await prisma.$disconnect()
        }
    }

    async getStudent(req,res) {
        try {

            
            const getStudent = await prisma.student.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            })

            if(getStudent) return res.json({ok: true, data: getStudent});
            else 
            return res.json({ok: false,message:"Fail"})

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

    async validateStudent(req, res){
        try {
            
            const validateStudent = await prisma.student.findMany({
                where:{
                    student_code: req.query.code ,
                    password: req.query.pass
                }
            })

            if(validateStudent.length === 0) return res.json({ok:false, message: "Validate Fail"}) 
            else 
            return res.json({ok: true, message: validateStudent})

        } catch (error) {
            res.status(500).json({
                ok: false,
                error: "Something went wrong!"
              });
        }
        finally{
            async () => await prisma.$disconnect()
        }
    }

    async getAllServiceOfStudent(req, res){
        try {

            const getAllService = await prisma.student.findMany({
                where:{
                    id: Number(req.params.id),
                },
                include:{
                    service:{
                        include:{
                            class: true
                        }
                    }
                }
            })

            console.log(getAllService)

            if(getAllService.length > 0) return res.json({ok: true, data: getAllService})
            else return res.json({ok:false, message: "Fail"})
            
        } catch (error) {
            res.status(500).json({
                ok: false,
                error: "Something went wrong!"
              });
        }
        finally{
            async () => await prisma.$disconnect()
        }
    }
}

module.exports = new StudentController;