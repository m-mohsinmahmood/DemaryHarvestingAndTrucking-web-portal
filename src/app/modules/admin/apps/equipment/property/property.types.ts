export interface PropertyProduct
{
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface PropertyPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface PropertyCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface PropertyBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface PropertyTag
{
    id?: string;
    title?: string;
}

export interface PropertyVendor
{
    id: string;
    name: string;
    slug: string;
}
