import { useState } from "react";
import "./App.css";
import { Button, TextField } from "@mui/material";

function getTweet(text){
  
}


function App() {
  const [txt, setTxt] = useState("");
  const [tweet, setTweet] = useState("");

  const changeHandler = (event) => {
    const val = event.target.value;
    setTxt(val);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(txt);
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
              placeholder="Введите ключевое слово или хэштег"
              fullWidth
              autoFocus
              required
            />
            <Button type="submit" variant="contained">
              Получить твит
            </Button>
          </form>

          <TextField
            name="tweet"
            id="tweet"
            value={tweet}
            placeholder="Здесь выводится найденный твит"
            multiline
            minRows={7}
            maxRows={10}
            readOnly
          />
        </div>
      </main>
    </>
  );
}

export default App;
