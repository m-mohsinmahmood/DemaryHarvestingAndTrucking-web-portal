export interface Machineries {
    id: string;
    name: string;
    photo: string;
    odometer: string;
    serviceRecords: [];
    purchaseCompany: string;
    purchaseDate: Date;
    purchasePrice: number;
    value: number;
    make: string;
    model: string;
    titleName: string;
    titleNumber: number;
    year: number;
    vinNumber: string;
    saleTradeDate: Date;
    saleTradePrice: number;
    documents: [];
    groupDocuments: [];
}

export interface InventoryProduct {
    id: string;
    name: string;
    photo: string;
    odometer: string;
    serviceRecords: [];
    purchaseCompany: string;
    purchaseDate: Date;
    purchasePrice: number;
    value: number;
    make: string;
    model: string;
    titleName: string;
    titleNumber: number;
    year: number;
    vinNumber: string;
    saleTradeDate: Date;
    saleTradePrice: number;
    documents: [];
    groupDocuments: [];
}

export interface InventoryPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory {
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand {
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag {
    id?: string;
    title?: string;
}

export interface InventoryVendor {
    id: string;
    name: string;
    slug: string;
}
