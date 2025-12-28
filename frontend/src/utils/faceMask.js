export async function drawMaskOnFace(canvas, detector, inputSource, maskImage) {
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save(); 

    ctx.scale(-1, 1); 
    ctx.translate(-canvas.width, 0); 


    ctx.drawImage(inputSource, 0, 0, canvas.width, canvas.height);

    ctx.restore(); 

    if (inputSource.readyState !== 4) { 
        return; 
    }

    const faces = await detector.estimateFaces(inputSource);

    if (faces.length > 0) {
        const face = faces[0];
        const box = face.box;

        const faceWidth = box.xmax - box.xmin;
        const faceHeight = box.ymax - box.ymin;

        const maskScaleFactor = 1.3; 
        const maskDrawWidth = faceWidth * maskScaleFactor;
        
        const faceCenter_X = box.xmin + (faceWidth / 2);
        
        const maskDrawX_Unflipped = faceCenter_X - (maskDrawWidth / 2);
        const maskDrawX_Mirrored = canvas.width - (maskDrawX_Unflipped + maskDrawWidth); 
        
        const verticalOffset = 0.25; 
        const maskDrawY = box.ymin - (faceHeight * verticalOffset);

        const maskDrawHeight = maskDrawWidth * (maskImage.naturalHeight / maskImage.naturalWidth);

        ctx.drawImage(
            maskImage,
            maskDrawX_Mirrored,
            maskDrawY, 
            maskDrawWidth, 
            maskDrawHeight 
        );
    }
}