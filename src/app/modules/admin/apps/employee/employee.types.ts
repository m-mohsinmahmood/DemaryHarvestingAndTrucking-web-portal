export interface Employee
{

    id: string;
    employeeID: string;
    avatar: string;
    name: string;
    address: string;
    phone: string;
    emergencyContact: string;
    bankingInfo: string;
    harvestYear: number;
    role: string[];
    email: string;
    active: true;
    fname: string;
    lname: string;
    city: string;
    position: string;
    salary: string;
    currentEmployee: string;
    wages: string;
    internationalPhoneNumbers?: {
        country: string;
        phoneNumber: string;
    }[];
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
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
export interface Documents
{
    folders: Item[];
    files: Item[];
    path: any[];
}

export interface Item
{
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
