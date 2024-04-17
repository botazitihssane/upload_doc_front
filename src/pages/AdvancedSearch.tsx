import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import {AdvancedSearchProps} from "../types/AdvancedSearchProps";
import {Metadata} from "../types/Metadata";
import RemoveIcon from '@mui/icons-material/Remove';
import {Alert} from "@mui/material";

function AdvancedSearch({open, handleClose, handleSearchResults}: AdvancedSearchProps) {
    const [metadataList, setMetadataList] = useState<Metadata[]>([{id: '', cle: '', valeur: ''}]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAddMetadata = () => {
        setMetadataList([...metadataList, {id: '', cle: '', valeur: ''}]);
    };
    const handleRemoveMetadata = (index: number) => {
        const updatedList = metadataList.filter((_, idx) => idx !== index);
        setMetadataList(updatedList);
    };
    const handleMetadataChange = (index: number, field: keyof Metadata, newValue: string) => {
        const updatedList = metadataList.slice();
        updatedList[index][field] = newValue;
        setMetadataList(updatedList);
    };

    const handleSearch = async () => {
        try {
            const queryParams = new URLSearchParams();

            metadataList.forEach(({cle, valeur}) => {
                if (cle && valeur) {
                    queryParams.append(cle, valeur);
                    console.log(queryParams);
                }
            });

            const url = `http://localhost:8081/api/document/search/metadata?${queryParams.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No metadata found for the specified criteria.');
                }
            }

            const data = await response.json();
            handleSearchResults(data);
            setErrorMessage(null);
            handleClose();

        } catch (error) {
            console.error('Error fetching documents:', error);
            setErrorMessage('No metadata found for the specified criteria.');
        }
    }


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <h2>Recherche avancée</h2>
                {metadataList.map((metadata, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <TextField
                            label="Metadata"
                            value={metadata.cle}
                            onChange={(e) => handleMetadataChange(index, 'cle', e.target.value)}
                            style={{marginRight: '10px'}}
                        />
                        <TextField
                            label="Valeur"
                            value={metadata.valeur}
                            onChange={(e) => handleMetadataChange(index, 'valeur', e.target.value)}
                        />
                        {metadataList.length > 1 && (
                            <IconButton onClick={() => handleRemoveMetadata(index)} color="error" sx={{ml: 1}}>
                                <RemoveIcon/>
                            </IconButton>
                        )}
                        {index === metadataList.length - 1 && (
                            <IconButton onClick={handleAddMetadata} color="primary" sx={{ml: 1}}>
                                <AddIcon/>
                            </IconButton>
                        )}
                    </div>
                ))}
                {errorMessage && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {errorMessage}
                    </Alert>
                )}
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                    <Button onClick={handleSearch} color="primary" variant="contained">
                        Rechercher
                    </Button>
                    <Button onClick={handleClose} color="secondary" variant="contained">
                        Annuler
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default AdvancedSearch;
