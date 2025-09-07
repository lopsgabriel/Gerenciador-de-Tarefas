import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { apiRequest } from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function aoEnviar(e) {
    e.preventDefault();
    setErro(null);
    try {
      const resposta = await apiRequest('login', { method: 'POST', body: { senha } });
      // console.log('resposta login', resposta);
      const token = typeof resposta === 'string' ? resposta : resposta?.token;
      if (!token) throw new Error('Servidor não retornou token.');
      dispatch(login(token));
      navigate('/');
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className='layout-root'>
      <div className='layout-container'>
        <span className='titulo-form'> Login </span>
        <form 
          onSubmit={aoEnviar} 
          className='login-form'
        >
          <p className='Nome-tarefa-form text-center'> Insira a senha de acesso </p>
          <input 
          className='senha-input'
          type="password" 
          placeholder='Senha'
          value={senha} 
          onChange={e=>setSenha(e.target.value)} />
          <button  type="submit" className='button'>Entrar</button>
          {erro && <p style={{color:'tomato'}}>{erro}</p>}
        </form>
      </div>
    </div>
  );
}
