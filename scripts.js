function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìľḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '') // Replace spaces with ''
    .replace(/\d+/g, '') // Remove digits
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '') // Replace & with ''
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function createTOC() {
	var y = document.createElement('div');
	y.id = 'toc';
	var a = y.appendChild(document.createElement('a'));
	a.onclick = showhideTOC;
	a.href = '#showhide';
	a.id = 'tocheader';
	a.innerHTML = '+ obsah';
	var z = y.appendChild(document.createElement('div'));
	z.onclick = showhideTOC;
	var toBeTOCced = document.querySelectorAll('h1,h2,h3,h4');
	if (toBeTOCced.length < 2) return false;

	for (var i=0;i<toBeTOCced.length;i++) {
		var tmp = document.createElement('a');
		tmp.innerHTML = toBeTOCced[i].innerHTML;
		z.appendChild(tmp);
		if (toBeTOCced[i].nodeName == 'H1')
			tmp.className = 'b';
		if (toBeTOCced[i].nodeName == 'H3')
			tmp.className = 'indent';
		if (toBeTOCced[i].nodeName == 'H4')
			tmp.className = 'extraindent';
		var headerId = toBeTOCced[i].id || slugify(toBeTOCced[i].textContent);
		tmp.href = '#' + headerId;
		toBeTOCced[i].id = headerId;
	}
	return y;
}

var TOCstate = 'none';

function showhideTOC() {
	TOCstate = (TOCstate == 'none') ? 'block': 'none';
	var newText = (TOCstate == 'none') ? '+ obsah': '- obsah';
	document.getElementById('tocheader').innerHTML = newText;
	document.getElementById('toc').lastChild.style.display = TOCstate;
}

window.onload = function () {
    var ToC = createTOC();
    var header = document.querySelector('body>a');
    header.parentNode.insertBefore(ToC, header.nextSibling);
}
