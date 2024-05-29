import React from 'react'

const ModalContext = React.createContext(null)
ModalContext.displayName = "ModalContext"

function useModal() {
  const context = React.useContext(ModalContext)
  if (!context) throw new Error("useModal are using outside of ModalProvider, please navigate back")
  return context
}

function Modal(props) {
    const [openName, setOpenName] = React.useState("")

    function handleClose() {
        setOpenName("")
    }

    function handleOpen(name) {
        setOpenName(name)
    }

   return <ModalContext.Provider value={{ openName, handleOpen, handleClose}} {...props}/>
}

function Open({ name, children }) {
    const { handleOpen } = useModal()
    return React.cloneElement(
        children,
        {
            onClick: () => handleOpen(name)
        }
    )
}

function Window({ name: windowName, children }) {
    const { openName, handleClose } = useModal()
    if (windowName !== openName) return null
    return <React.Fragment>
        <div className={"fixed bg-[#FFFFFF19] top-0 left-0 w-[100%] h-[100%] z-10 backdrop-blur-sm"} onClick={handleClose}/>
        <div className={"fixed grid top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20 bg-primary-900 py-8 px-10 w-[500px]"}>
            {React.cloneElement(
                children,
                {onCloseModal: handleClose}
            )}
        </div>
    </React.Fragment>
}


export {useModal, Modal, Open, Window}