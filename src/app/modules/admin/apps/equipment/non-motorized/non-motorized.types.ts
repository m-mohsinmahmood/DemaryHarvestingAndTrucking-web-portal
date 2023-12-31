export interface NonMotorized
{
    id?:string;
    type:string;
    status:boolean;
    name:string;
    license_plate:string;
    vin_number:string;

    odometer:string;
    odometer_reading: string;

    company_id:string;
    color:string;
    year:string;
    make:string;
    model:string;
    title:string;
    license:string;
    registration:string;
    insurance_status:string;
    liability:string;
    collision:string;
    comprehensive:string;
    purchase_price:string;
    date_of_purchase:string;
    sales_price:string;
    date_of_sales:string;
    estimated_market_value:string;
    source_of_market_value:string;
    date_of_market_value:string;
    pictures: string;

}