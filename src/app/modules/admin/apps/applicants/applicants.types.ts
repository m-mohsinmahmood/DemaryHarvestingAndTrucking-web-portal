export interface Applicant
{

            id          : string,
            applicantID  : string,     
            name        : string,
            email       : string,
            active      : true,
            fname       :string,
            lname       :string,
            status      :string,
}

export interface ApplicantPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
