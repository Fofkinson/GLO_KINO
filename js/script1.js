const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  server = 'https://api.themoviedb.org/3/search/multi?api_key=398638300a88c411cb6a10a310329061&language=ru&query=%27' + searchText;
  movie.innerHTML = 'Загрузка';
  requestApi(server)
    .then(function (result) {
      const output = JSON.parse(result);
      console.log(output);
      let inner = '';
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title;
        let dateItem = item.release_date || item.first_air_date || "неизвестна";
        console.log(nameItem);
        inner += `<div class="col-12">"${nameItem}". <i>Дата выхода: ${dateItem}</i></div>`;
      });
      movie.innerHTML = inner;
    })
    .catch(function(reason){
      movie.innerHTML = 'Упс, что то пошло не так!';
      console.log('error: ' + request.status);
    });
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('load', function () {
      if (request.status !== 200) {
        reject({
          status: request.status
        });
        return;
      }

      resolve(request.response);

    })

    request.addEventListener('error', function () {
      reject({
        status: request.status
      });
    })

    request.send();
  })
}