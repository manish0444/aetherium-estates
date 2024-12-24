import mongoose from 'mongoose';

const listingViewSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure unique views per device
listingViewSchema.index({ listingId: 1, deviceId: 1 }, { unique: true });

const ListingView = mongoose.model('ListingView', listingViewSchema);

export default ListingView; 