import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/config";
const GET = async (req, res) => {
  try {
    await connectToDB();
    const allPrompts = await Prompt.find({ creator: req.query.id }).populate(
      "creator"
    );
    console.log(allPrompts);

    res.status(200).json(allPrompts);
  } catch (error) {
    console.error("Error creating a new prompt:", error.message);
    res.status(500).send("Failed to create a new prompt");
  }
};

export default GET;
