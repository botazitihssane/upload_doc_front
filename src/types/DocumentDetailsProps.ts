import {Document} from './Document';

export interface DocumentsDetailsProps {
    document: Document | null;
    open: boolean;
    handleClose: () => void;
}