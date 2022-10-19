/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.project',
                title: 'Project',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/dashboards/project',
            },
        ],
    },
    {
        id: 'entities',
        title: 'Entities',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'customers',
                title: 'Customers',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/apps/customers',
            },
            {
                id: 'crops',
                title: 'Crops',
                type: 'basic',
                icon: 'heroicons_outline:cog',
                link: '/apps/crops',
            },
        ],
    },
];
