const db = require("./mongo");
const fs = require("fs");
const path = require("path");
const pdfDoc = require("pdfkit");
const json2md = require("json2md");
const DIRECTORY_PATH = "/exports";

async function exportNoteToFile(data) {
  const notes = await db.fetchNotes(data);
  await convertToFile(data.fileType, notes);
}

async function convertToFile(fileType, notes) {
  if (!fileType || !notes) {
    throw Error("fileType or notes are invalid");
  } else {
    switch (fileType) {
      case "pdf":
        break;
      case "markdown":
        return convertJsonToMarkdown(notes);
      case "csv":
        return;
      default:
        break;
    }
  }
}

function convertJsonToMarkdown(data) {
  if (!data instanceof Array) {
    throw Error("type of notes are invalid");
  } else {
    const jsonArray = addMarkdownElementsToData(data);
    const markdownStr = json2md(jsonArray);
    writeFile("md", markdownStr);
  }
}

function addMarkdownElementsToData(dataArr) {
  const originArr = dataArr[0].articles[0];
  if (originArr.notes.length == 0) {
    throw Error("Notes are empty");
  }

  const collectNotes = (originArr) => {
    let notes = [];
    originArr.forEach((element, index) => {
      for (let key in element) {
        if (key === "content") {
          notes.push(element[key]);
        }
      }
    });
    return notes;
  };

  let targetArr = [];
  for (let key in originArr) {
    switch (key) {
      case "title":
        targetArr.push({ h1: key }, { h5: originArr[key] });
        break;
      case "url":
        targetArr.push({ h3: key }, { h5: originArr[key] });
        break;
      case "tags":
        targetArr.push({ h3: key }, { ul: originArr[key] });
        break;
      case "notes":
        targetArr.push({ h3: key }, { ul: collectNotes(originArr[key]) });
        break;
      default:
        break;
    }
  }

  return targetArr;
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function writeFile(extension, byteArr) {
  const filepath = `${DIRECTORY_PATH}/${new Date().getTime()}.${extension}`; // timestamp
  ensureDirectoryExistence(filepath);
  fs.writeFile(filepath, byteArr, function (err) {
    console.error(err);
  });
}

module.exports = exportNoteToFile;
