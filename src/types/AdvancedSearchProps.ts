import {Document} from './Document';

export interface AdvancedSearchProps {
    open: boolean;
    handleClose: () => void;
    handleSearchResults: (documents: Document[]) => void;
}
