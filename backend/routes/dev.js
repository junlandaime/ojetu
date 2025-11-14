const { exec } = require('child_process');
const router = require('express').Router();

router.get('/db-refresh', (req, res) => {
    exec('npm run db:refresh', (error, stdout, stderr) => {
        if (error) return res.send(`Error: ${error.message}`);
        if (stderr) return res.send(`stderr: ${stderr}`);
        res.send(`stdout: ${stdout}`);
    });
});

module.exports = router;
