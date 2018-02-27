function fileLoad(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}


fileLoad("content/mdl/material.css", "css") ////dynamically load and add this .css file
fileLoad("content/mdl/mdl-fonts.css", "css") ////dynamically load and add this .css file
fileLoad("content/mdl/mdl-jquery-modal-dialog.css", "css") ////dynamically load and add this .css file

fileLoad("content/mdl/jquery-2.2.3.js", "js") //dynamically load and add this .js file
fileLoad("content/mdl/material.js", "js") //dynamically load and add this .js file
fileLoad("content/mdl/mdl-jquery-modal-dialog.js", "js") //dynamically load and add this .js file

fileLoad("content/transform.js", "js") //dynamically load and add this .js file
