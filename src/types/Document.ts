import {Metadata} from "./Metadata";

export interface Document {
    id: string,
    nom : string,
    type: string,
    dateCreation : string,
    metadataResponse: Metadata[]
}

