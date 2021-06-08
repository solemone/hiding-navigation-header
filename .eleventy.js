const Image = require("@11ty/eleventy-img");
const env = process.env.ELEVENTY_ENV;
module.exports = function (eleventyConfig) {
  function getFileNameFromManifest(fileName, manifest) {
    const _fileName = fileName;
    const _pathJSON = require(manifest);
    const _output = _pathJSON[_fileName];
    return _output;
  }
  // {{ main.js | jsfile }}
  eleventyConfig.addFilter("jsfile", function (fileName) {
    if (env === "production") {
      return getFileNameFromManifest(fileName, `./site/js/paths.json`);
    } else {
      return fileName;
    }
  });

  // {{ base.css | cssfile }}
  eleventyConfig.addFilter("cssfile", function (fileName) {
    if (env === "production") {
      return getFileNameFromManifest(fileName, `./site/css/paths.json`);
    } else {
      return fileName;
    }
  });
  
  // {% includeCSS "main.css" %}
  eleventyConfig.addShortcode("includeCSS", function(fileName) {
    let _output;
    if (env === "production") {
      const _manifest = `./site/css/paths.json`;
      const pathJSON = require(_manifest);
      const _fileName = `${fileName}`;
      let _fileContent = fs.readFileSync(`./site/css/${pathJSON[_fileName]}`, 'utf8');
      _fileContent = _fileContent.replace(/\.\.\//g, "/");
      _output = `<style>${_fileContent}</style>`;
    } else {
      _output = `<link rel="stylesheet" href="/css/${fileName}">`;
    }
    return _output;    
  });
  
  

  // Shortcode for responsive images
  async function imageShortcode(src, alt, sizes) {
    let widths;
    let formats;
    if (env === "production") {
      widths = [800, 1000, 1440, 2000, 2880, null];
      formats = ["avif", "webp", null];
    } else {
      widths = [null];
      formats = [null];
    }

    let metadata = await Image(src, {
      widths: widths,
      formats: formats,
      outputDir: "./site/img/",
      sharpAvifOptions: {
        quality: 70,
      },
      sharpJpegOptions: {
        progressive: true,
      },
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  }

  eleventyConfig.addShortcode("image", imageShortcode);

  // enable »dynamicPartials« to use a variable for include paths
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
  });
  
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img/**/*.svg");

  eleventyConfig.setBrowserSyncConfig({
    notify: true,
    port: 3000,
    open: true,
    files: ["./site/css/**/*.css", "./site/js/**/*.js"]
  });

  return {
    dir: {
      input: "src",
      data: "data",
      output: "site",
      layouts: "layouts",
      includes: "includes"
    }
  };
};
