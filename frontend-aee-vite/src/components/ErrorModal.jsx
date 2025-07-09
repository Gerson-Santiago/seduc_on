import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ErrorModal.css'

export default function ErrorModal({
  open = true,       // open undefined passa a ser true
  title,
  message,
  actions = [],      // ações personalizadas
  onClose,
}) {
  if (open === false) return null

  const navigate = useNavigate()
  const handleClose = () => {
    if (onClose) onClose()
    else navigate(import.meta.env.VITE_LOGIN_PATH)
  }

  // Se não houver ações personalizadas, adiciona “Voltar ao Login”
  const defaultActions = [
    {
      label: 'Voltar ao Login',
      onClick: handleClose,
    },
  ]
  const allActions = actions.length ? actions : defaultActions

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          {allActions.map((action, idx) => (
            <button key={idx} onClick={action.onClick}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
