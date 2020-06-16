import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './style.css'
import {FiUpload} from 'react-icons/fi';

interface Props{
    onfileUploaded: (file: File) => void
}

const Dropzone: React.FC<Props> =({onfileUploaded})=> {
    const onDrop = useCallback(acceptFiles => {
        const file = acceptFiles[0];
        const fileUrl = URL.createObjectURL(file)
        setSelectFileUrl(fileUrl);
        onfileUploaded(file);
    }, []);

    const [selectFileUrl, setSelectFileUrl] = useState('');
    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop,
        accept: 'image/*'
     })

    return (
        <div className="dropzone" {...getRootProps()}  >
            <input {...getInputProps()} accept='image/*' />

            {
                selectFileUrl
                ? <img src={selectFileUrl} alt="Point thumbnail"/>
                :(
                    <p>
                    <FiUpload/>
                    Imagem do estabelecimento</p>
                )
            }
         
        </div>

    )
}

export default Dropzone
