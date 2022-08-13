export interface Employee
{

           id        : string,
            employeeID       : string,     
            namee    : string,
            harvestYear      : number,
            role       : string[],
            email      : string,
            active     : true,
            fname:string,
            lname:string,
            city:string,
            address:string,
            position:string,
            salary:string,
            currentEmployee:string,
}

export interface EmployeePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
