import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['apartment', 'house', 'room', 'land', 'office', 'villa']
    },
    propertyStatus: {
      type: String,
      required: true,
      enum: ['ready', 'underConstruction', 'offPlan']
    },
    furnishing: {
      type: String,
      enum: ['unfurnished', 'semiFurnished', 'furnished']
    },
    currency: {
      type: String,
      default: 'NPR',
      enum: ['NPR', 'USD', 'INR', 'custom']
    },
    customCurrency: String,
    maintenanceFees: {
      type: Number,
      default: 0
    },
    deposit: {
      type: Number,
      default: 0
    },
    paymentFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    amenities: {
      type: Map,
      of: Boolean,
      default: {}
    },
   status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  }
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
