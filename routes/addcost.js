//Roi Katz 313299729 Aran Ben Ezra 316256403
const express = require('express');
const costrouter = express.Router();
const costsmodel = require('../models/costs');
const users = require('../models/users');
const reports = require('../models/reports');

//List of all possible cost item categories
const categories = ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'];
//List of the amount of days in every month
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

costrouter.post("/addcost", async (req, res) => {

    //
    const { user_id, year, month, day, description, category, sum } = req.body;

    //If the user sent an 'id' in the request body
    if (req.body.id) {
        return res.status(400).json({error: 'The id field is auto-generated and cannot be explicitly stated'});
    }

    //If the user picked a category that is notin the list
    if (!categories.includes(category)) {
        return res.status(400).json({error: 'Invalid category'});
    }

    //If the user_id doesn't exist in a entry in the users schema
    const userExists = await users.findOne({ id: user_id });
    if (!userExists) {
        return res.status(400).json({error: "user_id doesn't exist in the users collection"});
    }

    //If the user didn't fill all the required categories
    if (!user_id || !description || !sum) {
        return res.status(400).json({error: "user_id, description, category and sum fields must all include a value!"});
    }

    //If the user picked a day but didn't mention a month
    if (day && !month) {
        return res.status(400).json({error: "If day is provided, month must also be provided"});
    }

    //If the user picked a year in the future or a negative or a non-integer year
    const currentYear = new Date().getFullYear();
    if (year < 0 || year > currentYear || !Number.isInteger(Number(year))) {
        return res.status(400).json({error: 'Invalid year'});
    }

    //If the user picked an invalid month
    const currentMonth = new Date().getMonth()+1;
    if (month < 1 || month > 12 || !Number.isInteger(Number(month))) {
        return res.status(400).json({error: 'Invalid month'});
    }
    else if (Number(year) === currentYear && Number(month) > currentMonth) {
        return res.status(400).json({error: 'Invalid month, cannot add a date in the future'});
    }

    //Calculate whether February of the picked year has 28 or 29 days
    monthDays[1] = year % 4 === 0 ? 29 : 28;

    //If the user picked an invalid day
    const currentDay = new Date().getDate()
    if (day < 1 || day > monthDays[month - 1] || !Number.isInteger(Number(day))) {
        return res.status(400).json({error: 'Invalid day'});
    }
    else if (Number(year) === currentYear && Number(month) === currentMonth && Number(day) > currentDay) {
        return res.status(400).json({error: 'Invalid day, cannot add a date in the future'});
    }

    //If the user typed a negative sum
    if (sum < 0 || isNaN(Number(sum))) {
        return res.status(400).json({error: "sum must be a non-negative number"});
    }

    //In this line all the data is valid. Then, a new cost item will be created
    const costItem = new costsmodel({
        user_id: user_id,
        year: Number(year),
        month: Number(month),
        day: Number(day),
        description: description,
        category: category,
        sum: Number(sum),
    });

    //Checks if a report for the requested user_id, year and month was created in the past
    const report = await reports.findOne({
        user_id: user_id,
        year: Number(year),
        month: Number(month),
    });

    //If a report was found, the new cost item will be added to the relevant category list
    if (report) {
        report.report[category].push({
            day: Number(day),
            description: description,
            sum: Number(sum),
        });

        //Updates the report with the new addition
        await reports.updateOne(
            {
                user_id: user_id,
                year: Number(year),
                month: Number(month),
            },
            { report: report.report }
        );
    }

    //Saves the new cost item in the cost items schema
    await costItem.save()
        .then(user => res.json(user.toObject({ versionKey: false, transform: (doc, ret) => { delete ret._id }})))
        .catch(error => res.status(400).json({error: error.message}));
});

module.exports = costrouter;