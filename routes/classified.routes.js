const { Router } = require('express')
const config = require('config')
const Classified = require('../models/Classified')
const router = Router()
const multer = require('multer')
const auth = require('../middleware/verifyToken')

class APIfeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }
  filtering() {
    const queryObj = { ...this.queryString } //queryString = req.query
    const excludedFields = ['page', 'sort', 'limit']
    excludedFields.forEach((el) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => '$' + match
    )
    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr))
    return this
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }
  paginating() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './client/public/uploads')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  },
})
const upload = multer({ storage: storage }) //.array('files',6)

//POST A NEW CLASSIFIED
router.post(
  '/generate',
  auth, //Middleware to confirm authorization
  upload.array('MultipleImages'),
  async (req, res) => {
    try {
      let filesArray = []
      req.files.forEach((element) => {
        filesArray.push(element.originalname)
      })
      const classified = new Classified({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        subcategory: req.body.subcategory,
        //classifiedImage: req.file.originalname,
        MultipleImages: filesArray,
        owner: req.body.owner,
      })
      await classified.save()
      res.status(201).json(classified)
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

//SHOW ALL CLASSIFIEDS
router.get(
  '/',
  /**/ async (req, res) => {
    try {
      const features = new APIfeatures(Classified.find(), req.query)
        .filtering()
        .sorting()
        .paginating()

      const classifieds = await features.query
      res.json(classifieds)
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

//REQUEST A SPECIFIC CLASSIFIED
router.get(
  '/:id',
  /**/ async (req, res) => {
    try {
      const classified = await Classified.findById(req.params.id)
      console.log(classified)
      res.json(classified)
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
)

//UPDATE A SPECIFIC CLASSIFIED
router.put('/:id', upload.single('classifiedImage'), async (req, res) => {
  try {
    await Classified.findById(req.params.id).then((classified) => {
      classified.title = req.body.title
      ;(classified.description = req.body.description),
        (classified.price = req.body.price),
        (classified.category = req.body.category),
        (classified.classifiedImage = req.file.originalname)

      classified.save().then(() => res.json(classified))
    })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
