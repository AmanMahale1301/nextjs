import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/config";
import { json } from "express";

const POST = async (req, res) => {
  const data = await JSON.parse(req.body);
  // return console.log(data);
  const { userId, prompt, tag } = data;

  try {
    await connectToDB();
    const newPrompt = new Prompt({ creator: userId, prompt, tag });
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("Error creating a new prompt:", error.message);
    res.status(500).send("Failed to create a new prompt");
  }
};

export default POST;
