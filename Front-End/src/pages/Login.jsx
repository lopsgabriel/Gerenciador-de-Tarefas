import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { apiRequest } from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Login
 * - Exibe um formulário simples para autenticação por senha única.
 * - Ao enviar, chama a API (`POST /login`), armazena o token no Redux e redireciona para "/".
 * - Erros de rede/servidor são mostrados abaixo do botão.
 */
export default function Login() {
  // Estado local para controlar a senha digitada e mensagens de erro
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);

  // Hooks da app: Redux para despachar ações e Router para navegar
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Função de envio do formulário.
   * - Previne o reload padrão do browser.
   * - Chama a API de login; aceita tanto { token } quanto string.
   * - Em caso de success: salva token no Redux e navega para a home.
   * - Em caso de erro: mostra uma mensagem amigável.
   */
  async function aoEnviar(e) {
    e.preventDefault();
    setErro(null);
    try {
      // Faz a requisição; `apiRequest` já deve aplicar baseURL e headers
      const resposta = await apiRequest('login', { method: 'POST', body: { senha } });

      // Aceita payloads no formato { token } OU string simples com o token
      const token = resposta?.token || (typeof resposta === 'string' ? resposta : null);
      if (!token) throw new Error('Servidor não retornou token.');

      // Salva o token na store (redux/authSlice)
      dispatch(login(token));

      // Redireciona para a rota principal após autenticar
      navigate('/');
    } catch (err) {
      // Erro genérico exibido na UI
      setErro(err.message);
    }
  }

  return (
    <div className='layout-root'>
      <div className='layout-container'>
        <span className='form-title'> Login </span>
        <form 
          onSubmit={aoEnviar} 
          className='login-form'
        >
          <p className='input input--title text-center'> Insira a senha de acesso </p>
          <input 
          className='input input--password'
          type="password" 
          placeholder='Senha'
          value={senha} 
          onChange={e=>setSenha(e.target.value)} />
          
           {/* Botão de submit do formulário */}
          <button  type="submit" className='btn btn--primary'>
            Entrar
          </button>
          {/* Mensagem de erro visível e identificável para tecnologias assistivas */}
          {erro &&
           <p style={{color:'tomato'}}>
              {erro}
           </p>}
        </form>
      </div>
    </div>
  );
}
