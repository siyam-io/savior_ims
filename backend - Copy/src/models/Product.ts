import { Schema, model, Document, Types } from 'mongoose';

interface IProductSize {
    size: Types.ObjectId;
    quantity: number;
}

export interface IProduct extends Document {
    vendor: Types.ObjectId;
    category: Types.ObjectId;
    subCategory?: Types.ObjectId; // Optional
    productName: string;
    fabric?: string;
    price: number;
    inventory: IProductSize[];
    totalStock: number;
    image?: string;
    lastUpdatedBy: Types.ObjectId;
}

const productSchema = new Schema<IProduct>({
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    productName: { type: String, required: true },
    fabric: { type: String },
    price: { type: Number, required: true },
    inventory: [{
        size: { type: Schema.Types.ObjectId, ref: 'Size', required: true },
        quantity: { type: Number, default: 0, min: 0 }
    }],
    totalStock: { type: Number, default: 0 },
    image: { type: String },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

productSchema.pre<IProduct>('save', function () {
    // এখানে 'this' সরাসরি ডকুমেন্টকে রিপ্রেজেন্ট করে
    if (this.inventory) {
        // quantity undefined থাকলে ০ ধরে ক্যালকুলেট করবে
        this.totalStock = this.inventory.reduce((acc, item) => acc + (item.quantity || 0), 0);
    }
    
    // সিঙ্ক্রোনাস ফাংশন হওয়ায় কোনো next() কল করার প্রয়োজন নেই।
    // ফাংশন শেষ হলেই Mongoose বুঝে নিবে সেভ কন্টিনিউ করতে হবে।
});
export const Product = model<IProduct>('Product', productSchema);