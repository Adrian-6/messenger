import { createBrowserHistory } from "history";
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch } from "./app/hooks";
import Layout from "./assets/Layout";
import MissingPage from "./assets/MissingPage";
import Login from "./features/auth/Login";
import { setChattUrl } from "./features/auth/authSlice";
import PersistCredentials from "./features/auth/persistCredentials";
import Chat from "./features/chat/Chat";

function App() {

  const history = createBrowserHistory();
  const dispatch = useAppDispatch()

  history.listen(({ location, action }) => {
    // this is called whenever new locations come in
    // the action is POP, PUSH, or REPLACE
    dispatch(setChattUrl());
  });

  return (
    <Routes>
      <Route path="/auth">
        <Route index element={<Login />} />
        <Route path="google" element={<Login />} />
      </Route>
      <Route path="/chat/test" element={<Layout />} />
      <Route element={<PersistCredentials />}>
        <Route path="/">
          <Route element={<Layout />}>
            <Route index element={<Chat />} />
            <Route path="chat" element={<Chat />}>
              <Route path=":chatId" element={<Chat />} >
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<MissingPage />} />
    </Routes >
  )
}

export default App
