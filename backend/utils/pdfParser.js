import fs from 'fs/promises';
import {PDFParse} from "pdf-parse";
/**

  * @param {string} filepath
 * @returns {Promise<{text: string,numPages : number}>}
**/
export const extractTextFromPDF = async(filepath)=>{
    try{
        const dataBuffer = await fs.readFile(filepath)
        const parse = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parse.getText();

        return {
            text:data.text,
            numPage :data.numPage,
            info :data.info
        };

    }catch(error){
        console.error("PDF parasing error:",error)
        throw new Error("Failed to extract text from PDF");
    }
};

