const mongoose = require('mongoose');

const UtilitySchema = new mongoose.Schema({
    // Location Description
    state: { type: String, required: true },
    buildingZone: { type: String, required: true },
    reportDate: { type: String, required: true },
    reportTime: { type: String, required: true },

    // Inspector Details
    inspectorName: { type: String, required: true },
    utilityLocationType: { type: String, required: true },

    // Utility Specifics
    utilityName: { type: String, required: true },
    utilityCode: { type: String },
    
    // Condition (1-5)
    conditionKey: { type: Number, required: true },
    
    // Maintenance Dates
    lastInspectionDate: { type: String },
    lastMaintenanceDue: { type: String },
    nextMaintenanceDue: { type: String },

    // Actions & Category
    actionRequired: { type: String, required: true },
    utilityCategory: { type: String, required: true },
    faultDetails: { type: String, required: true },
    readyToSubmit: { type: String, default: 'Yes' }
}, { timestamps: true });

module.exports = mongoose.model('Utility', UtilitySchema);