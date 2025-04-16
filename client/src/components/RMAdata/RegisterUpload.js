import React, { useState } from 'react';

const RegisterUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // Replace with your upload URL
            fetch(`${process.env.REACT_APP_BASE_URL}/data-upload`, {
                method: 'POST',
                credentials:'include',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('File uploaded successfully:', data);
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        } else {
            alert('Please select a file to upload');
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default RegisterUpload;