import dotenv from "dotenv";
dotenv.config();

import app from "./index.js";
const PORT = process.env.PORT || 6500;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
