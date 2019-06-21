const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlImg = 'https://image.tmdb.org/t/p/w500';
const apiKey = 'f827fc972e4e548f3b85d8a8349b966f';

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  if(searchText.trim().length === 0){
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым!</h2>';
    return;
  }
 
  movie.innerHTML = '<div class="loader"><div class="item item-1"></div><div class="item item-2"></div><div class="item item-3"></div><div class="item item-4"></div></div>';
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ru&query=` + searchText)
    .then(function(value){
      if(value.status !== 200){
        return Promise.reject(value.status);
      }
      return value.json();
    })
    .then(function(output){
      // console.log(output);
      let inner = '';
      if (output.results.length === 0){
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено!</h2>';
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title;
        let rating = item.vote_average || 'нет';
        let dataItem = item.first_air_date || item.release_date || 'неизвестна';
        const poster = item.poster_path ? urlImg + item.poster_path : './img/noposter.jpg';
        let dataInfo = '';
        // console.log(nameItem);
        if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
        inner += 
        `<div class="col-12 col-md-4 col-xl-3 text-center cards">
          <div class="card mb-3">
            <img src="${poster}" class="card-img-top img_poster" alt="${nameItem}" title="${nameItem}" ${dataInfo}>
          <b class="text-primary">${nameItem}</b>
          <div class="card-body">
            <p class="card-text"><span class="badge badge-info p-2">Рейтинг: ${rating}</span></p>
            <p class="card-text text-primary">Дата выхода:<br/>${dataItem}</p>
            <a href="https://www.themoviedb.org/${item.media_type}/${item.id}" class="btn btn-primary" target="_blank">Перейти</a>
          </div>
          </div>
        </div>`;
      });
      movie.innerHTML = inner;

      addEventMedia();

    })
    .catch(function(reason){
      movie.innerHTML = '<div class="alert alert-danger text-center alert-dismissible fade show" role="alert">Упс, что-то пошло не так! <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      console.error('error: ' + reason);
    });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
  const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem){
      elem.style.cursor = 'pointer';
      elem.addEventListener('click', showFullInfo);
    });
}

function showFullInfo(){
  let url = '';
  if(this.dataset.type === 'movie'){
    url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=${apiKey}&language=ru`;
  }else if(this.dataset.type === 'tv'){
    url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=${apiKey}&language=ru`;
  }else {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка! Повторите позже!</h2>';
  }
  
  fetch(url)
    .then(function(value){
      if(value.status !== 200){
        return Promise.reject(value.status);
      }
      return value.json();
    })
    .then(function(output){      
      console.log(output);
      let genres = '';
      output.genres.forEach((genre) => { genres += genre.name + ', '})
      genres = genres.substr(0, genres.length - 2)
      movie.innerHTML = `
      <h3 class="col-12 text-center text-primary mb-3">${output.name || output.title}</h3>
      <div class="card mb-3">
        <div class="row no-gutters">
          <div class="col-md-3">
            <img src="${urlImg + output.poster_path}" class="card-img" alt="${output.name || output.title}" title="${output.name || output.title}">
            ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
            ${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ''}            
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h4 class="card-title text-primary">${output.original_name || output.original_title} <small class="text-muted">оригинальное название</small></h4>              
              <span class="badge badge-info p-2">Рейтинг: ${output.vote_average}</span>
              <p class="badge badge-dark p-2">Жанр: ${genres}</p>
              ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серия</p>` : ''}
              <p class="card-text">${output.overview}</p>
              <p class="card-text text-muted">Дата выхода: ${output.first_air_date || output.release_date || 'неизвестна'}</p>
            </div>
          </div>
        </div>
      </div>
      `;
    })
    .catch(function(reason){
      movie.innerHTML = '<div class="alert alert-danger text-center alert-dismissible fade show" role="alert">Упс, что-то пошло не так! <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      console.error('error: ' + reason);
    });
  
}

document.addEventListener('DOMContentLoaded', function(){
  fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=ru`)
    .then(function(value){
      if(value.status !== 200){
        return Promise.reject(value.status);
      }
      return value.json();
    })
    .then(function(output){
      // console.log(output);
      let inner = '<h4 class="col-12 text-center text-success pb-4">Подборка лучших на этой неделе!</h4>';
      if (output.results.length === 0){
        inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено!</h2>';
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title;
        let mediaType = item.title ? 'movie' : 'tv';
        let rating = item.vote_average || 'нет';
        let dataItem = item.first_air_date || item.release_date || 'неизвестна';
        const poster = item.poster_path ? urlImg + item.poster_path : './img/noposter.jpg';
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
        // console.log(nameItem);
        inner += 
        `<div class="col-12 col-md-4 col-xl-3 text-center cards">
          <div class="card mb-3">
            <img src="${poster}" class="card-img-top img_poster" alt="${nameItem}" title="${nameItem}" ${dataInfo}>
          <b class="text-primary">${nameItem}</b>
          <div class="card-body">
            <p class="card-text"><span class="badge badge-info p-2">Рейтинг: ${rating}</span></p>
            <p class="card-text text-primary">Дата выхода:<br/>${dataItem}</p>
            <a href="https://www.themoviedb.org/${item.media_type}/${item.id}" class="btn btn-primary" target="_blank">Перейти</a>
          </div>
          </div>
        </div>`;
      });
      movie.innerHTML = inner;

      addEventMedia();

    })
    .catch(function(reason){
      movie.innerHTML = '<div class="alert alert-danger text-center alert-dismissible fade show" role="alert">Упс, что-то пошло не так! <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      console.error('error: ' + reason);
    });
});