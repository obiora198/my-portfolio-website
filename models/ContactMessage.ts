import mongoose, { Schema, models } from 'mongoose'

export interface IContactMessage {
  name: string
  email: string
  message: string
  source?: string
  createdAt: Date
  updatedAt: Date
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, default: 'portfolio_contact' },
  },
  { timestamps: true }
)

export default models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema)
