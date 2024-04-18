import React, {useState, useEffect} from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {Document} from "../types/Document";
import InfoIcon from "@mui/icons-material/Info";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DocumentsDetails from "./DocumentsDetails";
import AdvancedSearch from "./AdvancedSearch";
import ShareIcon from '@mui/icons-material/Share';
import ShareDoc from "./ShareDoc";

function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null
    );
    const [modalOpen, setModalOpen] = useState(false);


    const [searchID, setSearchID] = useState("");
    const [searchNom, setSearchNom] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchType, setSearchType] = useState("");

    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [metadataList, setMetadataList] = useState([{cle: "", valeur: ""}]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingDocumentId, setDeletingDocumentId] = useState<string>("");


    const [shareModalOpen, setShareModalOpen] = useState(false);

    const loadDocuments = (
        id: string = "",
        nom: string = "",
        date: string = "",
        type: string = ""
    ) => {
        const queryParams = new URLSearchParams({
            nom,
            dateCreation: date,
            type,
        });

        fetch(`http://localhost:8081/api/document/search?${queryParams.toString()}`)
            .then((response) => response.json())
            .then((data) => setDocuments(data))
            .catch((error) => console.error("Error fetching documents:", error));
    };

    useEffect(() => {
        if (searchID) {
            loadDocumentById(searchID);
        } else {
            loadDocuments(searchID, searchNom, searchDate, searchType);
        }
    }, [searchID, searchNom, searchDate, searchType]);

    const handleInfoClick = (document: Document) => {
        setSelectedDocument(document);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedDocument(null);
    };

    const loadDocumentById = (id: string) => {
        fetch(`http://localhost:8081/api/document/${id}`)
            .then((response) => response.json())
            .then((data) => setDocuments([data]))
            .catch((error) => console.error("Error fetching document by ID:", error));
    };

    const handleSearch = () => {
        if (searchID) {
            loadDocumentById(searchID);
        } else {
            loadDocuments(searchID, searchNom, searchDate, searchType);
        }
    };

    const handleSearchModalOpen = () => {
        setSearchModalOpen(true);
    };

    const handleSearchModalClose = () => {
        setSearchModalOpen(false);
    };

    const handleSearchResults = (documents: Document[]) => {
        setDocuments(documents);
    };

    const handleDelete = (id: string) => {
        setDeletingDocumentId(id);
        setDeleteDialogOpen(true);
    };

    const handleShare = (document: Document) => {
        setSelectedDocument(document);
        setShareModalOpen(true);
    }

    const handleShareClose = () => {
        setShareModalOpen(false);
    }

    const confirmDelete = () => {
        fetch(`http://localhost:8081/api/document/${deletingDocumentId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                setSnackbarMessage("Document deleted successfully");
                setSnackbarOpen(true);
                // Update documents list after deletion
                loadDocuments(searchID, searchNom, searchDate, searchType);
            })
            .catch((error) => console.error("Error deleting document:", error))
            .finally(() => {
                setDeleteDialogOpen(false);
            });
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeletingDocumentId("");
    };

    const handleDownload = (id: string) => {
        fetch(`http://localhost:8081/api/document/download/${id}`, {
            method: "GET",
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "document.pdf");

                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            })
            .catch((error) => console.error("Error downloading document:", error));
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <div style={{marginBottom: "20px"}}>
                <TextField
                    label="ID"
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                    style={{marginRight: "10px"}}
                />
                <TextField
                    label="Nom"
                    value={searchNom}
                    onChange={(e) => setSearchNom(e.target.value)}
                    style={{marginRight: "10px"}}
                />
                <TextField
                    label="Date de création"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    InputLabelProps={{shrink: true}}
                    style={{marginRight: "10px"}}
                />
                <TextField
                    label="Type"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{marginRight: "10px"}}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Rechercher
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSearchModalOpen}
                >
                    Recherche avancée
                </Button>
            </div>
            <TableContainer component={Paper} sx={{maxWidth: 1000}}>
                <Table sx={{maxWidth: 1000}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID du document</TableCell>
                            <TableCell align="right">Nom du document</TableCell>
                            <TableCell align="right">Type du document</TableCell>
                            <TableCell align="right">Date de création</TableCell>
                            <TableCell align="right">Détails</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{"&:last-child td, &:last-child th": {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.nom}</TableCell>
                                <TableCell align="center">{row.type}</TableCell>
                                <TableCell align="center">{row.dateCreation}</TableCell>
                                <TableCell align="center">
                                    <InfoIcon color="info" onClick={() => handleInfoClick(row)}/>
                                </TableCell>
                                <TableCell align="center">
                                    <ArrowCircleDownIcon
                                        color="success"
                                        onClick={() => handleDownload(row.id)}
                                    />{" "}
                                    <DeleteForeverIcon
                                        color="error"
                                        onClick={() => handleDelete(row.id)}
                                    />{" "}
                                    <ShareIcon
                                        color={"warning"}
                                        onClick={() => handleShare(row)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AdvancedSearch
                open={searchModalOpen}
                handleClose={handleSearchModalClose}
                handleSearchResults={handleSearchResults}
            />

            <DocumentsDetails
                document={selectedDocument}
                open={modalOpen}
                handleClose={handleModalClose}
            />

            <ShareDoc
                open={shareModalOpen}
                handleClose={handleShareClose}
                document={selectedDocument}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this document?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert severity="success" sx={{width: "100%"}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Documents;
