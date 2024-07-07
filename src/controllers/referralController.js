const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

const createReferral = async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail, refereePhone ,course} = req.body;

  try {
    // Validation
    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail || !refereePhone || !course ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        refereePhone,
        course
      },
    });

    // Send referral email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: refereeEmail,
      subject: 'Course Referral',
      text: `Hello ${refereeName},\n\nYou have been referred to our course by ${referrerName}.\n\nBest regards,\nAccredian`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(referral);
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'An error occurred while creating the referral' });
  }
};

module.exports = {
  createReferral,
};
