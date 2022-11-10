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

            status: string;


             // contact info
             name: string;
            fname: string;
            lname: string;
             cellPhone: string;
             homePhone: string;
             email: string;
             image: String;


            // personal info
            dob: string;
            martialStatus: string;
            address1: string;
            address2: string;
            town: string;
            state: string;
            postalCode: string;
            country: string;
            citizenStatus: string;
            tractorStatus: string;
            passport: string;
            imageURL: string;
            avatar: String;


            // interviwe results
            firstPhoneCall: boolean;
            firstInterviewResult: string;
            firstRanking: string;
            refreePhoneCall: boolean;
            refreeInterviewResult: string;
            refreeRanking: string;
            secondPhoneCall: boolean;
            secondInterviewResult: string;
            secondRanking: string;
            thirdPhoneCall: boolean;
            thirdInterviewResult: string;
            thirdRanking: string;

            // work experience
            fifthQuestion: string;
            firstQuestion: string;
            fourthQuestion: string;
            job: string;
            secondQuestion: string;
            supervisor: string;
            supervisorContact: string;
            thirdQuestion: string;
            workExperience: string;

            // other
              firstEmail: boolean;
              firstSentDate: Date;
              secondEmail: boolean;
              secondSentDate: Moment;
              applicationDate: Moment;

              // education
      e_firstQuestion: string;
      e_secondQuestion: string;
      e_thirdQuestion: string;
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
