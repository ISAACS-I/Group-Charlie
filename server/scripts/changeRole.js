require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const email = process.argv[2];
const role = process.argv[3];

if (!email || !role) {
    console.log('Usage: node scripts/changeRole.js <email> <role>');
    process.exit(1);
}

const changeRole = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`No user found with email "${email}"`);
            process.exit(1);
        }

        const previousRole = user.role;

        user.role = role;

        await user.save();

        console.log(`\nDone! ${user.firstName} ${user.lastName} changed from "${previousRole}" to "${user.role}"\n`);

    } catch (err) {

        console.error('Error:', err.message);

    } finally {

        mongoose.disconnect();
    }
};

changeRole();