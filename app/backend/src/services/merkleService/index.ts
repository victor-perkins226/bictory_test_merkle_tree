import fs from 'fs'
import util from 'util';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getWhiteLists = async () => {
  try {
    
    const data = await readFile(`${process.cwd()}/src/whitelists.json`);
    return JSON.parse(data.toString());
  }
  catch (error) {
    console.log('getWhiteListsError', error)
  }
  return null;
}

const addWhiteList = async (newAddress: string) => {
  try {
    const data = await readFile(`${process.cwd()}/src/whitelists.json`);
    
    let jsonData: string[] = JSON.parse(data.toString());
    if (jsonData) {
      jsonData = [...jsonData, newAddress];
    }
    else {
      if (jsonData.findIndex((dt) => dt == newAddress) >= 0) {
        return false;
      }
      jsonData = [newAddress];
    }
    console.log('jsonData', jsonData);
    await writeFile(`${process.cwd()}/src/whitelists.json`, JSON.stringify(jsonData));
    return true;
  }
  catch (error) {
    console.log('addWhiteList', error)
  }

  return false;
}

export default {
  getWhiteLists,
  addWhiteList
}