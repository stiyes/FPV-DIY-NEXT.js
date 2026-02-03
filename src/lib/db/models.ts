import mongoose, { Schema, Document } from 'mongoose';
import { FPVComponent, BuildConfiguration } from '@/types/fpv';

// 部件Schema
const ComponentSchema = new Schema<FPVComponent & Document>({
  id: { type: String, required: true, unique: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  price: { type: Number, required: true },
  level: { type: String, required: true },
  weight: { type: Number },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  specs: { type: Schema.Types.Mixed, default: {} },
  origin: { type: String, required: true },
  source: { type: String },
  scenes: { type: [String], default: [] },
  material: { type: String },
  mounting: { type: String },
  remarks: { type: String },
  imageUrl: { type: String },
  inStock: { type: Boolean, default: true },
  compatibleWith: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  createdAt: { type: String },
  updatedAt: { type: String },
}, {
  timestamps: true,
  collection: 'components'
});

// 装机配置Schema
const BuildConfigurationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  components: {
    frame: { type: Schema.Types.Mixed },
    motors: { type: [Schema.Types.Mixed] },
    propellers: { type: Schema.Types.Mixed },
    esc: { type: Schema.Types.Mixed },
    fc: { type: Schema.Types.Mixed },
    camera: { type: Schema.Types.Mixed },
    vtx: { type: Schema.Types.Mixed },
    antenna: { type: Schema.Types.Mixed },
    receiver: { type: Schema.Types.Mixed },
    battery: { type: Schema.Types.Mixed },
    goggles: { type: Schema.Types.Mixed },
    radio: { type: Schema.Types.Mixed },
    charger: { type: Schema.Types.Mixed },
    accessories: { type: [Schema.Types.Mixed] },
  },
  totalPrice: { type: Number, default: 0 },
  totalWeight: { type: Number, default: 0 },
  estimatedFlightTime: { type: Number },
  skillLevel: { type: String, required: true },
  tags: { type: [String], default: [] },
  author: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String },
  isPublic: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'builds'
});

// 防止重复编译模型
export const Component = mongoose.models.Component || mongoose.model<FPVComponent & Document>('Component', ComponentSchema);
export const Build = mongoose.models.Build || mongoose.model('Build', BuildConfigurationSchema);
