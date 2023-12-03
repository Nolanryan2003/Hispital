import asyncHandler from "express-async-handler";
import { MainPatient } from "../models/patientModel.js";
import { Consultation } from "../models/consultModel.js";
import { HistoryConsultation } from "../models/historyConsultModel.js";

const getAllConsults = asyncHandler(async (req, res) => {
  try {
    const consults = await Consultation.find().populate({
      path: "patientReference",
      select: "firstName lastName age doctorAssigned",
    });
    res.json(consults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOneConsults = asyncHandler(async (req, res) => {
  const { id } = req.body;
  try {
    const consults = await Consultation.findById(id).populate({
      path: "patientReference",
      select: "firstName lastName age doctorAssigned",
    });
    res.json(consults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const createOneConsult = asyncHandler(async (req, res) => {
  const { dateOfBirth, diagnosis, status, phoneNumber, additionalNotes } =
    req.body;

  try {
    // Find the patient by date of birth
    const patient = await MainPatient.findOne({ dateOfBirth: dateOfBirth });

    // Check if patient exists
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Create a new consultation with the patient's ID
    const newConsult = {
      patientReference: patient._id,
      diagnosis,
      status,
      phoneNumber,
      additionalNotes,
    };

    const consult = await Consultation.create(newConsult);

    // Populate the response with patient details
    const populatedConsult = await Consultation.findById(consult._id).populate({
      path: "patientReference",
      select: "firstName lastName age doctorAssigned", // Adjust these fields based on your model's structure
    });

    res.status(201).json(populatedConsult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteConsult = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Find the consult by ID
    const consult = await Consultation.findById(id).populate({
      path: "patientReference",
      select: "firstName lastName age doctorAssigned",
    });

    if (!consult) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Save to HistoryModel
    const historyConsult = new HistoryConsultation(consult.toObject());
    await historyConsult.save();

    // Delete the original consult
    await Consultation.findByIdAndDelete(id);

    res.json({
      message: "Consultation moved to history and deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getDeletedConsults = asyncHandler(async (req, res) => {
  try {
    const consult = await HistoryConsultation.find().populate({
      path: "patientReference",
      select: "firstName lastName age doctorAssigned",
    });

    res.json(consult);
  } catch (error) {
    res.json(error);
  }
});

export {
  getAllConsults,
  createOneConsult,
  deleteConsult,
  getOneConsults,
  getDeletedConsults,
};
