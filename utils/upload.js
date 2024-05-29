const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage, fileFilter: (req, file, cb) => {
        cb(null, true)
    }
})

module.exports = upload 

