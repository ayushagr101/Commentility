// ocr_space_test.js
// Usage:
//   node ocr_space_test.js
//
// Edit the constants below: API_KEY and IMAGE_PATH (or use env vars)

// Required packages
import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const OCR_API_URL = "https://api.ocr.space/parse/image";

const parseOcrText = (data) =>
  (data?.ParsedResults || [])
    .map((result) => result?.ParsedText || "")
    .join("\n")
    .trim();

const buildOcrFormData = (imageUrl) => {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  if (!apiKey) {
    throw new Error("OCR_SPACE_API_KEY is not configured");
  }

  const form = new FormData();
  form.append("apikey", apiKey);
  form.append("language", process.env.OCR_LANGUAGE || "eng");
  form.append("isOverlayRequired", (process.env.OCR_OVERLAY === "true").toString());
  form.append("detectOrientation", (process.env.OCR_DETECT_ORIENTATION !== "false").toString());
  form.append("url", imageUrl);

  return form;
};

export const handleOcrUpload = async (req, res) => {
  const localFilePath = req.file?.path;

  if (!localFilePath) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    const uploadResult = await uploadOnCloudinary(localFilePath);

    if (!uploadResult || (!uploadResult.secure_url && !uploadResult.url)) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    const imageUrl = uploadResult.secure_url || uploadResult.url;

    const form = buildOcrFormData(imageUrl);
    const { data } = await axios.post(OCR_API_URL, form, {
      headers: form.getHeaders(),
      timeout: 120000,
    });

    if (data?.IsErroredOnProcessing) {
      return res.status(400).json({
        message: "OCR provider returned an error",
        error: data?.ErrorMessage || data?.ErrorDetails,
      });
    }

    const text = parseOcrText(data);

    return res.status(200).json({
      message: "OCR processed successfully",
      text,
      raw: data,
      imageUrl,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message || "Failed to process OCR";

    return res.status(status).json({
      message: "Failed to process OCR",
      error: errorMessage,
    });
  }
};