import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listingRoutes from "./routes/listings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/api", listingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🏠 HomeLink API is running!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
