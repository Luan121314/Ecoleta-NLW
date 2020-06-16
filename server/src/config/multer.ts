import multer from 'multer';
import path from 'path';
import cripto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads', 'multerUploads'),
        filename: (request, file, callback)=>{
            const hash = cripto.randomBytes(6).toString('hex');
            const filename = `${hash}-${file.originalname}`;
            callback(null, filename);
        }
    })
}