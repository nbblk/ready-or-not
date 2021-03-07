const puppeteer = require("puppeteer");

async function scrapPage(uri) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(uri, { waitUntil: "networkidle2" });
  const title = await getTitle(page);
  const image = await getImage(page, uri);
  return { title: title, image: image };
}

const getTitle = async (page) => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1 = document.querySelector("h1").innerHTML;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2 = document.querySelector("h2").innerHTML;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};

const getImage = async (page, uri) => {
  const image = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:img"]');
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (
      imgRelLink != null &&
      imgRelLink.href.length > 0 &&
      (await urlImageIsAccessible(imgRelLink.href))
    ) {
      return imgRelLink.href;
    }
    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter((img) => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImage = false;
          }
        }
        if (img.naturalHeight <= 50 || img.naturalHeight <= 50) {
          addImg = false;
        }
        return addImg;
      });
      imgs.forEach((img) =>
        img.src.indexOf(
          "//" === -1 ? (img.src = `${new URL(uri).origin}/${src}}`) : img.src
        )
      );
      return imgs[0].src;
    }
    return null;
  })
  .catch((error) => {
    console.error(error);
    return null;
  });
  
  return image;
};

module.exports = scrapPage;