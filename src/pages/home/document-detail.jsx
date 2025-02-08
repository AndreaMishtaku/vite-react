import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../../components/table";

const DocumentDetail = () => {
  const { id } = useParams();
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
      console.log("Error2", error);
      setIsLoading(false);
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
    ]);

  const rows = documents.map((d) => {
    const metadata = d.metadata ? JSON.parse(d.metadata) : {};
    return {
      fileName: d.fileName,
      updatedAt: d.updatedAt,
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
            icon: <Download />,
            onClick: (value) => {
              console.log(value);
            },
          },
        ]}
      />
    </div>
  );
};

export default DocumentDetail;
