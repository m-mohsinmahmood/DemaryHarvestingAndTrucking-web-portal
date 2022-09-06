/* eslint-disable */
import * as moment from 'moment';
export const categories = [
    {
        id      : 'b899ec30-b85a-40ab-bb1f-18a596d5c6de',
        parentId: null,
        name    : 'Mens',
        slug    : 'mens'
    },
    {
        id      : '07986d93-d4eb-4de1-9448-2538407f7254',
        parentId: null,
        name    : 'Ladies',
        slug    : 'ladies'
    },
    {
        id      : 'ad12aa94-3863-47f8-acab-a638ef02a3e9',
        parentId: null,
        name    : 'Unisex',
        slug    : 'unisex'
    }
];
export const brands = [
    {
        id  : 'e1789f32-9475-43e7-9256-451d2e3a2282',
        name: 'Benton',
        slug: 'benton'
    },
    {
        id  : '61d52c2a-8947-4a2c-8c35-f36baef45b96',
        name: 'Capmia',
        slug: 'capmia'
    },
    {
        id  : 'f9987124-7ada-4b93-bef7-35280b3ddbd7',
        name: 'Lara',
        slug: 'lara'
    },
    {
        id  : '5913ee46-a497-41db-a118-ee506011529f',
        name: 'Premera',
        slug: 'premera'
    },
    {
        id  : '2c4d98d8-f334-4125-9596-862515f5526b',
        name: 'Zeon',
        slug: 'zeon'
    }
];
export const tags = [
    {
        id   : '167190fa-51b4-45fc-a742-8ce1b33d24ea',
        title: 'mens'
    },
    {
        id   : '3baea410-a7d6-4916-b79a-bdce50c37f95',
        title: 'ladies'
    },
    {
        id   : '8ec8f60d-552f-4216-9f11-462b95b1d306',
        title: 'unisex'
    },
    {
        id   : '8837b93f-388b-43cc-851d-4ca8f23f3a61',
        title: '44mm'
    },
    {
        id   : '8f868ddb-d4a2-461d-bc3b-d7c8668687c3',
        title: '40mm'
    },
    {
        id   : '2300ac48-f268-466a-b765-8b878b6e14a7',
        title: '5 ATM'
    },
    {
        id   : '0b11b742-3125-4d75-9a6f-84af7fde1969',
        title: '10 ATM'
    },
    {
        id   : '0fc39efd-f640-41f8-95a5-3f1d749df200',
        title: 'automatic'
    },
    {
        id   : '7d6dd47e-7472-4f8b-93d4-46c114c44533',
        title: 'chronograph'
    },
    {
        id   : 'b1286f3a-e2d0-4237-882b-f0efc0819ec3',
        title: 'watch'
    }
];
export const vendors = [
    {
        id  : '987dd10a-43b1-49f9-bfd9-05bb2dbc7029',
        name: 'Evel',
        slug: 'evel'
    },
    {
        id  : '998b0c07-abfd-4ba3-8de1-7563ef3c4d57',
        name: 'Mivon',
        slug: 'mivon'
    },
    {
        id  : '05ebb527-d733-46a9-acfb-a4e4ec960024',
        name: 'Neogen',
        slug: 'neogen'
    }
];
export const products = [
    {
        id              : '7eb7c859-1347-4317-96b6-9476a7e2ba3c',
        name            : 'Swing Away Augers',
        photo           : 'https://www.brandt.ca/getmedia/23ad0762-18db-49fd-80bb-700909a454b1/Augers.aspx',
        odometer        : '1000002',
        serviceRecords  : [],
        purchaseCompany : 'Chevrolet',
        purchaseDate    :  moment().subtract(2, 'year').hour(18).minute(56).toISOString(),
        purchasePrice   : 20000,
        value           : 15000,
        make            : '2022',
        model           : 'CC20903',
        titleName       : '',
        titleNumber     : '',
        year            : '',
        vinNumber       : '1GB0WLE75NF339285',
        saleTradeDate   : moment().subtract(5, 'month').hour(18).minute(56).toISOString(),
        saleTradePrice  : 17000,
        documents       : [],
        groupDocuments  : []    
    },
    {
        id              : '987dd10a-43b1-49f9-bfd9-05bb2dbc7029',
        name            : 'Land Rollers',
        photo           : 'https://www.brandt.ca/getmedia/88820466-e88b-4848-822a-4620923c5c18/Land-Roller.aspx',
        odometer        : '572222',
        serviceRecords  : [],
        purchaseCompany : 'Chevrolet',
        purchaseDate    :  moment().subtract(1, 'year').hour(18).minute(56).toISOString(),
        purchasePrice   : 20000,
        value           : 17000,
        make            : '2022',
        model           : 'CC2L403',
        titleName       : '',
        titleNumber     : '',
        year            : '',
        vinNumber       : '1GB0WLE75NF339285',
        saleTradeDate   : moment().subtract(3, 'month').hour(18).minute(56).toISOString(),
        saleTradePrice  : 17000,
        documents       : [],
        groupDocuments  : []    
    },
    {
        id              : '998b0c07-abfd-4ba3-8de1-7563ef3c4d57',
        name            : 'Heavy Harrows',
        photo           : 'https://www.brandt.ca/getmedia/1b7251ab-031c-4034-8626-7d549a7e60f0/Torsion-Harrow-285x180.png.aspx',
        odometer        : '273888',
        serviceRecords  : [],
        purchaseCompany : 'Chevrolet',
        purchaseDate    :  moment().subtract(3, 'year').hour(18).minute(56).toISOString(),
        purchasePrice   : 20000,
        value           : 18000,
        make            : '2022',
        model           : 'CDL33DS',
        titleName       : '',
        titleNumber     : '',
        year            : '',
        vinNumber       : '1GB0WLE75NF339285',
        saleTradeDate   : moment().subtract(2, 'month').hour(18).minute(56).toISOString(),
        saleTradePrice  : 17000,
        documents       : [],
        groupDocuments  : []    
    },
    {
        id              : '05ebb527-d733-46a9-acfb-a4e4ec960024',
        name            : 'Mover',
        photo           : 'https://www.brandt.ca/getmedia/18d94128-b810-436c-8a36-594479eb4f7e/Movers.aspx',
        odometer        : '999002',
        serviceRecords  : [],
        purchaseCompany : 'Chevrolet',
        purchaseDate    :  moment().subtract(4, 'year').hour(18).minute(56).toISOString(),
        purchasePrice   : 20000,
        value           : 12000,
        make            : '2022',
        model           : 'CD2S903',
        titleName       : '',
        titleNumber     : '',
        year            : '',
        vinNumber       : '1GB0WLE75NF339285',
        saleTradeDate   : moment().subtract(4, 'month').hour(18).minute(56).toISOString(),
        saleTradePrice  : 17000,
        documents       : [],
        groupDocuments  : []    
    },
    
];
