import { MongoClient } from 'mongodb'

declare global {
  var mongoose: {
    conn: any
    promise: any
  }
}

export {}
