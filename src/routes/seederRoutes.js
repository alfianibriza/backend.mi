const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// Route to run adminSeeder
router.get('/run-admin-seeder', (req, res) => {
  const seederPath = path.join(__dirname, '../seeders/adminSeeder.js');
  
  exec(`node "${seederPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Seeder exec error: ${error}`);
      return res.status(500).json({ 
        success: false, 
        message: 'Seeder failed to run', 
        error: error.message,
        stderr: stderr
      });
    }
    
    console.log(`Seeder stdout: ${stdout}`);
    res.json({ 
      success: true, 
      message: 'Seeder run successfully!', 
      output: stdout 
    });
  });
});

module.exports = router;
