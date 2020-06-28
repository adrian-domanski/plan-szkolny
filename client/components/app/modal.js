import React from "react";

const Modal = ({
  body,
  title = "Czy chcesz kontynuować?",
  isOpen,
  abort,
  close,
  submit
}) => {
  return (
    <div className={`modal ${isOpen ? "active" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-header__title">{title}</h1>
        </div>
        <div
          className="modal-body"
          dangerouslySetInnerHTML={{ __html: body }}></div>
        <div className="modal-footer">
          {close ? (
            <button className="btn btn--submit modal__btn" onClick={close}>
              Zamknij
            </button>
          ) : null}
          {abort ? (
            <button className="btn btn--abort modal__btn" onClick={abort}>
              Nie
            </button>
          ) : null}

          {submit ? (
            <button className="btn btn--submit modal__btn" onClick={submit}>
              Tak
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
