const { body, validationResult } = require('express-validator');

// การตรวจสอบสำหรับการ "นัดหมาย"
const appointmentValidationRules = () => {
  return [
    body('user_id').notEmpty().withMessage('กรุณาเลือกคนไข้'),
    body('doctor_name').notEmpty().withMessage('กรุณาระบุชื่อแพทย์').trim(),
    body('app_date').notEmpty().withMessage('กรุณาเลือกวันที่นัดหมาย').isDate().withMessage('รูปแบบวันที่ไม่ถูกต้อง'),
    body('app_time').notEmpty().withMessage('กรุณาเลือกเวลานัดหมาย'),
    body('location').notEmpty().withMessage('กรุณาระบุสถานที่นัดหมาย'),
    body('note').notEmpty().withMessage('กรุณาระบุหมายเหตุ (หากไม่มีให้ใช้ -)')
  ];
};

// การตรวจสอบสำหรับ "ข้อมูลผู้ป่วย"
const userValidationRules = () => {
  return [
    body('id_card')
      .isLength({ min: 13, max: 13 }).withMessage('เลขบัตรประชาชนต้องมี 13 หลัก')
      .isNumeric().withMessage('เลขบัตรประชาชนต้องเป็นตัวเลขเท่านั้น'),
    body('firstname').notEmpty().withMessage('กรุณากรอกชื่อ'),
    body('lastname').notEmpty().withMessage('กรุณากรอกนามสกุล'),
    body('birthday').notEmpty().withMessage('กรุณาเลือกวันเกิด'),
    body('age').isInt({ min: 0 }).withMessage('อายุต้องเป็นตัวเลขที่ถูกต้อง'),
    body('gender').notEmpty().withMessage('กรุณาเลือกเพศ'),
    body('checkup_date').notEmpty().withMessage('กรุณาเลือกวันที่เข้าตรวจ'),
    body('diagnosis').notEmpty().withMessage('กรุณากรอกการวินิจฉัย (หากไม่มีให้ใช้ -)')
  ];
};


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => err.msg);
  return res.status(400).json({
    message: "ข้อมูลไม่ถูกต้องตามระเบียบ",
    errors: extractedErrors
  });
};

module.exports = { 
  appointmentValidationRules, 
  userValidationRules, 
  validate 
};