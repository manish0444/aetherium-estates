import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'OTHER'],
    required: true
  },
  targetType: {
    type: String,
    enum: ['USER', 'LISTING', 'REVIEW', 'COMMENT', 'OTHER'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED'
  }
}, { timestamps: true });

// Add indexes for better query performance
adminActionSchema.index({ adminId: 1, createdAt: -1 });
adminActionSchema.index({ actionType: 1, targetType: 1 });

// Add a method to create a standardized action description
adminActionSchema.methods.getActionDescription = function() {
  const actionVerb = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    DELETE: 'Deleted',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    OTHER: 'Performed action on'
  }[this.actionType];

  const targetName = {
    USER: 'user',
    LISTING: 'listing',
    REVIEW: 'review',
    COMMENT: 'comment',
    OTHER: 'item'
  }[this.targetType];

  return `${actionVerb} ${targetName} ${this.details.name || this.targetId}`;
};

// Add a static method to log admin actions
adminActionSchema.statics.logAction = async function(data) {
  try {
    const action = new this({
      ...data,
      action: data.action || new this().getActionDescription.call(data)
    });
    return await action.save();
  } catch (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
};

const AdminAction = mongoose.model('AdminAction', adminActionSchema);

export default AdminAction; 