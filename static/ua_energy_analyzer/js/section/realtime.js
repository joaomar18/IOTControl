        // Create an Image object
        const img_contactor_off = new Image();
        const img_contactor_on = new Image();

        // Set the image source (replace 'image.jpg' with your image's file path)
        img_contactor_off.src = '/static/ua_energy_analyzer/img/contactor_open.png';
        img_contactor_on.src = '/static/ua_energy_analyzer/img/contactor_closed.png';

        function drawCanvasWithBackground(image){
            // Get the canvas element
            const canvas = document.getElementById('realtime-image-animation');
            const ctx = canvas.getContext('2d');

            // Set the canvas width and height to match the image's dimensions
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw the image as the canvas background
            ctx.drawImage(image, 0, 0);

            // You can add additional drawing or interactions on top of the background image here if needed
        }