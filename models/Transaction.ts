import mongoose, { Schema, model, models } from 'mongoose'

export interface ITransaction {
  requestId: string
  serviceID: string
  amount: number
  phone: string
  billersCode?: string
  variationCode?: string
  status: string // general status (delivered, successful, failed, initiated, pending)
  description?: string
  whatsappNumber?: string
  email?: string
  customerName?: string // KYC compliance
  operatorId?: string
  countryCode?: string
  productTypeId?: string
  token?: string
  timestamp: Date
  activeTab?: string

  // Paystack & Payment fields
  paymentReference?: string
  paymentStatus?: 'pending' | 'success' | 'failed' | 'abandoned'
  paymentGateway?: 'paystack'
  deliveryStatus?: 'not_started' | 'processing' | 'delivered' | 'failed' | 'pending_review'
  lockedAt?: Date
  paidAt?: Date
  refundRequired?: boolean
  vtpassResponse?: any

  // Pricing breakdown & reconciliation
  serviceFee?: number // Platform markup in Naira (direct margin)
  totalPaid?: number // Platform total sent to Paystack (amount + serviceFee) in Naira
  paystackChargedAmount?: number // Gross amount charged from customer's card (from Paystack webhook event.data.amount / 100)

  // Dispute & Chargeback tracking
  disputeStatus?: 'none' | 'pending' | 'resolved' | 'lost'
  disputeData?: any
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
  customerName: { type: String }, // KYC compliance
  operatorId: { type: String },
  countryCode: { type: String },
  productTypeId: { type: String },
  token: { type: String },
  timestamp: { type: Date, default: Date.now },
  activeTab: { type: String },

  // Paystack & Payment fields
  paymentReference: { type: String, unique: true, sparse: true, index: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'abandoned'],
    default: 'pending',
  },
  paymentGateway: { type: String, default: 'paystack' },
  deliveryStatus: {
    type: String,
    enum: ['not_started', 'processing', 'delivered', 'failed', 'pending_review'],
    default: 'not_started',
  },
  lockedAt: { type: Date },
  paidAt: { type: Date },
  refundRequired: { type: Boolean, default: false },
  vtpassResponse: { type: Schema.Types.Mixed },

  // Pricing breakdown & reconciliation
  serviceFee: { type: Number, default: 0 },
  totalPaid: { type: Number },
  paystackChargedAmount: { type: Number },

  // Dispute & Chargeback tracking
  disputeStatus: {
    type: String,
    enum: ['none', 'pending', 'resolved', 'lost'],
    default: 'none',
  },
  disputeData: { type: Schema.Types.Mixed },
})

if (
  mongoose.models.Transaction &&
  (!mongoose.models.Transaction.schema.path('paymentReference') ||
   !mongoose.models.Transaction.schema.path('totalPaid'))
) {
  delete mongoose.models.Transaction
}

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)

export default Transaction

