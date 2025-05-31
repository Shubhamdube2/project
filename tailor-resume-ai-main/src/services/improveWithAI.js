import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const improveWithGemini = async (resumeTextList) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `I am giving you an array, each item in the array is a string, each string is part of a resume of a candidate, update each string by making it more impactful and each item should be at least 60 words long. Return me a JSON, it should have a key "response" and its value should be the updated array (the sequence of items should be the same). This is the array: ${JSON.stringify(resumeTextList)}`;

  const result = await model.generateContent(prompt);
  const responseText = await result.response.text();
  const jsonResponse = JSON.parse(responseText);
  return jsonResponse["response"];
};

export const improveResumeWithGPT = async (inputResume) => {
  const originalProjectDescriptions = inputResume.projectList.map((item) => item.description);
  const originalExperienceDescriptions = inputResume.experienceList.map((item) => item.description);

  const resumeTextListToImprove = [...originalProjectDescriptions, ...originalExperienceDescriptions];
  const improvedResumeTextList = await improveWithGemini(resumeTextListToImprove);

  const updatedProjectDescriptions = improvedResumeTextList.splice(0, originalProjectDescriptions.length);
  const updatedExperienceDescriptions = improvedResumeTextList;

  const improvedResumeJSON = JSON.parse(JSON.stringify(inputResume));

  // Update project descriptions
  improvedResumeJSON.projectList.forEach((item, index) => {
    item.description = updatedProjectDescriptions[index];
  });

  // Update experience descriptions
  improvedResumeJSON.experienceList.forEach((item, index) => {
    item.description = updatedExperienceDescriptions[index];
  });

  return improvedResumeJSON;
};