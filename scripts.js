function hashtagify(string) {
  // shorten and slugify
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìľḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string
    .toString()
    .toLowerCase()
    .split(' a ')[0]
    .split('/')[0]
    .split('(')[0]
    .split('–')[0]
    .split('-')[0]
    .replace(/\s+/g, '') // Replace spaces with ''
    .replace(/\d+/g, '') // Remove digits
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '') // Replace & with ''
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function el(tagName){
  // create element shortcut util
	return document.createElement(tagName);
}

function createTOC() {
  // creates table of contents
	var y = el('div');
	y.id = 'toc';
	var a = y.appendChild(el('a'));
	a.onclick = showhideTOC;
	a.href = '#showhide';
	a.id = 'tocheader';
	a.innerHTML = '+ obsah';
	var z = y.appendChild(el('div'));
	z.onclick = showhideTOC;
	const toBeTOCced = document.querySelectorAll('h1,h2,h3,h4');
	if (toBeTOCced.length < 2) return false;

	for (var h of toBeTOCced) {
		var tmp = el('a');
		tmp.innerHTML = h.innerHTML;
		z.appendChild(tmp);
		if (h.nodeName == 'H1') tmp.className = 'b';
		if (h.nodeName == 'H3') tmp.className = 'indent';
		if (h.nodeName == 'H4') tmp.className = 'extraindent';
		var headerId = h.id || hashtagify(h.innerText);
		tmp.href = '#' + headerId;
		h.id = headerId;
	}
	return y;
}

function createFooter(){
  // renders a footer with copyright, link to hoepage and credits
	let f = el('footer');
	let p = f.appendChild(el('p'));
	p.innerText = "© Copyright 2002-2021. Všetky práva vyhradené | ";
	var a = p.appendChild(el('a'));
	a.href = '.';
	a.innerText = 'Normy jedál'

	var span = p.appendChild(el('span'));
	span.innerText = ' | '

	var a2 = p.appendChild(el('a'));
	a2.href = 'https://unilexicon.com/fm/';
	a2.innerText = 'FM'
	return f;
}

var TOCstate = 'none';

function showhideTOC() {
	TOCstate = (TOCstate == 'none') ? 'block': 'none';
	var newText = (TOCstate == 'none') ? '+ obsah': '- obsah';
	document.getElementById('tocheader').innerHTML = newText;
	document.getElementById('toc').lastChild.style.display = TOCstate;
}

function renderPics() {
  const piclist = this.responseText.split('\n');
  const headings = document.querySelectorAll('h2,h3');
  // console.log(piclist);
  for (var l of piclist) {
    let [dot, hash, fn] = l.split('/');
    if(hash){
      var h = document.getElementById(hash);
      if(h){
        // console.log(h);
        if(fn.endsWith('.jpg') && fn.indexOf('_UTC_') === -1){
            let a = el('a');
            let img = el('img')
            img.src = 'pic/'+hash+'/'+fn;
            a.href = img.src;
            a.setAttribute("target", "_blank");
            a.onclick = function(e){
            	// e.preventDefault();
            	console.log(a.href)
            };
            a.appendChild(img);
            h.parentNode.insertBefore(a, h.nextSibling);
        }
      }
    }
  }
}

function loadPics(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", renderPics);
  oReq.open("GET", "pics.txt");
  oReq.send();
}

window.onload = function () {
    var ToC = createTOC();
    var header = document.querySelector('body>a');
    if(header){
    	header.parentNode.insertBefore(ToC, header.nextSibling);
    }
    loadPics();
    var footer = createFooter();
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(footer);
}
