import { useState } from "react";
import "./App.css";
import { Button, TextField } from "@mui/material";
export default App;

function App() {
  const [keywords, setKeywords] = useState(""); //ключевые слова
  const [url, setUrl] = useState(null); //текущее видео
  const [videosList, setVideos] = useState([]); //массив видео
  const [isBlocked, setBlock] = useState(false); //блокировка кнопки
  const [videosCount, setCount] = useState(0); //количество видео
  const [currentPage, setPage] = useState(0); //номер текущего видео

  const blurHandler = (event) => {
    const val = event.target.value.trim();
    setKeywords(val);
  };

  const changeHandler = (event) => {
    const val = event.target.value;
    setKeywords(val);
  };

  const nextVideo = () => {
    let cur = currentPage;
    if (cur < videosCount) {
      setPage(++cur);
    } else if (videosCount != 0) {
      setPage(1);
      cur = 1;
    }
    if (videosCount != 0) {
      const link =
        "https://www.youtube.com/embed/" +
        String(videosList[cur - 1].id.videoId);
      setUrl(link);
    }
  };

  const prevVideo = () => {
    let cur = currentPage;
    if (cur == 1) {
      cur = videosCount;
      setPage(cur);
    } else if (videosCount != 0) {
      setPage(--cur);
    }

    if (videosCount != 0) {
      const link =
        "https://www.youtube.com/embed/" +
        String(videosList[cur - 1].id.videoId);
      setUrl(link);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setBlock(true);
    const videos = await getVideos(keywords);
    if (videos == null || videos.items.length == 0) {
      setKeywords("Ошибка при выполнении запроса");
      setIds([]);
      setUrl(null);
      setCount(0);
      setPage(0);
    } else {
      const link =
        "https://www.youtube.com/embed/" + String(videos.items[0].id.videoId);
      console.log(videos);

      setCount(videos.items.length);
      setPage(1);
      setUrl(link); //установка первого видео
      setVideos(videos.items);
    }
    setTimeout(setBlock, 3000, false);
  };

  return (
    <>
      <main>
        <div id="container">
          <form onSubmit={submitHandler}>
            <TextField
              type="text"
              variant="outlined"
              name="keywords"
              label="Введите ключевые слова"
              slotProps={{ htmlInput: { maxLength: 50 } }}
              value={keywords}
              onChange={changeHandler}
              onBlur={blurHandler}
              helperText="Спецсимволы запрещены"
              fullWidth
              autoFocus
              required
            />
            <Button type="submit" variant="contained" disabled={isBlocked}>
              Получить видео
            </Button>
          </form>
          <iframe
            id="video"
            width="560"
            height="315"
            src={url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <div id="pagination">
            <Button type="button" variant="contained" onClick={prevVideo}>
              Назад
            </Button>
            <p>
              Видео {currentPage} из {videosCount}
            </p>
            <Button type="button" variant="contained" onClick={nextVideo}>
              Вперёд
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

//Обращение к API
async function getVideos(keywords) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API;
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q: keywords,
    regionCode: "RU",
    maxResults: 10,
    key: apiKey,
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  let data = null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    data = await response.json();
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  } finally {
    return data;
  }
}
