import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (filteredData,pageName,excludedKeys) => {
  const workbook = new ExcelJS.Workbook();
  const rowsPerSheet = 1000000;

  for (let sheetIndex = 0; sheetIndex < Math.ceil(filteredData.length / rowsPerSheet); sheetIndex++) {
    const startRow = sheetIndex * rowsPerSheet;
    const endRow = Math.min((sheetIndex + 1) * rowsPerSheet, filteredData.length);

    const worksheet = workbook.addWorksheet(`Report - Sheet ${sheetIndex + 1}`);

   //     // Style for the first row (Page Name)
    worksheet.mergeCells("A1:J1");
    const mergedCellRange = ["A1", "J1"];

    // Define border styles
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Apply border styles to each cell in the merged cell range
    for (let i = 0; i < mergedCellRange.length; i += 2) {
      const startCell = mergedCellRange[i];
      const endCell = mergedCellRange[i + 1];

      for (
        let row = startCell.substring(1);
        row <= endCell.substring(1);
        row++
      ) {
        for (
          let col = startCell.substring(0, 1);
          col <= endCell.substring(0, 1);
          col = String.fromCharCode(col.charCodeAt(0) + 1)
        ) {
          const cell = worksheet.getCell(col + row);
          cell.border = borderStyle;
        }
      }
    }
    worksheet.getCell("A1").value = pageName;
    worksheet.getCell("A1").font = { size: 18, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "left" };

   
  

    const headerStyle = { alignment: { horizontal: "left" }, font: { bold: true } };
    const dataCellStyle = { alignment: { horizontal: "left" } };
    const headers = Object.keys(filteredData[0])
      .filter((key) => !excludedKeys.includes(key))
      .map((key) => ({
        header: getHeaderName(key),
        key: key,
        width: getColumnWidth(key),
      }));

    const headerRow = worksheet.addRow(headers.map((header) => header.header));
    headerRow.eachCell((cell, colNumber) => cell.style = headerStyle);

    for (let i = startRow; i < endRow; i++) {
      const rowData = headers.map((header) => filteredData[i][header.key]);
      const dataRow = worksheet.addRow(rowData);
      dataRow.eachCell((cell, colNumber) => cell.style = dataCellStyle);
    }

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 3) {
          const content = cell.value ? cell.value.toString() : "";
          const contentLength = content.length;
          maxLength = Math.max(maxLength, contentLength);
        }
      });
      column.width = Math.max(maxLength, 15);
    });
  }

  const timestamp = new Date().toISOString().replace(/:/g, "-").split("T")[0] +
    "_" + new Date().toLocaleTimeString().split(" ").join("_");
  const filename = `${pageName}_${timestamp}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  const excelBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  saveAs(excelBlob, filename);

};

// Helper function to get header names
const getHeaderName = (key) => {
  switch (key) {
    case "iId":
      return "Id";
    case "sName":
      return "Name";
    case "sCode":
      return "Code";
    case "sAltName":
      return "AltName";
    default:
      return key;
  }
};

// Helper function to calculate column width
const getColumnWidth = (key) => {
  // Adjust the width as needed for each column
  switch (key) {
    case "iId":
    case "sName":
    case "sCode":
    case "sAltName":
      return 20;
    default:
      return 15;
  }
};
