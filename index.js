const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const generateImage = async (text, x, y, uuid, flag = '') => {
    try {
        let firstText = text;
        let image = {};

        if (flag == 'first') {
            image = await Jimp.read('./template.png');
        }else{
            error = false;
            do {
                try{
                    image = await Jimp.read(`./${uuid}.png`);
                    error = false;
                }catch(e){
                    error = true;
                }
            } while (error);
        }

        const font = await Jimp.loadFont('./fonts/k22.ttf/C1rvncEcAMYbW_dhq3GhK6ZY.ttf.fnt');

        const textHight = Jimp.measureTextHeight(font, firstText);

        const imageX = x;
        const imageY = y;

        const textOptions = {
            text: firstText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        };


        await image.print(font, imageX, imageY, textOptions, 1000, textHight);
        if (flag == 'latest') {
            fs.unlinkSync(`./${uuid}.png`);
            await image.writeAsync('./result.png'); 
        }else{
            await image.writeAsync(`./${uuid}.png`); 
        }
        

    } catch (e) {
        throw new Error(e)
    }
};



(async () => {

    const config = [
        {
            id: 1,
            sign: 'M1n007',
            x: -400,
            y: 20
        },
        {
            id: 2,
            sign: 'Aminudin',
            x: -270,
            y: 20
        }
    ];

    const uuid = uuidv4();

    config.map(async (data, i) => {
        if (i == 0) {
            await generateImage(data.sign, data.x, data.y, uuid, 'first')
        }else if(i+1 == config[config.length-1].id){
            await generateImage(data.sign, data.x, data.y, uuid, 'latest')
        }else{
            await generateImage(data.sign, data.x, data.y, uuid, '')
        }
        
    });

    
})();