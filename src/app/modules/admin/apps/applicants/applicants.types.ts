/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { Moment } from 'moment';

export interface Applicant
{

            id: string;
            applicantID: string;
            email1: string;
            email2: string;
            active: true;
            status: boolean;


             // contact info
             name: string;
             first_name: string;
             last_name: string;
             cell_phone_number: string;
             home_phone_number: string;
             email: string;
             image: String;
             calendar_year:string;
             languages:string;


            // personal info
            date_of_birth: string;
            marital_status: string;
            address_1: string;
            address_2: string;
            town: string;
            state: string;
            postal_code: string;
            county:string;
            self_rating:string;
            country: string;
            us_citizen: boolean;
            tractor_license: boolean;
            passport: boolean;
            imageURL: string;
            avatar: String;
            blood_group:string;
            reason_for_applying:string;


            // interviwe results
            first_phone_call: boolean;
            first_call_remarks: string;
            firstRanking: string;
            reference_phone_call: boolean;
            reference_call_remarks: string;
            refreeRanking: string;
            second_phone_call: boolean;
            second_call_remarks: string;
            secondRanking: string;
            third_phone_call: boolean;
            third_call_remarks: string;
            thirdRanking: string;

            // work experience
            question_5: string;
            question_1: string;
            question_4: string;
            recent_job: string;
            question_2: string;
            supervisor: string;
            supervisor_contact: string;
            question_3: string;
            work_experience_description: string;

            // other
              firstEmail: boolean;
              firstSentDate: Date;
              secondEmail: boolean;
              secondSentDate: Moment;
              applicationDate: Moment;

              // education
              degree_name: string;
              institute_name: string;
              education: string;
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
