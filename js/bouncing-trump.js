// --------------------------------------------------------------------------
// How To Load And Draw Images With HTML5 Canvas
// (c) 2015 Rembound.com
// http://rembound.com/articles/how-to-load-and-draw-images-with-html5-canvas
// --------------------------------------------------------------------------

// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("trump-canvas");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete
    var context = canvas.getContext("2d");
    
    // Timing and frames
    var lastframe = 0;

    var initialized = false;
    
    // Level properties
    var level = {
        x: 1,
        y: 1,
        width: canvas.width,
        height: canvas.height
    };
    
    // Define an entity class
    var Entity = function(image, x, y, width, height, xdir, ydir, speed) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xdir = xdir;
        this.ydir = ydir;
        this.speed = speed;
    };
    
    // Array of entities
    var entities = [];
    
    // Images
    var images = [];
    
    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;
    
    // Load images
    function loadImages(imagefiles) {
        // Initialize variables
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;
        
        // Load the images
        var loadedimages = [];
        for (var i=0; i<imagefiles.length; i++) {
            // Create the image object
            var image = new Image();
            
            // Add onload event handler
            image.onload = function () {
                loadcount++;
                if (loadcount == loadtotal) {
                    // Done loading
                    preloaded = true;
                }
            };
            
            // Set the source url of the image
            image.src = imagefiles[i];
            
            // Save to the image array
            loadedimages[i] = image;
        }
        
        // Return an array of images
        return loadedimages;
    }

    // Initialize
    function init(image) {
        // Random Tilt
        var tilt = Math.floor((Math.random() * 360) + 1);
        // Load images
        images = loadImages([image]);
        
        // Create random entities
        for (var i=0; i<1; i++) {
            var scale = randRange(75, 200);
            var imageindex = i % images.length;
            var xdir = 1 - 2 * randRange(0, 1);
            var ydir = 1 - 2 * randRange(0, 1);
            var entity = new Entity(images[imageindex], 0, 0, scale, scale, xdir, ydir, randRange(100, 100));

            // Set a random position
            entity.x = randRange(0, level.width-entity.width);
            entity.y = randRange(0, level.height-entity.height);

            // Add to the entities array
            entities.push(entity);
        }

        // Enter main loop
        main(0);
    }

    // Add Trump
    function addTrump(image) {
        // Load images
        images = loadImages([image]);

        // Create random entities
        for (var i=0; i<1; i++) {
            var scale = randRange(75, 200);
            var imageindex = i % images.length;
            var xdir = 1 - 2 * randRange(0, 1);
            var ydir = 1 - 2 * randRange(0, 1);
            var entity = new Entity(images[imageindex], 0, 0, scale, scale, xdir, ydir, randRange(100, 100));

            // Set a random position
            entity.x = randRange(0, level.width-entity.width);
            entity.y = randRange(0, level.height-entity.height);

            // Add to the entities array
            entities.push(entity);
        }
    }
    
    // Get a random int between low and high, inclusive
    function randRange(low, high) {
        return Math.floor(low + Math.random()*(high-low+1));
    }
    
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

        if (!initialized) {
            // Preloader
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the frame
            drawFrame();
            if (preloaded) {
                // Add a delay for demonstration purposes
                // setTimeout(function(){initialized = true;}, 1000);
                initialized = true;
            }
        } else {
            // Update and render
            update(tframe);
            render();
        }
    }
    
    // Update state
    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        // Update entities
        for (var i=0; i<entities.length; i++) {
            var entity = entities[i];
            
            // Move the entity, time-based
            entity.x += dt * entity.speed * entity.xdir;
            entity.y += dt * entity.speed * entity.ydir;
            
            // Handle left and right collisions with the level
            if (entity.x <= level.x) {
                // Left edge
                entity.xdir = 1;
                entity.x = level.x;
            } else if (entity.x + entity.width >= level.x + level.width) {
                // Right edge
                entity.xdir = -1;
                entity.x = level.x + level.width - entity.width;
            }
            
            // Handle top and bottom collisions with the level
            if (entity.y <= level.y) {
                // Top edge
                entity.ydir = 1;
                entity.y = level.y;
            } else if (entity.y + entity.height >= level.y + level.height) {
                // Bottom edge
                entity.ydir = -1;
                entity.y = level.y + level.height - entity.height;
            }
        }
    }
    
    // Render
    function render() {
        // Draw the frame
        drawFrame();
        
        for (var i=0; i<entities.length; i++) {
            // Draw the entity
            var entity = entities[i];
            context.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
        }
    }

    function reset() {
        // Clear the canvas TODO: make better
        entities = [];
        init(getRndTrump());
    }
    
    // Draw a frame with a border
    function drawFrame() {
        // Draw background
        context.fillStyle = "#363636";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function getRndTrump() {
        return "images/trump" + (Math.floor(Math.random() * (8 - 1) ) + 1) + ".png";
    }

    // Add Trump
    document.getElementById('add-trump').onclick = function(e) {
        addTrump(getRndTrump());
        // Show the remove trump button once there are more than 1 trump
        if (entities.length > 1) {
            document.getElementById("remove-trump").style.visibility = "visible";
        }
    }
    // Remove Trump
    document.getElementById('remove-trump').onclick = function(e) {
        entities.pop();
        // Hide the remove trump button once there is only 1 trump
        if (entities.length < 2) {
            document.getElementById("remove-trump").style.visibility = "hidden";
        }
    }
    // Reset
    document.getElementById('reset').onclick = function(e) {
        reset();
        // Hide the remove trump button once there is only 1 trump
        if (entities.length < 2) {
            document.getElementById("remove-trump").style.visibility = "hidden";
        }
    }

    // Call init to start
    init(getRndTrump());

};