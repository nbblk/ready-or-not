import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const convertToPDF = (content) => {
  const article = JSON.parse(content);
  let document = { content: [] };

  for (let prop in article) {
    if (prop === "notes") {
      document.content.push({
        text: prop,
        style: "header",
        lineHeight: 1,
      });

      let notes = [];
      for (let i = 0; i < article.notes.length; i++) {
        notes.push(article.notes[i].content);
      }
      document.content.push({ ul: notes });
    } else {
      document.content.push({
        text: prop + " : " + article[prop],
        style: "header",
      });
    }
  }
  return document;
};

const convertToCSV = (content) => {
  const article = JSON.parse(content);
  const headers = {
    title: article.title,
    url: article.url,
    tags: article.tags ? article.tags : "",
    notes: ""
  };

  let headerStr = "";
  for (let header in headers) {
    headerStr += header;
    if (headerStr !== "") headerStr += ",";

    headerStr += headers[header] + "\r\n";
  }

  let bodyStr = "";
  for (let i = 0; i < article.notes.length; i++) {
    let line = "";

    for (let index in article.notes[i]) {
      if (line !== "") line += ",";
      if (index === "content") {
        line += article.notes[i][index];
      } else {
        line += (i+1)
      }
    }
    bodyStr += line + "\r\n";
  }
  return headerStr.concat(bodyStr);
};

const createDownloadLink = (result, filename) => {
  if (filename.split(".")[1] === "pdf") {
    pdfMake.createPdf(result).download();
  } else {
    const url = window.URL.createObjectURL(
      new Blob([result])
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};

export const download = (content, filename) => {
  const extension = filename.split(".")[1];
  let result = null;
  switch (extension) {
    case "pdf":
      result = convertToPDF(content);
      break;
    case "md":
      result = content;
      break;
    case "csv":
      result = convertToCSV(content);
      break;
    default:
      new Error("file extension is invalid");
      break;
  }
  createDownloadLink(result, filename);
};
