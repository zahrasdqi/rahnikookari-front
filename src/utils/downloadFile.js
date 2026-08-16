// src/utils/downloadFile.js
export const downloadFile = (blobResponse, filename = "download") => {
  const contentDisposition =
    blobResponse.headers?.["content-disposition"] || "";
  const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const resolvedName = match ? match[1].replace(/['"]/g, "") : filename;

  const url = window.URL.createObjectURL(new Blob([blobResponse.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", resolvedName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
