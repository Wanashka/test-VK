import s from './App.module.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import heart from './image/heart.svg';
import headerBorder from './image/heart_border.svg';

function App() {

  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [loveCatsId, setLoveCatsId] = useState([])
  const [viewLoveCats, setViewLoveCats] = useState(false)

  const downloadCats = () => {
    setLoading(true)
    const apiUrl = 'https://api.thecatapi.com/v1/images/search?limit=30&api_key=live_i0OTYxLtTHsJC642fJWgjicQ1lBrFRBy6y6uccRJKoca0NNdJu5ddrtwIqdLhPa0'
    axios.get(apiUrl).then((resp) => {
      const allPersons = resp.data;
      setCats(() => [...cats, ...allPersons]);
      setLoading(false);
    });
  }

  useEffect(() => {
    downloadCats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 && !loading
      ) {
        downloadCats()
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  const addLove = (id) => {
    if (loveCatsId.includes(id)) {
      setLoveCatsId(loveCatsId.filter((item) => item !== id))
    } else {
      setLoveCatsId(() => [...loveCatsId, id])
    }
  }

  const viewCats =
    (viewLoveCats ? cats.filter((item) => loveCatsId.includes(item.id)) : cats).map((item, index) =>
      <div className={s.containerPhoto}>
        <img key={index} id={item.id} src={item.url} className={s.photo}/>
        <img onClick={() => addLove(item.id)} src={loveCatsId.includes(item.id) ? heart : headerBorder}
             className={s.likeCat}/>
      </div>
    )

  return (
    <div className={s.App}>
      <header className={s.header}>
        <button onClick={() => setViewLoveCats(false)}
                className={!viewLoveCats ? `${s.itemMenu} ${s.itemMenuSelected}` : `${s.itemMenu}`}>Все котики
        </button>
        <button onClick={() => setViewLoveCats(true)}
                className={viewLoveCats ? `${s.itemMenu} ${s.itemMenuSelected}` : `${s.itemMenu}`}>Любимые
          котики
        </button>
      </header>
      <div className={s.content}>
        <div className={s.photoCat}>
          {viewCats}
        </div>
        {loading && <div className={s.loadingCats}>... загружаем еще котиков ...</div>}
      </div>
    </div>
  );
}

export default App;
