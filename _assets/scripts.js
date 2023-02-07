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
  var path = window.location.pathname;
	a.onclick = showhideTOC;
	a.href = path + '#showhide';
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
		var ha = h.appendChild(el('a'));
		var headerId = h.id || hashtagify(h.innerText);
		tmp.href = path + '#' + headerId;
		ha.href = tmp.href;
		ha.className = 'anchor';
		ha.innerHTML = '#';
		h.id = headerId;
		h.prepend(ha);
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
            a.href = img.src.replace('.jpg', '.htm');
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

// PORTION MULTIPLIER
function detectUnits(){
    let re = /(\d+(?:–\d+)?(?:,|\.)?(?:\d+)?)(g|kg|ml|dl|l|ks|ČL)/g;
    let tpl = '<u class="amount" data-amount="$1">$1</u><i class="unit">$2</i>';
    let items = document.querySelectorAll('main li');
    [].forEach.call(items, (item) => {
        let text = item.textContent;
        let n = text.replace(re, tpl);
        n = n.replace('½', '<u class="amount" data-amount="0.5">½</u>');
        n = n.replace('¼', '<u class="amount" data-amount="0.25">¼</u>');
        item.innerHTML = n;
    });
}

function createVolInput(){
    var i = document.createElement("input");
    var br = document.createElement("br");
    i.setAttribute('type', 'number');
    i.setAttribute('id', 'portions');
    i.setAttribute('placeholder', 'Koľko porcií?');
    let header = document.querySelector('header');
    header.appendChild(br);
    header.appendChild(i);
}


function updateAmounts(portions){
    let amounts = document.getElementsByClassName('amount');
    [].forEach.call(amounts, (el) => {
        let n = el.getAttribute('data-amount');
        n = n.replace(',', '.');
        el.setAttribute('data-amount', n);
        if(n.includes('–')){
            let arr = n.split('–');
            let n1 = arr[0];
            let n2 = arr[1];
            prorated = `${Number(n1) * portions}–${Number(n2) * portions}`;
        } else {
            prorated = Number(n) * portions;
        }
        el.innerHTML = prorated;
    });
}


window.onload = function () {
    var ToC = createTOC();
    var header = document.querySelector('header');
    if(header){
    	header.parentNode.insertBefore(ToC, header.nextSibling);
    }
    loadPics();
	if(window.location.hash){
    	var my_hash = window.location.hash;
		location.hash = '#dummy';
		location.hash = my_hash;
	}

    // unit updating
	detectUnits();
    createVolInput();

    let portions = document.getElementById('portions');
    portions.addEventListener('input', function (evt) {
        updateAmounts(this.value);
    });
}
