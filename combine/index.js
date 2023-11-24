const fs = require('fs').promises;
const path = require('path');

async function extractFiles(relativeFilePath) {
  try {
    const filePath = path.resolve(relativeFilePath);
    const directory = path.dirname(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    const exportImportRegex = /^(export|import) (\*|\{.*\}) from '.*';$/gm;
    const exportImportMatches = data.match(exportImportRegex) || [];

    const extractedFilesFolders = exportImportMatches
      .map((match) => {
        const matchRegex = /'(.*)'/;
        const result = match.match(matchRegex);
        if (result) {
          const relativePath = result[1];
          // Resolve the absolute path of relativePath considering it's a sibling of filePath
          return path.resolve(directory, relativePath);
        }
        return null;
      })
      .filter((x) => x);

    const extractionCorrected = [];
    for (let file of extractedFilesFolders) {
      if (await isDirectory(file)) {
        file = path.join(file, 'index.ts');
      } else {
        file = `${file}.ts`;
      }
      if (await fileExists(file)) {
        extractionCorrected.push(file);
      }
    }
    return extractionCorrected;
  } catch (err) {
    // console.error(err);
    return [];
  }
}

async function isDirectory(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isDirectory();
  } catch (err) {
    // console.error(err);
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function recursivelyExtractFiles(filePath, extracted = new Set()) {
  const files = await extractFiles(filePath);

  for (let file of files) {
    if (!extracted.has(file)) {
      extracted.add(file);
      await recursivelyExtractFiles(file, extracted);
    }
  }

  return Array.from(extracted);
}

async function writeToFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content, { flag: 'a' }); // 'a' flag for appending content
  } catch (err) {
    console.error(err);
  }
}

async function processExtractedFiles(files, outputFilePath) {
  const exportImportRegex = /^(export|import) (\*|\{.*\}) from '.*';$/;
  let allImports = [];
  let allContent = [];

  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let lines = content.split('\n');

      let contentWithoutExportImport = lines.filter((line) => !exportImportRegex.test(line));

      allContent.push(contentWithoutExportImport.join('\n'));
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
    }
  }

  // Deduplicate imports
  allImports = [...new Set(allImports)];

  // Combine imports and content
  const finalContent = allImports.join('\n') + '\n\n' + allContent.join('\n\n');

  // Write the final content to the output file
  await writeToFile(outputFilePath, finalContent);
}

const relativeFilePath = process.env.FILE_PATH;
const outputFilePath = process.env.OUTPUT_FILE_PATH; // New env variable for the output file

recursivelyExtractFiles(relativeFilePath).then(async (files) => {
  console.log('Extracted Files:', files);
  if (await fileExists(outputFilePath)) {
    console.log('Output file already exists. Appending to it.');
    await fs.writeFile(outputFilePath, ''); // Clearing
  } else {
    console.log('Creating new output file.');
    await fs.writeFile(outputFilePath, ''); // Creating a new file if it doesn't exist
  }
  await processExtractedFiles(files, outputFilePath);
});
