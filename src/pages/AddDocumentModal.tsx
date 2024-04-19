import {
    Alert,
    AlertTitle,
    Box,
    Button,
    IconButton,
    Modal,
    Snackbar,
    TextField,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {Metadata} from "../types/Metadata";
import axios from "axios";

function AddDocumentModal({
                              isOpen,
                              onClose,
                              reloadDocuments,
                          }: {
    isOpen: boolean;
    onClose: () => void;
    reloadDocuments: () => void;
}) {
    const [metadataList, setMetadataList] = useState<Metadata[]>([
        {id: "", cle: "", valeur: ""},
    ]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpenAdd, setSnackbarOpenAdd] = useState(false);
    const [snackbarMessageAdd, setSnackbarMessageAdd] = useState("");

    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [dateCreation, setDateCreation] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSave = async () => {
        try {
            const metadataMap = metadataList.reduce<{ [key: string]: string }>(
                (acc, cur) => {
                    acc[cur.cle] = cur.valeur;
                    return acc;
                },
                {}
            );

            const formData = new FormData();
            formData.append("nom", nom);
            formData.append("type", type);
            formData.append("email", email);
            formData.append("dateCreation", dateCreation);
            formData.append("metadata", JSON.stringify(metadataMap)); // Convert to JSON string
            if (file) {
                formData.append("file", file);
            }

            // Make POST request to save document
            const response = await axios.post(
                "http://localhost:8081/api/document/save",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Handle successful response
            setSnackbarMessageAdd("Document saved successfully ");
            setSnackbarOpenAdd(true);
            console.log("Document saved successfully:", response.data);
            reloadDocuments(); // Call the function to reload documents

            onClose();
        } catch (error: any) {
            // Handle error
            console.error("Error saving document:", error);
            if (error.response && error.response.status === 409) {
                // File already exists, show alert
                setSnackbarMessage("File Already exist ");
                setSnackbarOpen(true);
            } else {
                // Other errors, set error message
                setErrorMessage("Error saving document. Please try again.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };
    const handleAddMetadata = () => {
        setMetadataList([...metadataList, {id: "", cle: "", valeur: ""}]);
    };
    const handleRemoveMetadata = (index: number) => {
        const updatedList = metadataList.filter((_, idx) => idx !== index);
        setMetadataList(updatedList);
    };
    const handleMetadataChange = (
        index: number,
        field: keyof Metadata,
        newValue: string
    ) => {
        const updatedList = metadataList.slice();
        updatedList[index][field] = newValue;
        setMetadataList(updatedList);
    };
    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="modal-title">Add New Document</h2>
                    <TextField
                        label="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <input
                        id="contained-button-file"
                        multiple
                        type="file"
                        style={{display: "none"}}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" component="span">
                            Upload File
                        </Button>
                    </label>
                    {fileName && (
                        <TextField
                            label="Selected File"
                            value={fileName}
                            fullWidth
                            margin="normal"
                            InputProps={{readOnly: true}}
                        />
                    )}

                    {metadataList.map((metadata, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <TextField
                                label="Metadata"
                                value={metadata.cle}
                                onChange={(e) =>
                                    handleMetadataChange(index, "cle", e.target.value)
                                }
                                style={{marginRight: "10px"}}
                            />
                            <TextField
                                label="Valeur"
                                value={metadata.valeur}
                                onChange={(e) =>
                                    handleMetadataChange(index, "valeur", e.target.value)
                                }
                            />
                            {metadataList.length > 1 && (
                                <IconButton
                                    onClick={() => handleRemoveMetadata(index)}
                                    color="error"
                                    sx={{ml: 1}}
                                >
                                    <RemoveIcon/>
                                </IconButton>
                            )}
                            {index === metadataList.length - 1 && (
                                <IconButton
                                    onClick={handleAddMetadata}
                                    color="primary"
                                    sx={{ml: 1}}
                                >
                                    <AddIcon/>
                                </IconButton>
                            )}
                        </div>
                    ))}
                    <Button onClick={handleSave}>Save</Button>
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert severity="error" sx={{width: "100%"}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={snackbarOpenAdd}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpenAdd(false)}
            >
                <Alert severity="success" sx={{width: "100%"}}>
                    {snackbarMessageAdd}
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddDocumentModal;
