/* eslint-disable */
import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "dashboards",
    title: "Dashboards",
    type: "group",
    icon: "heroicons_outline:home",
    children: [
      {
        id: "dashboards.project",
        title: "My Dashboard",
        type: "basic",
        icon: "heroicons_outline:clipboard-check",
        link: "/dashboards/project",
      },
    ],
  },

  // {
  //   id: "entities",
  //   title: "Entities",
  //   type: "group",
  //   icon: "heroicons_outline:home",
  //   children: [
  //     {
  //       id: "apps.ecommerce",
  //       title: "Employees",
  //       type: "collapsable",
  //       icon: "heroicons_outline:user",
  //       children: [
  //         {
  //           id: "apps.employee",
  //           title: "Employee List",
  //           type: "basic",
  //           icon: "heroicons_outline:user-group",
  //           link: "/apps/employee",
  //         },
  //         {
  //           id: "apps.file-manager",
  //           title: "Employee Docs",
  //           type: "basic",
  //           icon: "heroicons_outline:document",
  //           link: "/apps/file-manager",
  //         },
  //         {
  //   id: "applicants",
  //   title: "Applicants",
  //   type: "basic",
  //   icon: "heroicons_outline:user-circle",
  //   link: "/apps/applicants",
  // },
  //       ],


  //     },
  //   ],
  // },
  {
    id: "customers",
    title: "Customers",
    type: "basic",
    icon: "heroicons_outline:user",
    link: "/apps/customers",
  },
  {
    id: "applicants",
    title: "Applicants",
    type: "basic",
    icon: "heroicons_outline:user-circle",
    link: "/apps/applicants",
  },
  {
    id: "",
    title: "Employees",
    type: "collapsable",
    icon: "heroicons_outline:user-circle",
    children: [
        {
            id: "employee",
            title: "Employees",
            type: "basic",
            icon: "heroicons_outline:user-circle",
            link: "/apps/employee/employees",
          },
        {
          id: "all-dwrs",
          title: "All DWRs",
          type: "basic",
          icon: "heroicons_outline:cog",
          link: "/apps/employee/all-dwrs",
        },
    ]
  },
  {
    id: "crops",
    title: "Crops",
    type: "basic",
    icon: "heroicons_outline:cog",
    link: "/apps/crops",
  },
  {
    id: "",
    title: "Equipment",
    type: "collapsable",
    icon: "heroicons_outline:user",
    children: [
      {
        id: "",
        title: "Machinery",
        type: "basic",
        icon: "heroicons_outline:cog",
        link: "/apps/equipment/machinery",
      },
      {
        id: "",
        title: "Motorized",
        type: "basic",
        icon: "heroicons_outline:truck",
        link: "/apps/equipment/motorized",
      },
      {
        id: "",
        title: "Non Motorized",
        type: "basic",
        icon: "heroicons_outline:presentation-chart-line",
        link: "/apps/equipment/non-motorized",
      },
    ],
  },
  {
    id: "h2a-rates",
    title: "H2A Rates",
    type: "basic",
    icon: "heroicons_outline:cog",
    link: "/apps/h2a-rates",
  },
  {
    id: "policy-documents",
    title: "Company Documents",
    type: "basic",
    icon: "heroicons_outline:document",
    link: "/apps/policy-documents",
  },

]
