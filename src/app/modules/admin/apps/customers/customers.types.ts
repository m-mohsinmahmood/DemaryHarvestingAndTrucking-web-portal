export interface Customers {
    find: any;
    id: string;
    company_name: string;
    customer_name: string;
    main_contact: string;
    position: string;
    phone_number: string;
    state: string;
    country: string;
    email: string;
    customer_type: string;
    status: boolean;
    address: string;
    billing_address:string;
    fax:string;
    city:string;
    zip_code: string;
    website: string;
    linkedin: string;
}

export interface CustomerContacts {
    customer_id: string;
    company_name: string;
    first_name: string;
    last_name: string;
    position: string;
    website: string;
    address: string;
    cell_number: string;
    city: string;
    office_number: string;
    state: string;
    email: string;
    zip_code: string;
    fax: string;
    linkedin: string;
    note_1: string;
    note_2: string;
    avatar: string;
}

export interface InventoryProduct {
    id: string;
    harvestYear?: string;
    category?: string;
    avatar: string;
    name: string;
    alternateName?: string;
    skipInvoiceMath1?: string;
    arizonaInvoiceMath?: string;
    skipInvoiceMath2?: string;
    stateProvince?: string;
    email?: string;
    isActive?: string;
    description?: string;
    tags?: string[];
    images: string[];
    active: boolean;
    farmId: string;
    farmHarvestYear: string;
    farmName: string;
    farmTotalAcres: string;
    cropid: string;
    cropHarvestYear: string;
    cropCrop: string;
    cropPoundsPerBushel: string;
    contactNo: string;
    customerType: string;
    phoneNo: string;
    position: string;
    billTo: string;
    notesInvoice: string;
    addressInInvoice: string;
    termsInvoice: string;
    dateInvoice: string;
    next15Days: string;
    invoiceNumber: string;
    balanceInvoice: string;
    paymentCredit: string;
    totalInvoice: string;
    lName: string;
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

export interface Documents {
    folders: Item[];
    files: Item[];
    path: any[];
}

export interface Item {
    id?: string;
    folderId?: string;
    name?: string;
    createdBy?: string;
    createdAt?: string;
    modifiedAt?: string;
    size?: string;
    type?: string;
    contents?: string | null;
    description?: string | null;
}

export interface Food {
    value: string;
    viewValue: string;
  }