const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }
    return (
        <div className={`notifica`}>
            {message}
        </div>
    )
}
export default Notification