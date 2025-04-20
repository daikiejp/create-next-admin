"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LanguageSelector from "@/components/languageSelector";
import { ThemeToggle } from "@/components/themeToggle";

const data = {
  navMain: [
    {
      title: "Menu.dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Menu.lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Menu.analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Menu.projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Menu.team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Options.settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Options.help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Options.search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Documents.library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Documents.reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Documents.wordassistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const currentUser = {
    user: {
      name: session?.user?.name ?? "Unknown",
      email: session?.user?.email ?? "unknown@example.com",
      avatar: "https://avatars.githubusercontent.com/u/124599?v=4",
    },
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <div className="flex justify-between p-4 md:p-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <SidebarFooter>
        <NavUser user={currentUser.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
