require('dotenv').config();
const sequelize = require('./src/config/database');
const { Profile, Teacher } = require('./src/models');

async function test() {
  console.log('Testing Profile update...');
  const profile = await Profile.findOne({ where: { section_key: 'sejarah' } });
  if (profile) {
    console.log('Before Profile:', profile.toJSON());
    await profile.update({ image: 'https://via.placeholder.com/500' });
    console.log('After Profile:', profile.toJSON());
  } else {
    console.log('No profile found.');
  }

  console.log('Testing Teacher update...');
  const teacher = await Teacher.findOne();
  if (teacher) {
    console.log('Before Teacher:', teacher.toJSON());
    await teacher.update({ photo: 'https://via.placeholder.com/300' });
    console.log('After Teacher:', teacher.toJSON());
  } else {
    console.log('No teacher found.');
  }
}
test().catch(console.error).finally(() => process.exit());
