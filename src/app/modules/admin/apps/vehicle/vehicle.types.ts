export interface VehicleProduct {
//   id: string;
//   category?: string;
//   name: string;
//   description?: string;
//   tags?: string[];
//   sku?: string | null;
//   barcode?: string | null;
//   brand?: string | null;
//   vendor: string | null;
//   stock: number;
//   reserved: number;
//   cost: number;
//   basePrice: number;
//   taxPercent: number;
//   price: number;
//   weight: number;
//    thumbnail: string;
//   images: string[];
//   active: boolean;

  // employee_id :string,
  // firstName : string,
  // lastName : string,
  // email: string,
  // address:string,
  // city:string,
  // harvestYear:number,
  // role:string,
  // position:string,
  // salary:number,
  // currentEmployee:string,

  id: string;
  vehicleName: string;
  assigneName: string;
  companyName: string;
  status: boolean;
  assignDate: string;
  harvestYear: number;
  fuelStart: number;
  fuelEnd: number;
  thumbnail: string;
  images: string[];
  condition: object[];
  type: object[];

}

export interface VehiclePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface VehicleCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface VehicleBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface VehicleTag
{
    id?: string;
    title?: string;
}

export interface VehicleVendor
{
    id: string;
    name: string;
    slug: string;
}
