const { registerFont, createCanvas, loadImage  } = require('canvas')

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;

registerFont('feltmark.ttf', { family: 'felt' });

const canvas = createCanvas(1024, 900);
const ctx = canvas.getContext("2d");

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const dowNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function ordinal(d) {
    const ords = [null, 'st', 'nd', 'rd', 'th']; 
    return d < 4 ? ords[d] : ords[4];
}

function getCaption(type = null) {
    const types = ['century', 'fullyear', 'year', 'month', 'week', 'day'];
    const _type = type || types[Math.floor(Math.random()*types.length)];
    const today = new Date();
    const time = today.getHours() + ':' + String(today.getMinutes()).padStart(2, "0");
    const day = today.getDate() + ordinal(today.getDate());
    const dayOfWeek = dowNames[today.getDay()];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();

    switch ( _type ) {
        case 'century':
            return ['century', `year ${year}` ];
        case 'fullyear':
            return ['year', `${day} of ${month}`];
        case 'year': 
            return ['year', month];
        case 'month':
            return ['month', `the ${day}`];
        case 'week':
            return ['week', dayOfWeek];
        case 'day':
            return ['day', time];
        default:
            return ['...', '...'];
    }
}

// returns x offset to make text appear centered in the speech bubble
function getTextXPosition(caption, offset = 0) {
    const iamgeWidth = 1024;
    const textWidth = ctx.measureText(caption ).width;

    return (iamgeWidth - offset - textWidth) / 2;
}

app.get('/*', async (req, res) => {
    const endpoint = req.url.replace(/\W/gi, ''); // remove everything but letters

    // set up texts
    const captions = getCaption(endpoint);
    const text1string = `What a ${captions[0]}, huh?`;
    const text2string = `Captain, it's ${captions[1]}`;

    // load background image
    const localImage = await loadImage("./img.jpg");
    ctx.drawImage(localImage, 0, 0);

    // set font style
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = "2px";
    ctx.textBaseline = "top";

    // first bubble speech
    ctx.font = '52px felt';
    ctx.fillText(text1string, getTextXPosition(text1string), 150);

    // second bubble speech
    ctx.font = '43px felt';
    ctx.fillText(text2string, getTextXPosition(text2string, 244), 298);

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res); // return canvas as png image
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
})
