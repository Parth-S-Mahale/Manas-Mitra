const express=require('express')
const router=express.Router();

const {auth,isAdmin}=require('../middlewares/auth.js');

const{
    createCollege,
    getAllColleges,
    getCollegeById,
    updateCollege
}=require('../controllers/college_Data.controller.js')

router.post('/create',auth,isAdmin,createCollege)
router.put('/:collegeId',auth,isAdmin,updateCollege)

router.get('/',getAllColleges)
router.get('/:collegeId',getCollegeById)

module.exports=router