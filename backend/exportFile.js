const db = require("./mongo");
const json2md = require("json2md");

async function convertNotes(data) {
  const notes = await db.fetchNotes(data);
  const result = await convertByType(data.fileType, notes);
  return result;
}

function convertByType(fileType, notes) {
  if (!fileType || !notes) {
    throw Error("fileType or notes are invalid");
  } else {
    switch (fileType) {
      case "pdf":
        return notes;
      case "md":
        return convertJsonToMarkdown(notes);
      case "csv":
        return notes;
      default:
        break;
    }
  }
}

function convertJsonToMarkdown(data) {
  if (!Array.isArray(data)) {
    throw Error("type of notes are invalid");
  } else {
    const jsonArray = addMarkdownElementsToData(data);
    const markdownStr = json2md(jsonArray);
    return markdownStr;
  }
}

function addMarkdownElementsToData(dataArr) {
  const originArr = dataArr[0].articles[0];
  if (originArr.notes.length == 0) {
    throw Error("Notes are empty");
  }

  const collectNotes = (originArr) => {
    let notes = [];
    originArr.forEach((element) => {
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

module.exports = convertNotes;
