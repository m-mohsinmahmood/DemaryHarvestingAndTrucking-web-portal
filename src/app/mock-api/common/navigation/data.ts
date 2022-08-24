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
  
  {
    id: "entities",
    title: "Entities",
    type: "group",
    icon: "heroicons_outline:home",
    children: [
      {
        id: "apps.ecommerce",
        title: "Employees",
        type: "collapsable",
        icon: "heroicons_outline:user",
        children: [
          {
            id: "apps.employee",
            title: "Employee List",
            type: "basic",
            icon: "heroicons_outline:user-group",
            link: "/apps/employee",
          },
          {
            id: "apps.file-manager",
            title: "Employee Docs",
            type: "basic",
            icon: "heroicons_outline:document",
            link: "/apps/file-manager",
          },
  //         {
  //   id: "applicants",
  //   title: "Applicants",
  //   type: "basic",
  //   icon: "heroicons_outline:user-circle",
  //   link: "/apps/applicants",  
  // },
        ],
      
       
      },
    ],
  },
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
    id: "equipment",
    title: "Equipment",
    type: "collapsable",
    icon: "heroicons_outline:user",
    children: [
      {
        id: "equipment.vehicles",
        title: "Vehicles",
        type: "basic",
        icon: "heroicons_outline:truck",
        link: "/apps/equipment/vehicle",
      },
      {
        id: "equipment.machinery",
        title: "Machinery",
        type: "basic",
        icon: "heroicons_outline:cog",
        link: "/apps/equipment/machinery",
      },
      {
        id: "equipment.property",
        title: "Property",
        type: "basic",
        icon: "heroicons_outline:circle-stack",
        link: "/apps/equipment/property",
      },
      {
        id: "equipment.part",
        title: "Parts/Tools",
        type: "basic",
        icon: "heroicons_outline:wrench-screwdriver",
        link: "/apps/equipment/parts-tools",
      },
    ],
  }
  
]
    

