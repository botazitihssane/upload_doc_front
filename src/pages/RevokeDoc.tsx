import {DocumentsDetailsProps} from "../types/DocumentDetailsProps";
import React, {useState} from "react";
import {Alert, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function RevokeDoc({open, handleClose, document}: DocumentsDetailsProps) {

    const [email, setEmail] = useState('');
    const [permissions, setPermissions] = useState<string[]>(['']);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseSeverity, setResponseSeverity] = useState<'success' | 'error'>('success');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePermissionChange = (event: SelectChangeEvent<string[]>) => {
        const selectedPermissions = event.target.value;
        if (typeof selectedPermissions !== "string") {
            const filteredPermissions = selectedPermissions.filter(permission => permission !== '');
            setPermissions(filteredPermissions);
        }
    };

    const handleRevoke = async () => {
            if (document) {
                const requestBody = {
                    docId: document.id,
                    email: email,
                    droits: permissions,
                };

                const requestBodyString = JSON.stringify(requestBody);

                try {
                    const response = await fetch('http://localhost:8081/api/acces/revoke', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: requestBodyString,
                    });

                    if (response.ok) {
                        setResponseMessage('Access revoked successfully!');
                        setResponseSeverity('success');
                    } else if (response.status === 500) {
                        setResponseMessage("This email does not belong to any user");
                        setResponseSeverity('error');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    ;
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <h2>Restrictions d'acces</h2>
                <div style={{display: 'flex', flexDirection: 'column', marginBottom: '10px'}}>
                    {document && (
                        <TextField
                            label="Document"
                            value={document.nom}
                            disabled
                            style={{marginBottom: '10px'}}
                        />
                    )}
                    <TextField
                        label="Email de l'utilisateur"
                        value={email}
                        onChange={handleEmailChange}
                        style={{marginBottom: '10px'}}
                    />
                    <Select
                        multiple
                        value={permissions}
                        onChange={handlePermissionChange}
                        style={{marginBottom: '10px'}}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        <MenuItem value="ECRITURE">Écriture</MenuItem>
                        <MenuItem value="LECTURE">Lecture</MenuItem>
                    </Select>
                </div>
                {responseMessage && (
                    <Alert severity={responseSeverity} sx={{mb: 2}}>
                        {responseMessage}
                    </Alert>
                )}
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                    <Button onClick={handleRevoke} color="primary" variant="contained">
                        Restreindre
                    </Button>
                    <Button onClick={handleClose} color="secondary" variant="contained">
                        Annuler
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default RevokeDoc;