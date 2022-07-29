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
    id: "apps.ecommerce",
    title: "Employees",
    type: "collapsable",
    icon: "heroicons_outline:user",
    children: [
      {
        id: "apps.ecommerce.inventory",
        title: "Employee List",
        type: "basic",
        icon: "heroicons_outline:user-group",
        link: "/apps/ecommerce/inventory",
      },
      {
        id: "apps.file-manager",
        title: "Employee Docs",
        type: "basic",
        icon: "heroicons_outline:document",
        link: "/apps/file-manager",
      }
    ],
  },
  
];
