//Roi Katz 313299729 Aran Ben Ezra 316256403
const express = require('express');
const router = express.Router();
const reports = require('../models/reports');
const costs = require('../models/costs');

router.get('/report', async (req, res) => {
    try {

        const user_id = req.query.user_id;
        const year = req.query.year;
        const month = req.query.month;

        if (!user_id || !year || !month) {
            return res.status(400).json({error: "Please submit all needed queries: user_id, year and month"});
        }

        const existingReports = await reports.findOne({
            user_id: user_id,
            year: year,
            month: month
        });

        //Report was already searched for - return it and finish
        if (existingReports)
            return res.status(200).json(existingReports.report);

        const results = await costs.find({
            user_id: user_id,
            year: year,
            month: month
        });

        if (results.length === 0)
            return res.status(400).json({error: "No results were found for your query!"})
        else {
            const newReportItem = new reports({
                user_id: user_id,
                year: year,
                month: month,
            });
            results.forEach(cost => {
                newReportItem.report[cost.category].push({
                    day: cost.day,
                    description: cost.description,
                    sum: cost.sum,
                })
            });

            newReportItem.save(function (error, result) {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    return res.status(200).json(result.report);
                }
            });
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;