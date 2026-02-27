const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dtqthpufw",
  api_key: 993152664389299,
  api_secret: "ydJdNcFhvojm1q8ZAxBjPi8FXNM",
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, filename, folder = "vibe-blog") => {
  return new Promise((resolve, reject) => {
    // Create a unique filename
    const uniqueFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
          public_id: uniqueFilename,
          transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto:good" },
            { format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          }
        },
      )
      .end(buffer);
  });
};

// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

// Helper function to generate optimized URL variations
const getOptimizedUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = "fill",
    quality = "auto:good",
    format = "auto",
  } = options;

  return cloudinary.url(publicId, {
    transformation: [{ width, height, crop }, { quality }, { format }],
  });
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
};

