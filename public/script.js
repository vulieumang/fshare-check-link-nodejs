var form = document.querySelector('#form')
var loading = document.querySelector('#loading')
var res = document.querySelector('#res')

form.onsubmit = function(e) {
  e.preventDefault();
  loading.style = 'display: block'
  let formData = new FormData(form);
  var link = form.querySelector('#link').value
  link_cor = 'https://proxy1.vulieumang.workers.dev/'+link
  console.log(link_cor)
  fetch(link_cor, {
    method: 'GET',
    
  })
  .then(data => {
    return data.text();
  })
  .then(data => {
    loading.style = 'display: none'
    var doc = new DOMParser().parseFromString(data, "text/html");
    var size = doc.querySelector('#form-download #download-free').innerHTML.split('|')[1].trim()
    var name = doc.querySelector('.name.text_auto_down').innerText.trim()
    console.log(name)
    console.log(size)
    console.log(link)
    
    res.innerHTML= `Tên file: ${name}\nLink: ${link}\nSize: ${size}\nMình cảm ơn`

  })
  .catch(error => {
    console.log('Request failed', error);
  });
}

