export interface InventoryProduct
{
    id: string;
    harvestYear?:string;
    category?: string;
    name: string;
    alternateName? : string; 
    skipInvoiceMath1? : string;
    arizonaInvoiceMath? : string;
    skipInvoiceMath2?: string;
    stateProvince? : string;
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
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag
{
    id?: string;
    title?: string;
}

export interface InventoryVendor
{
    id: string;
    name: string;
    slug: string;
}
