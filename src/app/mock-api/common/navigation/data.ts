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
        title: "Project",
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
    id: "crops",
    title: "Crops",
    type: "basic",
    icon: "heroicons_outline:cog",
    link: "/apps/crops",
  },
  // {
  //   id: "",
  //   title: "Equipment",
  //   type: "collapsable",
  //   icon: "heroicons_outline:user",
  //   children: [
  //     {
  //       id: "",
  //       title: "Vehicle List",
  //       type: "basic",
  //       icon: "heroicons_outline:user-group",
  //       link: "/apps/vehicle",
  //     },
  //   ],
  // }

]


