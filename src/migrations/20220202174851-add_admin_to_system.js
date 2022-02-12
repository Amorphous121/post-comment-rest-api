const bcypt = require('bcrypt');

module.exports = {
  async up(db, client) {
    const adminData = {
      firstName: 'System',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'admin' ,
      posts: [],
      comments: [],
      isDeleted: false
    };

    adminData.password = await bcypt.hash(
      adminData.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );
    await db.collection('users').insertOne(adminData);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
