import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {DocumentsDetailsProps} from "../types/DocumentDetailsProps";
import {Metadata} from "../types/Metadata";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function DocumentsDetails({document, open, handleClose}: DocumentsDetailsProps) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6">Document Details</Typography>
                {document ? (
                    <>
                        <Typography>ID: {document.id}</Typography>
                        <Typography>Nom: {document.nom}</Typography>
                        <Typography>Type: {document.type}</Typography>
                        <Typography>Date de création: {document.dateCreation}</Typography>
                        {document.metadataResponse.map((metadata: Metadata) => (
                            <Typography key={metadata.id}>
                                {capitalizeFirstLetter(metadata.cle)}: {metadata.valeur}
                            </Typography>
                        ))}
                    </>
                ) : (
                    <Typography>No document selected</Typography>
                )}
            </Box>
        </Modal>
    );
}

export default DocumentsDetails;
