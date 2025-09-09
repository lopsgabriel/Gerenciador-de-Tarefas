import Alert from '@mui/material/Alert';

export default function ErroAlerta({ visivel, mensagem}){
  if (!mensagem) return null;
  return (
    <div className='w-full justify-end mr-5 flex relative' 
      style={{ position: 'fixed', top: '5rem', 
        opacity: visivel ? 1 : 0, transition: 'opacity 0.5s ease-in-out' 
      }}
    >
    <Alert severity="error">{mensagem}</Alert>
    </div>
  )
}