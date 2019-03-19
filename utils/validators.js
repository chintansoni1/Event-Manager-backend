import Mongoose from 'mongoose'

class Validators {

  constructor() {
    this.err = new Error()
  }

  validateMongoId(id) {
    return new Promise((resolve, reject) => {
      if (Mongoose.Types.ObjectId.isValid(id)) {
        resolve(true)
      } else {
        this.err.type = "MongoIdInvalid"
        reject(this.err)
      }
    })
  }

  checkRecords(data) {
    return new Promise((resolve, reject) => {
      this.err.type = "NoRecords"
      data ? resolve(true) : reject(this.err)
    })
  }

  checkUpdated(data) {
    return new Promise((resolve, reject) => {
      this.err.type = "NoRecords"
      data.nModified ? resolve(true) : reject(this.err)
    })
  }
}

export default new Validators()