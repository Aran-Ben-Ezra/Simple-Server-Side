//Roi Katz 313299729 Aran Ben Ezra 316256403
const express = require('express');
const router = express.Router();
const reports = require('../models/reports');
const costs = require('../models/costs');

router.get('/report', async (req, res) => {
    try {

        //Finds the user queries and saves them in variables
        const user_id = req.query.user_id;
        const year = req.query.year;
        const month = req.query.month;

        //When one or more of the key queries are missing
        if (!user_id || !year || !month) {
            return res.status(400).json({error: "Please submit all needed queries: user_id, year and month"});
        }

        //Checks if a report with the sent queries already exists
        const existingReports = await reports.findOne({
            user_id: user_id,
            year: year,
            month: month,
        });

        //Report was already searched for - return it and finish
        if (existingReports)
            return res.status(200).json(existingReports.report);

        //A report was not found - a new one should be created. Looking for cost items with the same user_id, year and month
        const results = await costs.find({
            user_id: user_id,
            year: year,
            month: month,
        });

        //If no cost items were found
        if (results.length === 0)
            return res.status(400).json({error: "No results were found for your query!"})
        else {
            //Creates a new report item
            const newReportItem = new reports({
                user_id: user_id,
                year: year,
                month: month,
            });
            //For each cost item, adds it to the relevant category list in the report
            results.forEach(cost => {
                newReportItem.report[cost.category].push({
                    day: cost.day,
                    description: cost.description,
                    sum: cost.sum,
                })
            });

            //Saves the report in the report schema
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