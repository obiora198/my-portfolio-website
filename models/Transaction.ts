import mongoose, { Schema, model, models } from 'mongoose'

export interface ITransaction {
  requestId: string
  serviceID: string
  amount: number
  phone: string
  billersCode?: string
  variationCode?: string
  status: string
  description: string
  whatsappNumber?: string
  email?: string
  operatorId?: string
  countryCode?: string
  productTypeId?: string
  timestamp: Date
  activeTab: string
}

const TransactionSchema = new Schema<ITransaction>({
  requestId: { type: String, required: true, unique: true },
  serviceID: { type: String, required: true },
  amount: { type: Number, required: true },
  phone: { type: String, required: true },
  billersCode: { type: String },
  variationCode: { type: String },
  status: { type: String, default: 'initiated' },
  description: { type: String },
  whatsappNumber: { type: String },
  email: { type: String },
  operatorId: { type: String },
  countryCode: { type: String },
  productTypeId: { type: String },
  timestamp: { type: Date, default: Date.now },
  activeTab: { type: String },
})

const Transaction =
  models.Transaction || model<ITransaction>('Transaction', TransactionSchema)

export default Transaction
