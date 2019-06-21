const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;

  if (searchText.trim() === '') {
  	movie.innerHTML = "Упс, что то пошло не так!";
  	return;
  }

  const server = 'https://api.themoviedb.org/3/search/multi?api_key=398638300a88c411cb6a10a310329061&language=ru&query=%27' + searchText;
  movie.innerHTML = 'Загрузка';

  fetch(server)
    .then(function(value){
      if (value.status !== 200){
        return Promise.reject(value);
      }
      return value.json();
    })
    .then(function(output){
    	console.log('output', output);
      let inner = '';
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title;
        let dateItem = item.release_date || item.first_air_date || "неизвестна";
        let voteItem = item.vote_average || "??";
        let linkItem = "https://www.themoviedb.org/" + item.media_type + "/" + item.id;
        let urlPoster = item.poster_path ? ('https://image.tmdb.org/t/p/w500' + item.poster_path) : './img/nf.jpg';

        inner += `
        <div class="col-12 col-xl-3 col-md-4">
        <div class="card text-white bg-secondary mb-3 mr-3" style="width: 15rem;">
          <img src="${urlPoster}" class="card-img-top" alt="${nameItem}">
          <div class="card-body">
          	<h6 class="card-title">${nameItem}</h6>
          	<p class="card-text">Рейтинг: ${voteItem}</p>
          	<p class="card-text">Дата выхода: ${dateItem}</p>
          	<a href="${linkItem}" target="_blank" class="btn btn-primary">Подробнее</a>
          </div>
        </div>
        </div>
        `;
      });
      movie.innerHTML = inner;
    })
    .catch((reason) => {
      movie.innerHTML = 'Упс, что то пошло не так!';
      console.error(reason);
    });
  }

  searchForm.addEventListener('submit', apiSearch);