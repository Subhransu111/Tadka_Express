require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');

const createSuperAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ role: 'superadmin' });
    if (existing) {
        console.log('Superadmin already exists:', existing.phone);
        process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
        name: 'Super Admin',
        phone: '9999999999',
        passwordHash,
        role: 'superadmin',
        referralCode: `TADKA-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    });

    console.log('Superadmin created!');
    console.log('   Phone:', admin.phone);
    console.log('   Password: Admin@123');
    console.log('   ⚠️  Change password after first login!');
    process.exit(0);
};

createSuperAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});