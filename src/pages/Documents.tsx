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
    DialogTitle, AppBar, Container, Toolbar, Menu, MenuItem, Tooltip, Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import {Document} from "../types/Document";
import InfoIcon from "@mui/icons-material/Info";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DocumentsDetails from "./DocumentsDetails";
import AdvancedSearch from "./AdvancedSearch";
import ShareIcon from '@mui/icons-material/Share';
import ShareDoc from "./ShareDoc";

import AddDocumentModal from "./AddDocumentModal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

const pages = ["Documents", "User", "Acces"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Documents() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

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
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const loadDocumentById = (id: string) => {
        fetch(`http://localhost:8081/api/document/${id}`)
            .then((response) => response.json())
            .then((data) => setDocuments([data]))
            .catch((error) => console.error("Error fetching document by ID:", error));
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
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
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const reloadDocuments = () => {
        loadDocuments(searchID, searchNom, searchDate, searchType);
    };
    return (
        <div>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{display: {xs: "none", md: "flex"}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: {xs: "none", md: "flex"},
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Gestion des documents
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: "block", md: "none"},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{display: {xs: "flex", md: "none"}, mr: 1}}/>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: {xs: "flex", md: "none"},
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            LOGO
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{my: 2, color: "white", display: "block"}}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: "45px"}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <div
                style={{
                    width: "100%", // Adjust the width of the container
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        marginBottom: "20px",
                        marginTop: "50px",
                        width: "100%", // Make search fields take full width
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                    }}
                >
                    <TextField
                        label="ID"
                        value={searchID}
                        onChange={(e) => setSearchID(e.target.value)}
                        // Adjust width of each TextField
                    />
                    <TextField
                        label="Nom"
                        value={searchNom}
                        onChange={(e) => setSearchNom(e.target.value)}
                        // Adjust width of each TextField
                    />
                    <TextField
                        label="Date de création"
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        InputLabelProps={{shrink: true}}
                        // Adjust width of each TextField
                    />
                    <TextField
                        label="Type"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        // Adjust width of each TextField
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        // Adjust width of each Button
                    >
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
            </div>
            <div
                style={{
                    alignItems: "left",
                    marginLeft: "300px",
                    marginBottom: "70px",
                }}
            >
                <Button variant="contained" onClick={handleOpenModal}>
                    Add Document
                </Button>
                <AddDocumentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    reloadDocuments={reloadDocuments}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
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
                                        <InfoIcon
                                            color="info"
                                            onClick={() => handleInfoClick(row)}
                                        />
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
        </div>
    );
}

export default Documents;
