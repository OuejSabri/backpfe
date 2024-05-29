
const Assignment = require("../models/assignment");
const fs = require('fs')
exports.createAssignment = async (req, res) => {
  try {
    if (!req.files?.assignement[0]) {
      return res.status(400).json({ error: 'Aucun fichier trouvé' });
    }
    const cName = `${Date.now().toLocaleString()}-${req.files?.assignement[0]?.originalname}`
    const exist = fs.existsSync('./uploads')
    if (!exist) fs.mkdirSync('./uploads', { recursive: true })
    fs.writeFileSync(`uploads/${cName}`, req.files.assignement[0].buffer)
    let path = `${process.env.SERVERPATH}/uploads/${cName}`;
    const newAssignment = await Assignment.create({
      fileName: req.files?.assignement[0]?.originalname,
      filePath: path,
      candidature: req.body.candidature
    });
    return res.status(201).json({
      status: "success",
  
      data: newAssignment,
    });
  } catch (err) {
   return res.status(422).json({
      status: "err",
  
      data: err,
    });

  }
};

exports.getAssignmentById = async (req, res) => {
  const assignment = await Assignment.findOne({candidature:req.params.id});
  return res.status(200).json({
    status: "success",
    data: assignment,
  });
};

exports.getAllAssignments = async (res) => {
  const assignments = await Assignment.find();
 return res.status(200).json({
    status: "success",
    data: assignments,
  });
};
