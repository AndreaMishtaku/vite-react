import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearSession } from "../../initializers/axios";

const Home = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/document-types");
      setDocuments(
        response.data.content.filter((document) => document.id != 1)
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  console.log(documents);
  return (
    <SidebarProvider className="overflow-hidden relative">
      <AppSidebar
        header={"Mistral DManager"}
        items={[
          {
            title: "Document Classes",
            url: "/documents",
            items: documents.map((document) => {
              return {
                title: document.name,
                url: `/documents/${document.id}`,
              };
            }),
          },
        ]}
      />
      <SidebarInset className="relative w-4">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Documents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {documents.length > 0 && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {documents.find((d) => d.id == id)
                        ? documents.find((d) => d.id == id).name
                        : ""}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-4">
            <Button
              onClick={() => {
                clearSession();
              }}
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-4">
          {id ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center h-[80%] text-center">
              <h1 className="text-4xl font-bold text-neutral-600">
                Welcome page
              </h1>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
