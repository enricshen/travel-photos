
// A function is used for dragging and moving teh image panel
function dragElement(element, direction) {
    var   md; // remember mouse down info
    const first  = document.getElementById("leftPanel");
    const second = document.getElementById("map");
	
	var calledWindowResize = false;

    element.onmousedown = onMouseDown;

    function onMouseDown(e) {
        //console.log("mouse down: " + e.clientX);
        md = {e,
              offsetLeft:  element.offsetLeft,
              offsetTop:   element.offsetTop,
              firstWidth:  first.offsetWidth,
              secondWidth: second.offsetWidth
             };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            //console.log("mouse up");
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(e) {
        //console.log("mouse move: " + e.clientX);
        var delta = {x: e.clientX - md.e.clientX, y: e.clientY - md.e.clientY};

        if (direction === "H" ) { // Horizontal
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);
			
			// get the window width
			var ww = window.innerWidth;
			// get the slider left position
			var sl = md.offsetLeft + delta.x;
			// get left panel width
			var lpw = (md.firstWidth + delta.x);
			// get the left panel width as percentage
			var lpwp = lpw/ww*100;
			// get right panel width
			var rpw = ww - sl + element.style.width;
			// get right panel percentage
			var rpwp = parseInt(String(rpw/ww*100));
			
			// set slider position
			element.style.left = sl + "px";
			
			// I use percentages as they work better than pixels
			// set the first panel width (as percentage)
			first.style.width = lpwp + "%";
			// set the right panel width (as percentage)
			second.style.width = rpwp + "%";
			//console.log("Window width: " + ww + " Second panel witdh: " + rpw + " Percentage: " + rpwp);
			
			// I call the resize event to fix a bug with the map not resizing correctly sometimes
			window.dispatchEvent(new Event('resize'));
        }
    }
}

// set the dragElement 
dragElement(document.getElementById("separator"), "H" );


function setImage(imgProperties){
	// if the panel has not be activated, set everything up
	if (!$("#leftPanel").hasClass("panelActive")) {
		// initalise the left panel.
		initLeftPanel();
	}
	
	// set all the properties
	$("#imageTitle").text(imgProperties.name);
	$("#imgAnchor").attr("href", imgProperties.image);
	$("#image").attr("src", imgProperties.thumbnail);
	$("#imageDateTaken").html("<strong>Date taken: </strong>" + imgProperties.date);
	$("#imageUploadedBy").html("<strong>Location: </strong>" + imgProperties.location + ", " + imgProperties.country);
}

function initLeftPanel() {
	// give it 20% of the window space
	$("#leftPanel").addClass("panelActive");
	// give the map 80%
	$("#map").css("width", "80%");
	
	$("#imageContainer").addClass("imageContainer");
	$("#image").removeAttr("hidden");
	$("#imageInstruction").text("Click on image to open in a new window");
}

// this was a test functioon for doing a query
// function queryMap(point) {
	// var width = 10;
	// var height = 20;
	// var features = map.queryRenderedFeatures([
		// [point[0] - width / 2, point[1] - height / 2],
		// [point[0] + width / 2, point[1] + height / 2]
		// ], { layers: ['unclustered-point'] });
// }