var express = require('express')
var router = express.Router()

/**
 * @route   POST api/login
 * @desc    logging in user
 * @access  Private
 */

router.get('/', function (req, res) {
    res.json({status: 'logged in'})
})

module.exports = router;