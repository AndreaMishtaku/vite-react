import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../../components/table";
import { useToast } from "@/hooks/use-toast";

const DocumentDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [documentTypeFields, setDocumentTypeFields] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocumentByTypeId = async (id) => {
    try {
      const response = await axios.get(`/document-types/${id}`);
      setDocumentTypeFields(response.data.content.fields);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async ({ dTId, pageNumber, pageSize } = {}) => {
    const params = new URLSearchParams();

    if (dTId) params.append("dTId", dTId);
    if (pageSize) params.append("size", pageSize);
    if (pageNumber) params.append("page", pageNumber);

    try {
      const response = await axios.get(`/docs?${params.toString()}`);
      setDocuments(response.data.content.data);
      setTotalRecords(response.data.content.totalElements);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`docs/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let filename = "downloaded_file";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match.length > 1) {
          filename = match[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast({
        title: "Download failed",
        description: error.response ? error.response.data : error.message,
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDocuments({ dTId: id, pageNumber: pageNumber, pageSize: pageSize });
    setIsLoading(false);
  }, [pageNumber, pageSize]);

  useEffect(() => {
    setPageNumber(1);
  }, [pageSize]);

  useEffect(() => {
    fetchDocumentByTypeId(id);
  }, []);

  const columns = documentTypeFields
    .map((d) => {
      return {
        name: d.name,
        type: d.type,
      };
    })
    .concat([
      { name: "fileName", type: "text" },
      { name: "updatedAt", type: "text" },
      { name: "id", type: "int" },
    ]);

  const rows = documents.map((d) => {
    const metadata = d.metadata ? JSON.parse(d.metadata) : {};
    return {
      fileName: d.fileName,
      updatedAt: d.updatedAt,
      id: d.id,
      ...metadata,
    };
  });

  return isLoading ? (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="animate-spin" />
    </div>
  ) : (
    <div>
      <DataTable
        columns={columns}
        rows={rows}
        filterBy={columns.length > 0 ? "cf_discente" : ""}
        totalRecords={totalRecords ?? 0}
        pageSize={pageSize}
        pageNumber={pageNumber}
        onPageNumberChange={(number) => {
          setPageNumber(number);
        }}
        onPageSizeChange={(number) => {
          setPageSize(number);
        }}
        actions={[
          {
            name: "download",
            icon: <Download className="cursor-pointer" />,
            onClick: (value) => {
              handleDownload(value.id);
            },
          },
        ]}
      />
    </div>
  );
};

export default DocumentDetail;
