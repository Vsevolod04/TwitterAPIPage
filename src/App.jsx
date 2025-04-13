import { useState } from "react";
import "./App.css";
import { Button, TextField } from "@mui/material";
export default App;

function App() {
  const [txt, setTxt] = useState("");
  const [url, setUrl] = useState(null);
  const [isBlocked, setBlock] = useState(false);

  const blurHandler = (event) => {
    const val = event.target.value.trim();
    setTxt(val);
  };

  const changeHandler = (event) => {
    const val = event.target.value;
    setTxt(val);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setBlock(true);
    const videos = await getVideos(txt);
    if (videos == null) {
      setUrl(null);
    } else {
      const link =
        "https://www.youtube.com/embed/" + String(videos.items[0].id);
      console.log(videos);
      setUrl(link);
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
              slotProps={{ htmlInput: { maxLength: 50 } }}
              value={txt}
              onChange={changeHandler}
              placeholder="Введите ключевые слова"
              onBlur={blurHandler}
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
          ></iframe>
        </div>
      </main>
    </>
  );
}

//Обращение к API
async function getVideos(keywords) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API;
  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    regionCode: "RU",
    maxResults: 10,
    key: apiKey,
  });

  const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
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
