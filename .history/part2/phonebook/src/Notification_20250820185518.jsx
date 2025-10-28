const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }
    return (
        <div className={`notificatio`}>
            {message}
        </div>
    )
}
export default Notification