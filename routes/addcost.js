//Roi Katz 313299729 Aran Ben Ezra 316256403
const express = require('express');
const costrouter = express.Router();
const costsmodel = require('../models/costs');
const users = require('../models/users');
const reports = require('../models/reports');

const categories = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

costrouter.post("/addcost", async (req, res) => {

    const { user_id, year, month, day, description, category, sum } = req.body;

    if (req.body.id) {
        return res.status(400).json({error: 'The id field is auto-generated and cannot be explicitly stated'});
    }

    if (!categories.includes(category)) {
        return res.status(400).json({error: 'Invalid category'});
    }

    const userExists = await users.findOne({ id: user_id });
    if (!userExists) {
        return res.status(400).json({error: "user_id doesn't exist in the users collection"});
    }

    if (!user_id || !description || !sum) {
        return res.status(400).json({error: "user_id, description, category and sum fields must all include a value!"});
    }

    if (day && !month) {
        return res.status(400).json({error: "If day is provided, month must also be provided"});
    }

    const currentYear = new Date().getFullYear();
    if (year < 0 || year > currentYear) {
        return res.status(400).json({error: 'Invalid year'});
    }


    if (month < 1 || month > 12) {
        return res.status(400).json({error: 'Invalid month'});
    }

    monthDays[1] = year % 4 === 0 ? 29 : 28;

    if (day < 1 || day > monthDays[month - 1]) {
        return res.status(400).json({error: 'Invalid day'});
    }

    if (sum < 0) {
        return res.status(400).json({error: "sum must be a non-negative number"});
    }

    const costItem = new costsmodel({
        user_id: user_id,
        year: year,
        month: month,
        day: day,
        description: description,
        category: category,
        sum: sum
    })

    const report = await reports.findOne({
        user_id: user_id,
        year: year,
        month: month,
    });

    if (report) {
        report.report[category].push({
            day: day,
            description: description,
            sum: sum,
        });
        await reports.updateOne(
            {
                user_id: user_id,
                year: year,
                month: month,
            },
            { report: report.report}
        );
    }

    await costItem.save()
        .then(user => res.json(user.toObject({ versionKey: false, transform: (doc, ret) => { delete ret._id }})))
        .catch(error => res.status(400).json({error: error.message}));
});

module.exports = costrouter
