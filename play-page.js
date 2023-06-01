let idCard = JSON.parse(localStorage.getItem("idCard"));
const containPerformer = document.querySelector(".slider-performer .wrapper")
const containPlayPage = document.querySelector(".play-page");
let allDataMovies = JSON.parse(localStorage.getItem("allDataMovies"));
const cardMovie = document.querySelector("#playpage");
let skeletonArrayIndex = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];
let currentImgSearch = "";
let currentTitleSearch = "";
let currentLanguageSearch = "";
let currentOverviewSearch = "";
let currentReleaseSearch = "";
let currentVoteSearch = "";
let dataVideos = "";
let keyVideo = "";
let dataSimilar = "";
function checkIdCard(data, allData) {
  allData.forEach((item) => {
    if (data == item.id) {
      {
        currentImgSearch = item.poster_path;
        currentTitleSearch = item.title;
        currentLanguageSearch = item.original_language;
        currentOverviewSearch = item.overview;
        currentReleaseSearch = item.release_date;
        currentVoteSearch = item.vote_average;
      }
    }
    
  });
}
let checkAdded = false
let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
if(favoriteMovies.find(item => item.id === idCard)){
  checkAdded = true
}else{
  checkAdded = false
}
function addFavoriteMovie(id,object) {
  const addBtn = document.querySelector(".reference h5 .add")
  const removeBtn = document.querySelector(".reference h5 .remove")

  if (!favoriteMovies.find(item => item.id === id)) {
    addBtn.style.display = 'none'
    removeBtn.style.display = 'block'
    favoriteMovies.push(object);

    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
  
  } else if(favoriteMovies.find(item => item.id === id)) {
    addBtn.style.display = 'block'
    removeBtn.style.display = 'none'
    var foundItem = favoriteMovies.find(item => item.id === id)
    if (foundItem) {
      var index = favoriteMovies.indexOf(foundItem);
      favoriteMovies.splice(index, 1);
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
  }

}


async function getKeyVideo(idCard) {
  renderMovieChooseError();
 
  let apiMovie = `https://api.themoviedb.org/3/movie/${idCard}/videos?api_key=21a74c685cbdafbea65d58ebd993168f`;
  dataVideos = await fetch(apiMovie)
    .then((res) => res.json())
    .then((dataVideos) => {
      dataVideos.results[0].key =
        "https://www.youtube.com/embed/" + dataVideos.results[0].key;
      keyVideo = dataVideos.results[0].key;
      checkIdCard(idCard, allDataMovies);
      renderMovieChoose(keyVideo);
    })
    .catch((error) => {
      renderMovieChooseError();
    });
}

function renderMovieChoose(url) {
  function Render() {
    let objectFavourite = {
      'id': idCard,
      'name' : currentTitleSearch,
      'image' : currentImgSearch,
      'date' : currentReleaseSearch
    }
    const addMovie = () =>{
      addFavoriteMovie(idCard,objectFavourite)
    } 
    return (
      <div className="row">
        <div className="reference">
         
          <div className="col l-4 m-12 c-12">
           
            <img src={currentImgSearch} alt="" />
          </div>
          <div className="col l-8 m-12 c-12">
            <h1>
              <span>{currentTitleSearch}</span>
            </h1>
            <p>
              <span>Status:</span> Trailer
            </p>
            <h2>
              <span>language:</span> {currentLanguageSearch}
            </h2>
            <h3>
              <span>Overview:</span> {currentOverviewSearch}
            </h3>
            <h4>
              <span>Release date:</span> {currentReleaseSearch}
            </h4>
            <small>
              <span>Vote average:</span> {currentVoteSearch}
            </small>
            <h5>
            <button className ="add" onClick={addMovie} style = {checkAdded ? {display:'none'}:{display:'block'}}>Add to the favourite movie</button>
            <button onClick={addMovie} className="remove" style = {checkAdded ? {display:'block'}:{display:'none'}} >Remove to the favourite movie</button>
            </h5>
          </div>
        </div>
        {url ? (
          <iframe
            className="grid wide iframe"
            title="Video player"
            frameBorder="0"
            src={keyVideo}
            allowFullScreen
          ></iframe>
        ) : null}
      </div>
    );
  }
  ReactDOM.render(<Render />, containPlayPage);
}
function renderMovieChooseError() {
  function Render() {
    return (
      <div className="row">
        <div className="reference">
          <div className="col l-4 m-12 c-12">
            <div className="content">
              <img
                src="	https://www.solidbackgrounds.com/images/2480x3508/2480x3508-dark-slate-gray-solid-color-background.jpg"
                alt=""
              />
            </div>
          </div>
          <div className="col l-8 m-12 c-12">
            <h1>
              <span>Loading title...</span>
            </h1>
            <p>
              <span>Status:</span> Loading...
            </p>
            <h2>
              <span>language:</span> Loading...
            </h2>
            <h3>
              <span>Overview:</span> Loading...
            </h3>
            <h4>
              <span>Release date:</span> Loading...
            </h4>
            <small>
              <span>Vote average:</span> Loading...
            </small>
          </div>
        </div>
        <div className="content grid wide iframe" >
          <div id="color-iframe">
            <img  src= "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/5120x2880-dark-blue-solid-color-background.jpg/2560px-5120x2880-dark-blue-solid-color-background.jpg"/>
          </div>
        
        </div>
        
      </div>
    );
  }
  ReactDOM.render(<Render />, containPlayPage);
}
containMovie.id == "playpage" ? getKeyVideo(idCard) : null;



async function getListPerformer(idCard){
  renderLoaderListPerformer()
  await fetch(`https://api.themoviedb.org/3/movie/${idCard}/credits?api_key=21a74c685cbdafbea65d58ebd993168f`)
  .then(res=> res.json())
  .then(data=>{
    data.cast.forEach(item=>{
      if(item.profile_path == null){
        item.profile_path = "https://image.tmdb.org/t/p/w500/4PgEGuAb2KkaRb7P9PdK40pPeVH.jpg"
      } else{
        item.profile_path  = 'https://image.tmdb.org/t/p/w500' + item.profile_path
      }
      
    })
    
    renderListPerfomer(data.cast)
  })
  .catch(error=>{
    renderLoaderListPerformer()
  })
}
function renderListPerfomer(data){
function Render(){
  return(
    <div className="row list-moviecast">
             {
              data.map(item=>(
                <div key ={item.id} className="item col l-3 m-4 c-4">
                <img src={item.profile_path} alt=""/>
                <h1>{item.name}</h1>
            </div>
              ))
             }
             
    </div>
  )
}
  ReactDOM.render(<Render />, containPerformer);
}
function renderLoaderListPerformer(){
  function Render(){
    return(
      <div className="row list-moviecast">
               {
                skeletonArrayIndex.map(item=>(
                  <div key ={item} className="item col l-3 m-4 c-4">
                    <div className="content">
                  <img src="https://www.solidbackgrounds.com/images/2480x3508/2480x3508-dark-slate-gray-solid-color-background.jpg" alt=""/>
                    </div>

                  <h1>Loading...</h1>
              </div>
                ))
               }
               
      </div>
    )
  }
  ReactDOM.render(<Render />, containPerformer);

}
containMovie.id == "playpage" ? getListPerformer(idCard) : null
function handleData(data) {
  data.forEach((item) => {
    if (item.title == undefined) {
      item.title = item.name;
    }
    if (item.release_date == undefined) {
      item.release_date = item.first_air_date;
    }
    item.poster_path = "https://image.tmdb.org/t/p/w500" + item.poster_path;
    item.backdrop_path = "https://image.tmdb.org/t/p/w500" + item.backdrop_path;
  });
}

async function handleSimilar() {
  renderError();
  const apiSimilarMovies = `https://api.themoviedb.org/3/movie/${idCard}/similar?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&page=1`;
  dataSimilar = await fetch(apiSimilarMovies)
    .then((res) => res.json())
    .then((dataSimilar) => {
      handleData(dataSimilar.results)
     dataSimilar.results.forEach(item=>{
      allDataMovies.push(item)
     })
     localStorage.setItem("allDataMovies",JSON.stringify(allDataMovies))
      renderSimilarMovies(dataSimilar.results);
      const getMoviesSimilar = document.querySelectorAll(".similar");
      getMoviesSimilar.forEach((movie) => {
        movie.addEventListener("click", () => {
          
          localStorage.setItem("idCard", JSON.stringify(movie.id));
          window.location.href = "./play-page.html";
        }); 
      });
    })
    .catch((error) => {
      renderError();
    });
}
function renderSimilarMovies(data) {
  function RenderSimilarMovies() {
    handleData(data);
    return (
      <div className="row">
        {data.map((item, index) => (
          <div className="col l-3 m-4 c-4" key={item.id}>
            <div className="card similar" id={item.id}>
              <div>
                <a href="#">
                  {" "}
                  {item.poster_path == "https://image.tmdb.org/t/p/w500null" ? (
                    <img
                      className="alt-img"
                      src="https://image.tmdb.org/t/p/w500/3kBangW2OBBNkqYyp48blW9cwE5.jpg"
                    />
                  ) : (
                    <img src={item.poster_path} />
                  )}
                </a>
                <img
                  className="play"
                  src="https://cdn-icons-png.flaticon.com/512/189/189638.png"
                />
              </div>
              <h1>{item.title}</h1>
              <small>{item.release_date}</small>
            </div>
          </div>
        ))}
      </div>
    );
  }
  ReactDOM.render(<RenderSimilarMovies />, cardMovie);
}
function renderError() {
  function Loader(props) {
    return (
      <div className="col l-3 m-4 c-4" key={props.index}>
        <div className=" card-recss" id={props.index}>
          <div>
            <div className="card-loader">
              <div className="content">
                <img src="	https://www.solidbackgrounds.com/images/2480x3508/2480x3508-dark-slate-gray-solid-color-background.jpg" />
              </div>
            </div>
          </div>
          <h1 className="loader-text">{props.title}</h1>
          <small className="loader-text">{props.public}</small>
        </div>
      </div>
    );
  }
  function RenderLoader() {
    return (
      <div className="row">
        {skeletonArrayIndex.map((item, index) => (
          <Loader
            key={item}
            id={item}
            title="Loading title..."
            public="Loading release date..."
          />
        ))}
      </div>
    );
  }
  ReactDOM.render(<RenderLoader />, containMovie);
}
containMovie.id == "playpage" ? handleSimilar() : null;
