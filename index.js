const { registerFont, createCanvas, loadImage  } = require('canvas')

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;

registerFont('feltmark.ttf', { family: 'felt' })

const canvas = createCanvas(1024, 900);
const ctx = canvas.getContext("2d");


const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

function ordinal(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

function getCaption() {
    const today =  new Date();
    let day = today.getDate();
    day += ordinal(day);
    const month = monthNames[today.getMonth()];
    const caption = day + ' of ' + month;
    return caption;
}

async function createImage() {
    const caption = getCaption();
    const text1string = 'What a year, huh?';
    const text2string = 'Captain, it\'s ' + caption;


    const localImage = await loadImage("./img.jpg");       
    ctx.drawImage(localImage, 0, 0); 



    ctx.font = '52px felt'
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = "2px";
    ctx.textBaseline = "top";
    const text1Width =  textWidth = ctx.measureText(text1string ).width;
    const text1left = (1024 - text1Width) / 2;
    ctx.fillText(text1string, text1left, 150);

    ctx.font = '43px felt';

    const text2Width =  textWidth = ctx.measureText(text2string ).width;
    const text2left = (620 - text2Width) / 2 + 80;
    
    ctx.fillText(text2string, text2left, 298);

}

app.get('/whatayear.png', async (req, res) => {
    
    await createImage();
    res.setHeader('Content-Type', 'image/png');
    // res.send('hello world!')
    canvas.createPNGStream().pipe(res);

});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
})
