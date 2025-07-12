import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 11, // Max 1 profileImage + 10 moreImages
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, GIF, and WEBP image files are allowed!"), false);
        }
    },
});

export default upload;