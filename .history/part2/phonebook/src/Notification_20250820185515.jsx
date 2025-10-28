const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }
    return (
        <div className={`no`}>
            {message}
        </div>
    )
}
export default Notification