import { Routes, Route } from 'react-router-dom';
import Tarefas from './pages/Tarefas';
import Login from './pages/Login';
import ProtectedRouter from './routes/AppRouter';

export default function App(){
  return(
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<ProtectedRouter><Tarefas /></ProtectedRouter>} />
    </Routes>
  )
}